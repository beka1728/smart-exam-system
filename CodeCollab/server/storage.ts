import { type Student, type InsertStudent, type Question, type InsertQuestion, type QuestionTemplate, type InsertQuestionTemplate } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Students
  getStudent(id: string): Promise<Student | undefined>;
  getStudentByEmail(email: string): Promise<Student | undefined>;
  getAllStudents(): Promise<Student[]>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: string, student: Partial<InsertStudent>): Promise<Student | undefined>;
  deleteStudent(id: string): Promise<boolean>;

  // Questions
  getQuestion(id: string): Promise<Question | undefined>;
  getQuestionsByStudent(studentId: string): Promise<Question[]>;
  getAllQuestions(): Promise<Question[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  deleteQuestion(id: string): Promise<boolean>;

  // Question Templates
  getQuestionTemplate(id: string): Promise<QuestionTemplate | undefined>;
  getQuestionTemplatesBySubject(subject: string): Promise<QuestionTemplate[]>;
  getAllQuestionTemplates(): Promise<QuestionTemplate[]>;
  createQuestionTemplate(template: InsertQuestionTemplate): Promise<QuestionTemplate>;
  updateQuestionTemplate(id: string, template: Partial<InsertQuestionTemplate>): Promise<QuestionTemplate | undefined>;
  deleteQuestionTemplate(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private students: Map<string, Student>;
  private questions: Map<string, Question>;
  private questionTemplates: Map<string, QuestionTemplate>;

  constructor() {
    this.students = new Map();
    this.questions = new Map();
    this.questionTemplates = new Map();
    
    // Initialize with sample students
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleStudents = [
      { name: 'Alice Johnson', email: 'alice.johnson@university.edu', status: 'active' },
      { name: 'Bob Smith', email: 'bob.smith@university.edu', status: 'active' },
      { name: 'Carol Davis', email: 'carol.davis@university.edu', status: 'active' },
      { name: 'David Wilson', email: 'david.wilson@university.edu', status: 'active' },
      { name: 'Eva Brown', email: 'eva.brown@university.edu', status: 'active' },
      { name: 'Frank Miller', email: 'frank.miller@university.edu', status: 'active' },
      { name: 'Grace Lee', email: 'grace.lee@university.edu', status: 'active' },
      { name: 'Henry Garcia', email: 'henry.garcia@university.edu', status: 'active' },
    ];

    sampleStudents.forEach(student => {
      const id = randomUUID();
      this.students.set(id, {
        ...student,
        id,
        createdAt: new Date(),
      });
    });
  }

  // Students
  async getStudent(id: string): Promise<Student | undefined> {
    return this.students.get(id);
  }

  async getStudentByEmail(email: string): Promise<Student | undefined> {
    return Array.from(this.students.values()).find(student => student.email === email);
  }

  async getAllStudents(): Promise<Student[]> {
    return Array.from(this.students.values());
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const id = randomUUID();
    const student: Student = {
      ...insertStudent,
      id,
      status: insertStudent.status || 'active',
      createdAt: new Date(),
    };
    this.students.set(id, student);
    return student;
  }

  async updateStudent(id: string, updates: Partial<InsertStudent>): Promise<Student | undefined> {
    const student = this.students.get(id);
    if (!student) return undefined;
    
    const updatedStudent = { ...student, ...updates };
    this.students.set(id, updatedStudent);
    return updatedStudent;
  }

  async deleteStudent(id: string): Promise<boolean> {
    return this.students.delete(id);
  }

  // Questions
  async getQuestion(id: string): Promise<Question | undefined> {
    return this.questions.get(id);
  }

  async getQuestionsByStudent(studentId: string): Promise<Question[]> {
    return Array.from(this.questions.values()).filter(question => question.studentId === studentId);
  }

  async getAllQuestions(): Promise<Question[]> {
    return Array.from(this.questions.values());
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const id = randomUUID();
    const question: Question = {
      ...insertQuestion,
      id,
      parameters: insertQuestion.parameters || {},
      expectedAnswer: insertQuestion.expectedAnswer || null,
      createdAt: new Date(),
    };
    this.questions.set(id, question);
    return question;
  }

  async deleteQuestion(id: string): Promise<boolean> {
    return this.questions.delete(id);
  }

  // Question Templates
  async getQuestionTemplate(id: string): Promise<QuestionTemplate | undefined> {
    return this.questionTemplates.get(id);
  }

  async getQuestionTemplatesBySubject(subject: string): Promise<QuestionTemplate[]> {
    return Array.from(this.questionTemplates.values()).filter(template => template.subject === subject);
  }

  async getAllQuestionTemplates(): Promise<QuestionTemplate[]> {
    return Array.from(this.questionTemplates.values());
  }

  async createQuestionTemplate(insertTemplate: InsertQuestionTemplate): Promise<QuestionTemplate> {
    const id = randomUUID();
    const template: QuestionTemplate = {
      ...insertTemplate,
      id,
      active: insertTemplate.active !== undefined ? insertTemplate.active : true,
      variables: insertTemplate.variables || {},
      createdAt: new Date(),
    };
    this.questionTemplates.set(id, template);
    return template;
  }

  async updateQuestionTemplate(id: string, updates: Partial<InsertQuestionTemplate>): Promise<QuestionTemplate | undefined> {
    const template = this.questionTemplates.get(id);
    if (!template) return undefined;
    
    const updatedTemplate = { ...template, ...updates };
    this.questionTemplates.set(id, updatedTemplate);
    return updatedTemplate;
  }

  async deleteQuestionTemplate(id: string): Promise<boolean> {
    return this.questionTemplates.delete(id);
  }
}

export const storage = new MemStorage();
