# Overview

This is a lab question generation system for educational institutions. The application uses AI to generate unique questions for each student across different subjects (Physics, Chemistry, Mathematics, and Programming) to prevent academic dishonesty. It features a React frontend with shadcn/ui components and an Express backend with in-memory storage that can be extended to use PostgreSQL with Drizzle ORM.

## Recent Changes (August 14, 2025)
- ✅ Added comprehensive student management system with add/edit/remove functionality
- ✅ Created professional modal form with validation for student data entry
- ✅ Implemented real-time updates to dashboard metrics when students are added/removed
- ✅ Added status management (Active, Inactive, Suspended) for students
- ✅ Enhanced UI with proper Edit/Remove buttons and confirmation dialogs

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite for build tooling
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation integration

## Backend Architecture  
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Storage**: In-memory storage with interfaces designed for PostgreSQL migration
- **Database ORM**: Drizzle ORM configured for PostgreSQL (ready for database integration)
- **API Design**: RESTful endpoints for students, questions, and analytics
- **Development**: Hot module replacement with Vite middleware integration

## Data Architecture
- **Students**: Core entity with name, email, status, and timestamps. Full CRUD operations supported.
- **Questions**: Generated questions linked to students with subject, difficulty, and parameters
- **Question Templates**: Configurable templates for different subjects with variable substitution
- **Schema Validation**: Zod schemas for runtime type checking and API validation
- **Student Management**: Add, edit, remove students with form validation and status management

## Question Generation System
- **Template Engine**: Subject-specific question templates with placeholder variables
- **Variable Pools**: Randomized value pools for physics, chemistry, mathematics, and programming
- **Uniqueness**: Algorithm ensures each student gets unique question variants
- **Difficulty Levels**: Easy, medium, hard difficulty scaling
- **Parameter Storage**: JSON storage of question parameters for reproducibility

## Development Architecture
- **Monorepo Structure**: Shared types and schemas between client and server
- **Build System**: Vite for frontend, esbuild for backend bundling
- **Development Server**: Integrated Vite dev server with Express API proxy
- **Path Aliases**: Configured TypeScript path mapping for clean imports
- **Hot Reloading**: Full-stack development with automatic reloading

# External Dependencies

## Core Framework Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL serverless driver for production database
- **drizzle-orm**: TypeScript ORM for database operations and migrations
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight React routing library

## UI and Styling
- **@radix-ui/react-***: Headless UI components for accessibility
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library for consistent iconography

## Development Tools
- **vite**: Frontend build tool and development server
- **esbuild**: Backend bundling for production builds
- **tsx**: TypeScript execution for development
- **@replit/vite-plugin-***: Replit-specific development enhancements

## Validation and Forms
- **zod**: Runtime schema validation
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Zod resolver for form validation

## Database and Session Management
- **connect-pg-simple**: PostgreSQL session store (configured but not yet implemented)
- **drizzle-zod**: Integration between Drizzle ORM and Zod validation