# Superhero Database / База Даних Супергероїв

A full-stack web application for managing a superhero database with CRUD operations, image management, and modern UI.

## 🚀 Features

### Core Functionality

- **Create, Read, Update, Delete** superheroes
- **Image Management**: Upload and remove images for each superhero
- **Pagination**: Browse superheroes with 5 items per page
- **Responsive Design**: Modern, mobile-friendly interface
- **Real-time Updates**: Automatic data synchronization

### Superhero Model

Each superhero includes:

- **Nickname**: Hero's superhero name (e.g., "Superman")
- **Real Name**: Civilian identity (e.g., "Clark Kent")
- **Origin Description**: Backstory and origin
- **Superpowers**: Abilities and powers
- **Catch Phrase**: Famous quote or motto
- **Images**: Multiple images per superhero


### Backend

- **Node.js** (≥16.0.0) with **Express.js**
- **MongoDB** with **Mongoose** ODM
- **GridFS** for file storage in MongoDB
- **Multer** for file uploads
- **CORS** enabled for cross-origin requests
- **Pino** for structured logging
- **Morgan** for HTTP request logging
- **ESLint** with Airbnb configuration for code linting

### Frontend

- **React 18** with **Vite** build tool
- **React Router Dom** for client-side routing
- **React Query v3** for server state management
- **Axios** for HTTP API calls
- **React Hook Form** with **Yup** validation
- **Lucide React** for modern icons
- **React Toastify** for notifications
- **Swiper** for image gallery carousel
- **Vitest** with **React Testing Library** for component testing
- **ESLint** with Airbnb React configuration

## 📋 Prerequisites

- **Node.js** (v16.0.0 or higher) - Required for both backend and frontend
- **npm** or **yarn** - Package manager
- **MongoDB** (for production) - Optional, uses MongoDB Memory Server for development/testing
- **Modern Web Browser** - Chrome, Firefox, Safari, or Edge

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend and frontend dependencies
npm run install:all
```

### 2. Start Development Servers

```bash
# Start both backend and frontend
npm run dev
```

This will start:

- Backend server on `http://localhost:3001`
- Frontend development server on `http://localhost:3000`

### 3. Configure Environment (Optional)

Create a `.env` file in the backend directory for custom MongoDB configuration:

```bash
# backend/.env
MONGODB_URI=mongodb://localhost:27017/superhero_db
PORT=3001

# frontend/.env
VITE_API_BASE_URL=/api
```

If no `.env` file is provided, the application will use default settings.

### 4. Access the Application

Open your browser and navigate to `http://localhost:3000`

## 📜 Available Scripts

### Development

```bash
npm run dev                 # Start both backend and frontend in development mode
npm run dev:backend         # Start only backend server
npm run dev:frontend        # Start only frontend server
```

### 🧪Testing

```bash
npm run test                # Run frontend tests
```

### Code Quality

```bash
npm run lint                # Lint all code (frontend + backend)
npm run lint:backend        # Lint backend code only
npm run lint:frontend       # Lint frontend code only
npm run lint:fix            # Fix linting issues automatically
npm run format              # Format code with Prettier
npm run format:check        # Check code formatting
```


### Run Frontend Tests (Configured)

```bash
npm run test               # Run frontend tests once from root
cd frontend && npm run test:run  # Run frontend tests once
cd frontend && npm run test      # Run frontend tests in watch mode
cd frontend && npm run test:ui   # Run tests with Vitest UI
```

### Test Frameworks Used

- **Frontend**: Vitest + React Testing Library + Jest DOM

### Test Coverage

- **Frontend**: Comprehensive tests covering components, hooks, services, and utilities

### Frontend Test Features

- **Component testing**: React Testing Library
- **Hook testing**: Custom hooks with React Query
- **API testing**: Mocked API calls
- **Utility testing**: Helper functions and validation schemas
