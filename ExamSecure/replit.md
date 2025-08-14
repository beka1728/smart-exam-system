# EduExam Pro - AI-Powered Digital Examination System

## Overview

EduExam Pro is a comprehensive AI-powered digital examination platform designed to deliver secure, paperless exams with advanced proctoring capabilities. The system supports multiple user roles (Admin, Instructor, Proctor, Student) and leverages artificial intelligence for question generation, exam integrity monitoring, and automated scoring.

The application is built as a full-stack web platform with a React TypeScript frontend and Express Node.js backend, featuring real-time monitoring capabilities through WebSocket connections and comprehensive exam management tools.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **Styling**: Tailwind CSS with custom design system using CSS variables for theming
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent, accessible interface
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for type-safe form handling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework using ES modules
- **Language**: TypeScript for type safety across the full stack
- **Authentication**: Replit Auth integration with OpenID Connect (OIDC) and Passport.js
- **Session Management**: Express sessions with PostgreSQL storage using connect-pg-simple
- **Real-time Communication**: WebSocket server for live exam monitoring and proctoring features
- **API Design**: RESTful endpoints with role-based access control middleware

### Database Design
- **ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **Database**: PostgreSQL with Neon serverless hosting
- **Schema**: Comprehensive relational design supporting:
  - User roles and permissions (admin, instructor, proctor, student)
  - Exam management with status tracking
  - Question banks with difficulty levels and types
  - Exam sessions with real-time monitoring
  - Answer submissions and automated scoring
  - Integrity monitoring and anomaly detection

### AI Integration
- **Provider**: OpenAI GPT-4o for natural language processing
- **Question Generation**: Semantic question variants tailored per student to prevent cheating
- **Automated Scoring**: AI-powered evaluation of short-answer and essay responses
- **Anomaly Detection**: Pattern recognition for identifying suspicious exam behavior
- **Content Analysis**: Similarity detection between student responses

### Security and Integrity Features
- **Session Security**: Secure cookie-based sessions with proper expiration
- **Exam Isolation**: Unique question variants per student using AI generation
- **Real-time Monitoring**: WebSocket-based tracking of student activities
- **Device Fingerprinting**: IP and device capture for session verification
- **Integrity Flags**: Detection of tab switching, rapid answers, and identical responses
- **Access Control**: Role-based permissions with middleware protection

### Real-time Features
- **WebSocket Server**: Custom implementation for bidirectional communication
- **Live Monitoring**: Real-time student activity tracking for proctors
- **Session Management**: Dynamic pause/resume capabilities during exams
- **Anomaly Alerts**: Instant notifications for suspicious behavior patterns
- **Progress Tracking**: Live updates of exam completion status

### Development Tools
- **Build System**: Vite for frontend with esbuild for backend bundling
- **Type Safety**: Full TypeScript coverage with strict compiler settings
- **Database Migrations**: Drizzle Kit for schema management and migrations
- **Development Mode**: Hot reload with Replit-specific development tools
- **Code Quality**: ESLint configuration for consistent code standards

## External Dependencies

### Core Infrastructure
- **Database**: Neon PostgreSQL serverless database with connection pooling
- **Authentication**: Replit Auth service with OIDC integration
- **Hosting**: Replit deployment environment with development tooling

### AI Services
- **OpenAI API**: GPT-4o model for question generation, scoring, and anomaly detection
- **Natural Language Processing**: Content analysis and similarity detection

### Third-party Libraries
- **UI Framework**: Radix UI primitives for accessible component foundation
- **Form Validation**: Zod for runtime type validation and schema definition
- **Date Handling**: date-fns for consistent date/time operations
- **Real-time Communication**: ws (WebSocket) library for server-side implementation
- **Security**: JWT handling and session management utilities

### Development Dependencies
- **Build Tools**: Vite, esbuild, and PostCSS for asset compilation
- **Type Definitions**: Comprehensive TypeScript definitions for all dependencies
- **Development Utilities**: Replit-specific plugins for enhanced development experience