import {
  users,
  exams,
  questions,
  examSessions,
  examAnswers,
  examResults,
  type User,
  type UpsertUser,
  type Exam,
  type InsertExam,
  type Question,
  type InsertQuestion,
  type ExamSession,
  type InsertSession,
  type ExamAnswer,
  type InsertAnswer,
  type ExamResult,
  type InsertResult,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, count, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUsersByRole(role: string): Promise<User[]>;
  
  // Exam operations
  createExam(exam: InsertExam): Promise<Exam>;
  getExam(id: string): Promise<Exam | undefined>;
  getExamsByInstructor(instructorId: string): Promise<Exam[]>;
  updateExamStatus(id: string, status: string): Promise<void>;
  getActiveExams(): Promise<Exam[]>;
  
  // Question operations
  createQuestion(question: InsertQuestion): Promise<Question>;
  getQuestionsByExam(examId: string): Promise<Question[]>;
  generateQuestionVariant(baseQuestionId: string, studentSeed: string): Promise<Question>;
  
  // Session operations
  createExamSession(session: InsertSession): Promise<ExamSession>;
  getExamSession(id: string): Promise<ExamSession | undefined>;
  updateSessionStatus(id: string, status: string): Promise<void>;
  getActiveSessionsByProctor(proctorId: string): Promise<ExamSession[]>;
  updateSessionTime(id: string, timeRemaining: number): Promise<void>;
  addFlaggedActivity(sessionId: string, activity: any): Promise<void>;
  
  // Answer operations
  submitAnswer(answer: InsertAnswer): Promise<ExamAnswer>;
  getSessionAnswers(sessionId: string): Promise<ExamAnswer[]>;
  
  // Result operations
  createExamResult(result: InsertResult): Promise<ExamResult>;
  getResultBySession(sessionId: string): Promise<ExamResult | undefined>;
  getStudentResults(studentId: string): Promise<ExamResult[]>;
  
  // Analytics
  getSystemStats(): Promise<{
    totalUsers: number;
    activeExams: number;
    completionRate: number;
    flaggedSessions: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, role as any));
  }

  // Exam operations
  async createExam(examData: InsertExam): Promise<Exam> {
    const [exam] = await db.insert(exams).values(examData).returning();
    return exam;
  }

  async getExam(id: string): Promise<Exam | undefined> {
    const [exam] = await db.select().from(exams).where(eq(exams.id, id));
    return exam;
  }

  async getExamsByInstructor(instructorId: string): Promise<Exam[]> {
    return await db.select().from(exams).where(eq(exams.instructorId, instructorId)).orderBy(desc(exams.createdAt));
  }

  async updateExamStatus(id: string, status: string): Promise<void> {
    await db.update(exams).set({ status: status as any, updatedAt: new Date() }).where(eq(exams.id, id));
  }

  async getActiveExams(): Promise<Exam[]> {
    return await db.select().from(exams).where(eq(exams.status, 'active'));
  }

  // Question operations
  async createQuestion(questionData: InsertQuestion): Promise<Question> {
    const [question] = await db.insert(questions).values(questionData).returning();
    return question;
  }

  async getQuestionsByExam(examId: string): Promise<Question[]> {
    return await db.select().from(questions).where(eq(questions.examId, examId)).orderBy(asc(questions.createdAt));
  }

  async generateQuestionVariant(baseQuestionId: string, studentSeed: string): Promise<Question> {
    // This would integrate with AI service to generate variants
    // For now, return the base question
    const [question] = await db.select().from(questions).where(eq(questions.id, baseQuestionId));
    return question;
  }

  // Session operations
  async createExamSession(sessionData: InsertSession): Promise<ExamSession> {
    const [session] = await db.insert(examSessions).values(sessionData).returning();
    return session;
  }

  async getExamSession(id: string): Promise<ExamSession | undefined> {
    const [session] = await db.select().from(examSessions).where(eq(examSessions.id, id));
    return session;
  }

  async updateSessionStatus(id: string, status: string): Promise<void> {
    await db.update(examSessions).set({ status: status as any }).where(eq(examSessions.id, id));
  }

  async getActiveSessionsByProctor(proctorId: string): Promise<ExamSession[]> {
    return await db
      .select({
        id: examSessions.id,
        examId: examSessions.examId,
        studentId: examSessions.studentId,
        status: examSessions.status,
        startedAt: examSessions.startedAt,
        timeRemaining: examSessions.timeRemaining,
        currentQuestionIndex: examSessions.currentQuestionIndex,
        flaggedActivities: examSessions.flaggedActivities,
      })
      .from(examSessions)
      .innerJoin(exams, eq(examSessions.examId, exams.id))
      .where(and(eq(examSessions.status, 'active'), eq(exams.instructorId, proctorId)));
  }

  async updateSessionTime(id: string, timeRemaining: number): Promise<void> {
    await db.update(examSessions).set({ timeRemaining }).where(eq(examSessions.id, id));
  }

  async addFlaggedActivity(sessionId: string, activity: any): Promise<void> {
    const [session] = await db.select({ flaggedActivities: examSessions.flaggedActivities }).from(examSessions).where(eq(examSessions.id, sessionId));
    const currentActivities = session?.flaggedActivities as any[] || [];
    currentActivities.push({ ...activity, timestamp: new Date() });
    await db.update(examSessions).set({ flaggedActivities: currentActivities }).where(eq(examSessions.id, sessionId));
  }

  // Answer operations
  async submitAnswer(answerData: InsertAnswer): Promise<ExamAnswer> {
    const [answer] = await db.insert(examAnswers).values(answerData).returning();
    return answer;
  }

  async getSessionAnswers(sessionId: string): Promise<ExamAnswer[]> {
    return await db.select().from(examAnswers).where(eq(examAnswers.sessionId, sessionId));
  }

  // Result operations
  async createExamResult(resultData: InsertResult): Promise<ExamResult> {
    const [result] = await db.insert(examResults).values(resultData).returning();
    return result;
  }

  async getResultBySession(sessionId: string): Promise<ExamResult | undefined> {
    const [result] = await db.select().from(examResults).where(eq(examResults.sessionId, sessionId));
    return result;
  }

  async getStudentResults(studentId: string): Promise<ExamResult[]> {
    return await db
      .select({
        id: examResults.id,
        sessionId: examResults.sessionId,
        totalPoints: examResults.totalPoints,
        earnedPoints: examResults.earnedPoints,
        percentage: examResults.percentage,
        grade: examResults.grade,
        feedback: examResults.feedback,
        createdAt: examResults.createdAt,
      })
      .from(examResults)
      .innerJoin(examSessions, eq(examResults.sessionId, examSessions.id))
      .where(eq(examSessions.studentId, studentId))
      .orderBy(desc(examResults.createdAt));
  }

  // Analytics
  async getSystemStats(): Promise<{
    totalUsers: number;
    activeExams: number;
    completionRate: number;
    flaggedSessions: number;
  }> {
    const [totalUsersResult] = await db.select({ count: count() }).from(users);
    const [activeExamsResult] = await db.select({ count: count() }).from(exams).where(eq(exams.status, 'active'));
    const [completedSessionsResult] = await db.select({ count: count() }).from(examSessions).where(eq(examSessions.status, 'completed'));
    const [totalSessionsResult] = await db.select({ count: count() }).from(examSessions);
    const [flaggedSessionsResult] = await db
      .select({ count: count() })
      .from(examSessions)
      .where(sql`json_array_length(flagged_activities) > 0`);

    const completionRate = totalSessionsResult.count > 0 ? 
      (completedSessionsResult.count / totalSessionsResult.count) * 100 : 0;

    return {
      totalUsers: totalUsersResult.count,
      activeExams: activeExamsResult.count,
      completionRate: Math.round(completionRate * 100) / 100,
      flaggedSessions: flaggedSessionsResult.count,
    };
  }
}

export const storage = new DatabaseStorage();
