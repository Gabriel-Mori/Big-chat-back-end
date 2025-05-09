# Chat Application Backend

This is the backend implementation for the Chat Application Challenge. It provides a robust backend API for a chat application with message queuing, user authentication, and financial validation.

## Features

- User authentication with JWT
- Conversation management
- Message system with priority queues (normal/urgent)
- Financial validation for pre-paid and post-paid plans
- Message queue implementation with RabbitMQ
- Database persistence with PostgreSQL and Sequelize ORM

## Tech Stack

- Node.js with Express
- TypeScript
- Sequelize ORM
- PostgreSQL database
- RabbitMQ for message queuing
- JWT for authentication
- Docker for containerization

## Prerequisites

- Node.js (v14+)
- Docker and Docker Compose (optional, for containerized setup)
- PostgreSQL (if running locally)
- RabbitMQ (if running locally)

## Getting Started

### Using Docker (Recommended)

1. Clone the repository
2. Navigate to the project directory
3. Run Docker Compose:

```bash
docker-compose up
```

This will start the backend API, PostgreSQL database, and RabbitMQ message broker.

### Local Development

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file based on `.env.example`
5. Run database migrations:

```bash
npm run db:migrate
```

6. Seed the database:

```bash
npm run db:seed
```

7. Start the development server:

```bash
npm run dev
```

## API Documentation

### Authentication

- \*\*POST /api/
