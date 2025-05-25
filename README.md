# 🤖 AI-Powered Todo Application

A modern, AI-powered todo application built with **Claude AI**, **Model Context Protocol (MCP)**, and **microservices architecture**. Features real-time updates, natural language processing, and streaming responses.

## 🏗️ Architecture

- **TurboRepo** monorepo with multiple apps and shared packages
- **NestJS API** with PostgreSQL, Drizzle ORM, JWT authentication
- **React Router 7** frontend with shadcn/ui components
- **MCP Server** with Claude AI integration for natural language processing
- **Chat Microfrontend** with Module Federation
- **Real-time WebSocket** updates for tasks
- **Streaming responses** from Claude AI

## 📦 Project Structure

```
react-advanced-v2/
├── apps/
│   ├── api/          # NestJS API server (port 3000)
│   ├── web/          # React Router 7 frontend (port 5173)
│   ├── chat/         # Chat microfrontend (port 5001)
│   └── mcp/          # MCP server with Claude AI (port 3002)
├── packages/
│   ├── mcp-types/    # Shared TypeScript types
│   ├── mcp-client/   # MCP client library
│   ├── shared/       # Shared utilities
│   └── ui/           # Shared UI components
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL
- Anthropic API key

### 1. Clone & Install

```bash
git clone <repository>
cd react-advanced-v2
pnpm install
```

### 2. Database Setup

```bash
# Start PostgreSQL
# Create database 'todo_app'

# Run migrations
cd apps/api
pnpm run db:migrate
```

### 3. Environment Variables

Create `.env` in `apps/api/`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/todo_app"
```

Create `.env.local` in `apps/mcp/`:
```env
ANTHROPIC_API_KEY="sk-ant-api03-your-key-here"
API_BASE_URL="http://localhost:3000"
```

### 4. Start All Services

```bash
# Start all services in development mode
pnpm run dev
```

This starts:
- API server on http://localhost:3000
- Web app on http://localhost:5173
- Chat app on http://localhost:5001
- MCP server on http://localhost:3002

### 5. Create Test User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

## 🎯 Features

### 🤖 AI-Powered Task Management
- **Natural Language Processing**: "Create a task: Buy groceries with high priority"
- **Claude AI Integration**: Powered by Anthropic's Claude 3.5 Sonnet
- **Streaming Responses**: Real-time AI responses with Server-Sent Events
- **Intent Recognition**: Automatically extracts task details from natural language

### 📝 Task Management
- **CRUD Operations**: Create, read, update, delete tasks
- **Priority Levels**: LOW, MEDIUM, HIGH with visual indicators
- **Due Dates**: Optional due date tracking
- **Real-time Updates**: WebSocket-powered live updates
- **Search & Filter**: Find tasks by text, priority, completion status

### 🔄 Real-time Features
- **WebSocket Integration**: Live task updates across all clients
- **Streaming AI Responses**: Real-time Claude AI responses
- **Module Federation**: Microfrontend architecture for scalability

### 🎨 Modern UI/UX
- **shadcn/ui Components**: Beautiful, accessible UI components
- **Tailwind CSS**: Modern styling with dark/light mode support
- **Responsive Design**: Works on desktop and mobile
- **Loading States**: Smooth loading indicators and animations

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task by ID
- `PATCH /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### MCP (AI)
- `GET /api/mcp/tools` - Get available AI tools
- `POST /api/mcp/tools/call` - Execute AI tool
- `POST /api/mcp/interpret` - Stream AI interpretation

## 🧪 Testing AI Features

### Create Tasks with Natural Language
```bash
curl -X POST http://localhost:3002/api/mcp/interpret \
  -H "Content-Type: application/json" \
  -d '{"message": "Create a task: Buy groceries with high priority"}'
```

### Search Tasks
```bash
curl -X POST http://localhost:3002/api/mcp/interpret \
  -H "Content-Type: application/json" \
  -d '{"message": "Show me all my high priority tasks"}'
```

### Update Tasks
```bash
curl -X POST http://localhost:3002/api/mcp/interpret \
  -H "Content-Type: application/json" \
  -d '{"message": "Mark the grocery task as completed"}'
```

## 🏃‍♂️ Development

### Build All Packages
```bash
pnpm run build
```

### Run Tests
```bash
pnpm run test
```

### Lint Code
```bash
pnpm run lint
```

### Database Operations
```bash
cd apps/api
pnpm run db:generate  # Generate new migration
pnpm run db:migrate   # Run migrations
pnpm run db:studio    # Open Drizzle Studio
```

## 🔧 Tech Stack

### Backend
- **NestJS** - Node.js framework
- **PostgreSQL** - Database
- **Drizzle ORM** - Type-safe database queries
- **Socket.io** - Real-time WebSocket communication
- **JWT** - Authentication
- **TypeBox** - Runtime type validation

### Frontend
- **React 19** - UI library
- **React Router 7** - Routing and SSR
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Module Federation** - Microfrontend architecture

### AI & MCP
- **Anthropic Claude** - AI language model
- **Model Context Protocol** - AI tool integration
- **Server-Sent Events** - Streaming responses
- **WebSocket** - Real-time communication

## 📱 Usage Examples

### Web Interface
1. Visit http://localhost:5173
2. Register/login with test account
3. Navigate to "AI Todo Assistant" in the dashboard
4. Chat with AI to manage tasks naturally

### Chat Interface
- "Create a task: Finish the project report by tomorrow with high priority"
- "Show me all my incomplete tasks"
- "Mark the grocery shopping task as done"
- "What tasks do I have due this week?"
