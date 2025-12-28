# Passport & ID Card Application Portal

## Overview

A government services web application for applying for passports and national ID cards online. The portal provides a multi-step form wizard for collecting applicant information, document details, and emergency contacts, with application status tracking via reference numbers.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, local React state for form data
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming (light/dark mode support)
- **Build Tool**: Vite with hot module replacement

**Design System**: Material Design 3 adapted for government services with Inter font family. Emphasis on form clarity, accessibility, and trust through professional visual hierarchy.

### Backend Architecture
- **Runtime**: Node.js with Express
- **API Style**: RESTful JSON API
- **Validation**: Zod schemas shared between client and server
- **Development**: TSX for TypeScript execution, Vite middleware for HMR

**API Endpoints**:
- `POST /api/applications` - Submit new application
- `GET /api/applications/:referenceNumber` - Retrieve application status

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` (shared between client/server)
- **Current Storage**: In-memory storage implementation (`MemStorage` class) with interface ready for database migration
- **Database Config**: Drizzle Kit configured for PostgreSQL, requires `DATABASE_URL` environment variable

**Data Models**:
- Users (id, username, password)
- Applications (stored with reference number, status, personal info, contact info, emergency contact, document info)

### Application Flow
1. Landing page with service information and requirements
2. Multi-step form wizard (6 steps with progress indicator):
   - Application type selection (passport/ID card)
   - Personal information
   - Contact information
   - Emergency contact
   - Document information
   - Review and submit
3. Confirmation page with reference number for tracking

### Key Design Patterns
- **Shared Schema**: Zod validation schemas in `shared/` directory used by both frontend and backend
- **Form Steps**: Modular form step components in `client/src/components/form-steps/`
- **Progressive Disclosure**: Multi-step form reduces cognitive load
- **Type Safety**: Full TypeScript coverage with strict mode

## External Dependencies

### UI Component Libraries
- Radix UI primitives (dialog, select, checkbox, etc.)
- shadcn/ui component system
- Lucide React icons
- Embla Carousel for carousel functionality

### Data & Validation
- Drizzle ORM + drizzle-zod for database schema and validation
- Zod for runtime type validation
- TanStack React Query for API data fetching

### Styling
- Tailwind CSS with custom theme configuration
- class-variance-authority for component variants
- tailwind-merge for className utilities

### Session Management
- connect-pg-simple (PostgreSQL session store, available but not currently active)
- express-session ready for authentication integration

### Build & Development
- Vite for frontend bundling
- esbuild for server bundling
- TSX for TypeScript execution
- Replit-specific plugins for development experience