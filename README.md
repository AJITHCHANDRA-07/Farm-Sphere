# Farm Sphere Visions

A comprehensive agricultural management platform that connects farmers with markets, provides crop insights, and optimizes agricultural supply chains.

## Project Structure

```
farmsphere-visions-main/
├── frontend/          # React + TypeScript frontend application
├── backend/           # Node.js + Express API server
├── database/          # SQL schemas and migration files
├── .git/             # Git repository
├── venv/             # Python virtual environment (if needed)
└── package.json      # Root package configuration
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or bun
- Database (PostgreSQL recommended)

### Installation

1. Install dependencies for all packages:
```bash
npm run install:all
```

2. Set up environment variables:
```bash
# Copy backend env template
cp backend/.env.example backend/.env
# Configure your database connection
```

3. Set up database:
```bash
# Run database migrations
cd database
# Execute SQL files in order:
# 1. create-6-table-schema.sql
# 2. insert-data.sql
# 3. add-all-missing-columns.sql
```

### Development

Start both frontend and backend in development mode:
```bash
npm run dev
```

Or start individually:
```bash
npm run dev:frontend  # Frontend at http://localhost:5173
npm run dev:backend   # Backend at http://localhost:3001
```

### Production

Build and deploy:
```bash
npm run build:frontend
npm run start:backend
```

## Features

- **Crop Management**: Browse and manage crop information
- **Market Insights**: Get real-time market data and pricing
- **Supply Chain Optimization**: Connect farmers with buyers
- **Government Schemes**: Access agricultural subsidies and programs
- **District Suitability**: Find crops suitable for your region

## Technology Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Vite
- Lucide Icons

### Backend
- Node.js
- Express
- PostgreSQL
- Ollama AI Integration

### Database
- PostgreSQL
- SQL Schema Files

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
