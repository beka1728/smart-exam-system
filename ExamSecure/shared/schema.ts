import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  decimal,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Enums
export const userRoleEnum = pgEnum('user_role', ['admin', 'instructor', 'proctor', 'student']);
export const examStatusEnum = pgEnum('exam_status', ['draft', 'active', 'paused', 'completed', 'archived']);
export const sessionStatusEnum = pgEnum('session_status', ['active', 'paused', 'completed', 'terminated']);
export const difficultyEnum = pgEnum('difficulty', ['easy', 'medium', 'hard']);
export const questionTypeEnum = pgEnum('question_type', ['multiple_choice', 'short_answer', 'essay', 'code']);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: userRoleEnum("role").default('student'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Exams table
export const exams = pgTable("exams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  instructorId: varchar("instructor_id").notNull().references(() => users.id),
  duration: integer("duration").notNull(), // in minutes
  status: examStatusEnum("status").default('draft'),
  timeLimit: timestamp("time_limit"),
  maxAttempts: integer("max_attempts").default(1),
  shuffleQuestions: boolean("shuffle_questions").default(true),
  showResults: boolean("show_results").default(false),
  aiEnabled: boolean("ai_enabled").default(true),
  difficultyMix: jsonb("difficulty_mix"), // {easy: 40, medium: 40, hard: 20}
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Base questions pool
export const questions = pgTable("questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  examId: varchar("exam_id").notNull().references(() => exams.id, { onDelete: 'cascade' }),
  type: questionTypeEnum("type").notNull(),
  difficulty: difficultyEnum("difficulty").notNull(),
  content: text("content").notNull(),
  options: jsonb("options"), // for multiple choice
  correctAnswer: text("correct_answer"),
  points: decimal("points").default('1'),
  aiGenerated: boolean("ai_generated").default(false),
  baseQuestionId: varchar("base_question_id"), // reference to original if AI variant
  createdAt: timestamp("created_at").defaultNow(),
});

// Student exam sessions
export const examSessions = pgTable("exam_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  examId: varchar("exam_id").notNull().references(() => exams.id),
  studentId: varchar("student_id").notNull().references(() => users.id),
  status: sessionStatusEnum("status").default('active'),
  startedAt: timestamp("started_at").defaultNow(),
  endedAt: timestamp("ended_at"),
  timeRemaining: integer("time_remaining"), // in seconds
  currentQuestionIndex: integer("current_question_index").default(0),
  studentSeed: varchar("student_seed"), // for question variants
  deviceInfo: jsonb("device_info"),
  ipAddress: varchar("ip_address"),
  flaggedActivities: jsonb("flagged_activities").default('[]'),
  proctorNotes: text("proctor_notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Student answers
export const examAnswers = pgTable("exam_answers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull().references(() => examSessions.id, { onDelete: 'cascade' }),
  questionId: varchar("question_id").notNull().references(() => questions.id),
  answer: text("answer"),
  isCorrect: boolean("is_correct"),
  pointsAwarded: decimal("points_awarded"),
  aiScored: boolean("ai_scored").default(false),
  timeSpent: integer("time_spent"), // in seconds
  answeredAt: timestamp("answered_at").defaultNow(),
});

// Exam results summary
export const examResults = pgTable("exam_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull().references(() => examSessions.id, { onDelete: 'cascade' }),
  totalPoints: decimal("total_points"),
  earnedPoints: decimal("earned_points"),
  percentage: decimal("percentage"),
  grade: varchar("grade"),
  feedback: text("feedback"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const userRelations = relations(users, ({ many }) => ({
  exams: many(exams),
  sessions: many(examSessions),
}));

export const examRelations = relations(exams, ({ one, many }) => ({
  instructor: one(users, {
    fields: [exams.instructorId],
    references: [users.id],
  }),
  questions: many(questions),
  sessions: many(examSessions),
}));

export const questionRelations = relations(questions, ({ one, many }) => ({
  exam: one(exams, {
    fields: [questions.examId],
    references: [exams.id],
  }),
  answers: many(examAnswers),
}));

export const sessionRelations = relations(examSessions, ({ one, many }) => ({
  exam: one(exams, {
    fields: [examSessions.examId],
    references: [exams.id],
  }),
  student: one(users, {
    fields: [examSessions.studentId],
    references: [users.id],
  }),
  answers: many(examAnswers),
  result: one(examResults),
}));

export const answerRelations = relations(examAnswers, ({ one }) => ({
  session: one(examSessions, {
    fields: [examAnswers.sessionId],
    references: [examSessions.id],
  }),
  question: one(questions, {
    fields: [examAnswers.questionId],
    references: [questions.id],
  }),
}));

export const resultRelations = relations(examResults, ({ one }) => ({
  session: one(examSessions, {
    fields: [examResults.sessionId],
    references: [examSessions.id],
  }),
}));

// Zod schemas
export const upsertUserSchema = createInsertSchema(users);
export const insertExamSchema = createInsertSchema(exams).omit({ id: true, createdAt: true, updatedAt: true });
export const insertQuestionSchema = createInsertSchema(questions).omit({ id: true, createdAt: true });
export const insertSessionSchema = createInsertSchema(examSessions).omit({ id: true, createdAt: true });
export const insertAnswerSchema = createInsertSchema(examAnswers).omit({ id: true });
export const insertResultSchema = createInsertSchema(examResults).omit({ id: true, createdAt: true });

export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertExam = z.infer<typeof insertExamSchema>;
export type Exam = typeof exams.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Question = typeof questions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type ExamSession = typeof examSessions.$inferSelect;
export type InsertAnswer = z.infer<typeof insertAnswerSchema>;
export type ExamAnswer = typeof examAnswers.$inferSelect;
export type InsertResult = z.infer<typeof insertResultSchema>;
export type ExamResult = typeof examResults.$inferSelect;
