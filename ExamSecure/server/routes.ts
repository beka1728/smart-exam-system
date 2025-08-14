import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertExamSchema, 
  insertQuestionSchema, 
  insertSessionSchema,
  insertAnswerSchema 
} from "@shared/schema";
import { generateQuestionVariant, scoreShortAnswer, detectAnomalousPatterns } from "./openai";
import { ExamWebSocketServer } from "./websocket";
import { nanoid } from "nanoid";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Admin routes
  app.get('/api/admin/stats', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const stats = await storage.getSystemStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  app.get('/api/admin/users', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const { role } = req.query;
      const users = role ? await storage.getUsersByRole(role as string) : [];
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Exam management routes
  app.post('/api/exams', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'instructor' && user?.role !== 'admin') {
        return res.status(403).json({ message: 'Instructor access required' });
      }

      const examData = insertExamSchema.parse({
        ...req.body,
        instructorId: user.id
      });

      const exam = await storage.createExam(examData);
      res.json(exam);
    } catch (error) {
      console.error("Error creating exam:", error);
      res.status(500).json({ message: "Failed to create exam" });
    }
  });

  app.get('/api/exams', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      let exams;

      if (user?.role === 'admin') {
        exams = await storage.getActiveExams();
      } else if (user?.role === 'instructor') {
        exams = await storage.getExamsByInstructor(user.id);
      } else if (user?.role === 'student') {
        exams = await storage.getActiveExams();
      } else {
        return res.status(403).json({ message: 'Access denied' });
      }

      res.json(exams);
    } catch (error) {
      console.error("Error fetching exams:", error);
      res.status(500).json({ message: "Failed to fetch exams" });
    }
  });

  app.post('/api/exams/:id/start', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'instructor' && user?.role !== 'admin') {
        return res.status(403).json({ message: 'Instructor access required' });
      }

      const examId = req.params.id;
      await storage.updateExamStatus(examId, 'active');
      
      res.json({ message: 'Exam started successfully' });
    } catch (error) {
      console.error("Error starting exam:", error);
      res.status(500).json({ message: "Failed to start exam" });
    }
  });

  app.post('/api/exams/:id/stop', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'instructor' && user?.role !== 'admin') {
        return res.status(403).json({ message: 'Instructor access required' });
      }

      const examId = req.params.id;
      await storage.updateExamStatus(examId, 'completed');
      
      res.json({ message: 'Exam stopped successfully' });
    } catch (error) {
      console.error("Error stopping exam:", error);
      res.status(500).json({ message: "Failed to stop exam" });
    }
  });

  // Question management routes
  app.post('/api/exams/:id/questions', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'instructor' && user?.role !== 'admin') {
        return res.status(403).json({ message: 'Instructor access required' });
      }

      const questionData = insertQuestionSchema.parse({
        ...req.body,
        examId: req.params.id
      });

      const question = await storage.createQuestion(questionData);
      res.json(question);
    } catch (error) {
      console.error("Error creating question:", error);
      res.status(500).json({ message: "Failed to create question" });
    }
  });

  app.get('/api/exams/:id/questions', isAuthenticated, async (req: any, res) => {
    try {
      const examId = req.params.id;
      const questions = await storage.getQuestionsByExam(examId);
      res.json(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  });

  // Student exam session routes
  app.post('/api/exams/:id/paper', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'student') {
        return res.status(403).json({ message: 'Student access required' });
      }

      const examId = req.params.id;
      const exam = await storage.getExam(examId);
      
      if (!exam || exam.status !== 'active') {
        return res.status(400).json({ message: 'Exam not available' });
      }

      // Create exam session
      const sessionData = insertSessionSchema.parse({
        examId,
        studentId: user.id,
        studentSeed: nanoid(),
        deviceInfo: req.body.deviceInfo,
        ipAddress: req.ip,
        timeRemaining: exam.duration * 60, // Convert minutes to seconds
      });

      const session = await storage.createExamSession(sessionData);
      
      // Get base questions
      const baseQuestions = await storage.getQuestionsByExam(examId);
      
      // Generate AI variants if enabled
      let questions = baseQuestions;
      if (exam.aiEnabled) {
        questions = await Promise.all(
          baseQuestions.map(async (q) => {
            try {
              const variant = await generateQuestionVariant(
                q.content,
                q.difficulty,
                exam.title,
                session.studentSeed || nanoid()
              );
              
              return {
                ...q,
                id: nanoid(), // Generate new ID for variant
                content: variant.content,
                options: variant.options ? JSON.stringify(variant.options) : q.options,
                correctAnswer: variant.correctAnswer,
                baseQuestionId: q.id,
                aiGenerated: true,
              };
            } catch (error) {
              console.error('Failed to generate variant for question', q.id, error);
              return q; // Fall back to original question
            }
          })
        );
      }

      // Shuffle questions if enabled
      if (exam.shuffleQuestions) {
        questions.sort(() => Math.random() - 0.5);
      }

      res.json({
        session,
        questions,
        exam: {
          id: exam.id,
          title: exam.title,
          duration: exam.duration,
          timeLimit: exam.timeLimit,
        }
      });
    } catch (error) {
      console.error("Error creating exam paper:", error);
      res.status(500).json({ message: "Failed to create exam paper" });
    }
  });

  app.post('/api/sessions/:id/submit', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'student') {
        return res.status(403).json({ message: 'Student access required' });
      }

      const sessionId = req.params.id;
      const { answers } = req.body;

      // Verify session belongs to student
      const session = await storage.getExamSession(sessionId);
      if (!session || session.studentId !== user.id) {
        return res.status(403).json({ message: 'Unauthorized access to session' });
      }

      // Check time limit
      if (session.timeRemaining && session.timeRemaining <= 0) {
        return res.status(400).json({ message: 'Time limit exceeded' });
      }

      // Submit all answers
      const submittedAnswers = await Promise.all(
        answers.map(async (answer: any) => {
          const answerData = insertAnswerSchema.parse({
            sessionId,
            questionId: answer.questionId,
            answer: answer.answer,
            timeSpent: answer.timeSpent,
          });
          
          return await storage.submitAnswer(answerData);
        })
      );

      // Update session status
      await storage.updateSessionStatus(sessionId, 'completed');

      res.json({ 
        message: 'Exam submitted successfully',
        answers: submittedAnswers
      });
    } catch (error) {
      console.error("Error submitting exam:", error);
      res.status(500).json({ message: "Failed to submit exam" });
    }
  });

  // Results routes
  app.get('/api/sessions/:id/results', isAuthenticated, async (req: any, res) => {
    try {
      const sessionId = req.params.id;
      const session = await storage.getExamSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }

      const user = await storage.getUser(req.user.claims.sub);
      
      // Check access permissions
      if (user?.role === 'student' && session.studentId !== user.id) {
        return res.status(403).json({ message: 'Unauthorized access' });
      }

      const result = await storage.getResultBySession(sessionId);
      const answers = await storage.getSessionAnswers(sessionId);

      res.json({ result, answers, session });
    } catch (error) {
      console.error("Error fetching results:", error);
      res.status(500).json({ message: "Failed to fetch results" });
    }
  });

  // Proctor routes
  app.get('/api/proctor/sessions', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'proctor' && user?.role !== 'instructor') {
        return res.status(403).json({ message: 'Proctor access required' });
      }

      const sessions = await storage.getActiveSessionsByProctor(user.id);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching proctor sessions:", error);
      res.status(500).json({ message: "Failed to fetch sessions" });
    }
  });

  app.post('/api/proctor/sessions/:id/pause', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'proctor' && user?.role !== 'instructor') {
        return res.status(403).json({ message: 'Proctor access required' });
      }

      const sessionId = req.params.id;
      await storage.updateSessionStatus(sessionId, 'paused');
      
      res.json({ message: 'Session paused successfully' });
    } catch (error) {
      console.error("Error pausing session:", error);
      res.status(500).json({ message: "Failed to pause session" });
    }
  });

  app.post('/api/proctor/sessions/:id/resume', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'proctor' && user?.role !== 'instructor') {
        return res.status(403).json({ message: 'Proctor access required' });
      }

      const sessionId = req.params.id;
      await storage.updateSessionStatus(sessionId, 'active');
      
      res.json({ message: 'Session resumed successfully' });
    } catch (error) {
      console.error("Error resuming session:", error);
      res.status(500).json({ message: "Failed to resume session" });
    }
  });

  const httpServer = createServer(app);
  
  // Setup WebSocket server
  new ExamWebSocketServer(httpServer);

  return httpServer;
}
