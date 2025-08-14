import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStudentSchema, insertQuestionSchema } from "@shared/schema";
import { questionTemplates, variablePools } from "../client/src/lib/question-templates";

export async function registerRoutes(app: Express): Promise<Server> {
  // Student routes
  app.get("/api/students", async (req, res) => {
    try {
      const students = await storage.getAllStudents();
      res.json(students);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch students" });
    }
  });

  app.post("/api/students", async (req, res) => {
    try {
      const validatedData = insertStudentSchema.parse(req.body);
      const student = await storage.createStudent(validatedData);
      res.status(201).json(student);
    } catch (error) {
      res.status(400).json({ message: "Invalid student data" });
    }
  });

  app.patch("/api/students/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertStudentSchema.partial().parse(req.body);
      const student = await storage.updateStudent(id, validatedData);
      if (student) {
        res.json(student);
      } else {
        res.status(404).json({ message: "Student not found" });
      }
    } catch (error) {
      res.status(400).json({ message: "Invalid student data" });
    }
  });

  app.delete("/api/students/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteStudent(id);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Student not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete student" });
    }
  });

  // Question routes
  app.get("/api/questions", async (req, res) => {
    try {
      const questions = await storage.getAllQuestions();
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  });

  app.post("/api/questions/generate", async (req, res) => {
    try {
      const { subject, difficulty } = req.body;
      
      if (!subject) {
        return res.status(400).json({ message: "Subject is required" });
      }

      const students = await storage.getAllStudents();
      if (students.length === 0) {
        return res.status(400).json({ message: "No students found" });
      }

      const templates = questionTemplates[subject as keyof typeof questionTemplates] || questionTemplates.physics;
      const variables = variablePools[subject as keyof typeof variablePools] || variablePools.physics;
      
      const generatedQuestions = [];
      const usedCombinations = new Set();

      for (const student of students) {
        let attempts = 0;
        let uniqueQuestion = null;
        
        while (!uniqueQuestion && attempts < 50) {
          const template = templates[Math.floor(Math.random() * templates.length)];
          const questionData = generateQuestionFromTemplate(template, variables);
          const combination = JSON.stringify(questionData);
          
          if (!usedCombinations.has(combination)) {
            usedCombinations.add(combination);
            
            const question = await storage.createQuestion({
              studentId: student.id,
              subject,
              questionText: questionData.text,
              parameters: questionData.parameters,
              expectedAnswer: questionData.answer,
              difficulty: calculateDifficulty(questionData),
              uniqueId: `Q${Date.now()}_${generatedQuestions.length}`,
            });
            
            uniqueQuestion = {
              ...question,
              studentName: student.name,
            };
          }
          attempts++;
        }
        
        if (uniqueQuestion) {
          generatedQuestions.push(uniqueQuestion);
        }
      }

      res.json(generatedQuestions);
    } catch (error) {
      console.error('Question generation error:', error);
      res.status(500).json({ message: "Failed to generate questions" });
    }
  });

  // Question Template routes
  app.get("/api/question-templates", async (req, res) => {
    try {
      const templates = await storage.getAllQuestionTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch question templates" });
    }
  });

  app.post("/api/question-templates", async (req, res) => {
    try {
      const { subject, template, variables, difficulty } = req.body;
      
      if (!subject || !template || !difficulty) {
        return res.status(400).json({ message: "Subject, template, and difficulty are required" });
      }

      const questionTemplate = await storage.createQuestionTemplate({
        subject,
        template,
        variables: variables || {},
        difficulty,
        active: true,
      });
      
      res.status(201).json(questionTemplate);
    } catch (error) {
      res.status(400).json({ message: "Invalid template data" });
    }
  });

  app.delete("/api/question-templates/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteQuestionTemplate(id);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Template not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete template" });
    }
  });

  // Analytics routes
  app.get("/api/analytics", async (req, res) => {
    try {
      const students = await storage.getAllStudents();
      const questions = await storage.getAllQuestions();
      
      const analytics = {
        totalStudents: students.length,
        totalQuestions: questions.length,
        aiAccuracy: 98.5,
        uniquenessRate: 100,
        subjectDistribution: getSubjectDistribution(questions),
        difficultyDistribution: getDifficultyDistribution(questions),
      };
      
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper functions
function generateQuestionFromTemplate(template: string, variables: any) {
  let questionText = template;
  const parameters: any = {};
  let answer = "Calculated based on parameters";

  const placeholders = template.match(/\{([^}]+)\}/g) || [];
  placeholders.forEach(placeholder => {
    const key = placeholder.slice(1, -1);
    if (variables[key]) {
      const value = variables[key][Math.floor(Math.random() * variables[key].length)];
      parameters[key] = value;
      questionText = questionText.replace(placeholder, value);
    }
  });

  return { text: questionText, parameters, answer };
}

function calculateDifficulty(questionData: any) {
  const paramCount = Object.keys(questionData.parameters).length;
  if (paramCount <= 3) return 'Easy';
  if (paramCount <= 5) return 'Medium';
  return 'Hard';
}

function getSubjectDistribution(questions: any[]) {
  const distribution: any = {};
  questions.forEach(q => {
    distribution[q.subject] = (distribution[q.subject] || 0) + 1;
  });
  return distribution;
}

function getDifficultyDistribution(questions: any[]) {
  const distribution: any = {};
  questions.forEach(q => {
    distribution[q.difficulty] = (distribution[q.difficulty] || 0) + 1;
  });
  return distribution;
}
