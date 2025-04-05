# E-Learning Platform with Housing System

A modern web application that combines an e-learning platform with a housing rental system, built with Next.js, TypeScript, and Prisma.

## 🚀 Quick Start Guide

Even if you've never used Node.js before, follow these simple steps to get started:

### Prerequisites

1. Install [Node.js](https://nodejs.org/) (Download and run the "LTS" version installer)
2. Install [Git](https://git-scm.com/downloads) if you haven't already
3. Install [Visual Studio Code](https://code.visualstudio.com/) (recommended editor)

### Setting Up the Project

1. Open your terminal (Command Prompt on Windows, Terminal on Mac)

2. Clone the project:
```bash
git clone [your-repository-url]
cd elearning-platform
```

3. Install dependencies:
```bash
npm install
```

4. Set up your environment variables:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` in a text editor and fill in your values:
     ```
     DATABASE_URL="file:./dev.db"
     NEXTAUTH_SECRET="your-secret-key"
     NEXTAUTH_URL="http://localhost:3000"
     ```

5. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

6. Start the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 Features

### E-Learning System
- Course creation and management
- Student enrollment
- Video lessons and materials
- Progress tracking
- Course favorites and sharing

### Housing System
- Property listings
- Rental management
- Payment processing
- Property favorites and sharing
- Search and filtering options

## 🏗 Project Structure

```
elearning-platform/
├── app/                    # Next.js 13 app directory
│   ├── api/               # API routes
│   ├── courses/           # Course-related pages
│   ├── housing/           # Housing-related pages
│   ├── dashboard/         # User dashboard pages
│   └── payment/           # Payment processing pages
├── components/            # Reusable UI components
├── lib/                   # Utility functions and configurations
├── prisma/               # Database schema and migrations
└── public/               # Static files
```

## 📚 Key Components Documentation

### Authentication System
- Uses NextAuth.js for authentication
- Supports email/password and social login
- Role-based access control (student, instructor, homeowner)

### Course Management
- Located in `app/courses/`
- Handles course creation, editing, and deletion
- Manages student enrollment and progress
- Implements favorites and sharing functionality

### Housing System
- Located in `app/housing/`
- Property listing and management
- Rental processing and payment handling
- Search and filtering capabilities
- Favorites and sharing features

### Payment System
- Located in `app/payment/`
- Handles course purchases and rental payments
- Secure payment processing
- Transaction history tracking

### Database Schema
The application uses Prisma with the following main models:
- User
- Course
- House
- Rental
- Payment
- Favorites (CoursesFavorite, HouseFavorite)

## 🔧 Common Tasks

### Adding a New Course (Instructors)
1. Navigate to Dashboard
2. Click "Create Course"
3. Fill in course details
4. Upload materials
5. Publish the course

### Renting a Property
1. Browse available properties
2. Select desired property
3. Choose rental dates
4. Complete payment
5. Receive confirmation

### Managing Your Properties (Homeowners)
1. Access Homeowner Dashboard
2. Add/Edit properties
3. View rental history
4. Manage current tenants

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   ```
   Solution: Check your DATABASE_URL in .env
   ```

2. **Next.js Build Error**
   ```
   Solution: Run 'npm run build' to see detailed errors
   ```

3. **Prisma Schema Error**
   ```
   Solution: Run 'npx prisma generate' after schema changes
   ```

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Database ORM by [Prisma](https://www.prisma.io/) 