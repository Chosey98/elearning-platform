# Technical Documentation

## Architecture Overview

The application is built using a modern web stack:

- **Frontend**: Next.js 13 (App Router) with TypeScript
- **Backend**: Next.js API Routes
- **Database**: SQLite (development) / PostgreSQL (production) with Prisma ORM
- **Authentication**: NextAuth.js
- **UI Components**: shadcn/ui (based on Radix UI)
- **Styling**: Tailwind CSS

## Core Components

### Authentication (`lib/auth.ts`)
- Implements NextAuth.js configuration
- Handles user sessions and role-based access
- Supports email/password authentication
- Manages user roles (student, instructor, homeowner)

### Database Schema (`prisma/schema.prisma`)

```prisma
model User {
  id              String    @id @default(cuid())
  name            String
  email           String    @unique
  password        String
  role            String    @default("student")
  courses         Course[]  @relation("InstructorCourses")
  enrollments     Course[]  @relation("StudentCourses")
  houses          House[]   @relation("HomeownerHouses")
  rentals         Rental[]  @relation("RenterRentals")
  courseFavorites CourseFavorite[]
  houseFavorites  HouseFavorite[]
}

model Course {
  id          String    @id @default(cuid())
  title       String
  description String
  price       Float
  instructorId String
  instructor  User      @relation("InstructorCourses", fields: [instructorId], references: [id])
  students    User[]    @relation("StudentCourses")
  favorites   CourseFavorite[]
}

model House {
  id          String    @id @default(cuid())
  title       String
  description String
  address     String
  price       Float
  status      String    @default("available")
  homeownerId String
  homeowner   User      @relation("HomeownerHouses", fields: [homeownerId], references: [id])
  rentals     Rental[]
  favorites   HouseFavorite[]
}

model Rental {
  id        String    @id @default(cuid())
  startDate DateTime
  endDate   DateTime?
  status    String    @default("active")
  houseId   String
  house     House     @relation(fields: [houseId], references: [id])
  renterId  String
  renter    User      @relation("RenterRentals", fields: [renterId], references: [id])
}
```

### API Routes

#### Course Management (`app/api/courses/`)
- `route.ts`: GET (list courses), POST (create course)
- `[courseId]/route.ts`: GET, PUT, DELETE course
- `[courseId]/enroll/route.ts`: POST (enroll in course)
- `[courseId]/favorite/route.ts`: GET, POST (toggle favorite)

#### Housing Management (`app/api/housing/`)
- `route.ts`: GET (list properties), POST (create property)
- `[houseId]/route.ts`: GET, PUT, DELETE property
- `[houseId]/rent/route.ts`: POST (create rental)
- `[houseId]/favorite/route.ts`: GET, POST (toggle favorite)

#### Payment System (`app/api/payment/`)
- Handles payment processing for both courses and housing
- Manages transaction records
- Implements payment status updates

### Frontend Pages

#### Course Pages (`app/courses/`)
```typescript
// [courseId]/page.tsx
export default function CourseDetailPage({
  params: { courseId }
}: {
  params: { courseId: string }
}) {
  // Course details, enrollment, favorites functionality
}
```

#### Housing Pages (`app/housing/`)
```typescript
// [houseId]/page.tsx
export default function HouseDetailPage({
  params: { houseId }
}: {
  params: { houseId: string }
}) {
  // Property details, rental, favorites functionality
}

// [houseId]/rent/page.tsx
export default function RentHousePage({
  params: { houseId }
}: {
  params: { houseId: string }
}) {
  // Rental form and payment processing
}
```

### Shared Components

#### UI Components (`components/ui/`)
- Button
- Card
- Dialog
- Input
- Select
- Toast
- ... and more from shadcn/ui

#### Custom Components (`components/`)
- CourseCard
- HouseCard
- PaymentForm
- SearchFilters
- UserAvatar
- ... and more

## State Management

The application uses React's built-in state management with:
- `useState` for component-level state
- `useEffect` for side effects
- Server-side data fetching with Next.js
- Form state management with controlled components

## Data Flow

1. **User Interactions**
   - UI events trigger state changes
   - Forms collect user input
   - Client-side validation

2. **API Requests**
   - Next.js API routes handle requests
   - Authentication middleware validates sessions
   - Database operations via Prisma

3. **Data Updates**
   - Real-time UI updates
   - Optimistic updates for better UX
   - Error handling and recovery

## Security Measures

1. **Authentication**
   - Session-based auth with NextAuth.js
   - Secure password hashing
   - CSRF protection

2. **Authorization**
   - Role-based access control
   - API route protection
   - Resource ownership validation

3. **Data Protection**
   - Input sanitization
   - SQL injection prevention (via Prisma)
   - XSS protection

## Error Handling

```typescript
try {
  // Operation
} catch (error) {
  console.error('Error:', error);
  toast({
    title: 'Error',
    description: error instanceof Error ? error.message : 'An error occurred',
    variant: 'destructive'
  });
}
```

## Testing

1. **Unit Tests**
   - Component testing with Jest
   - API route testing
   - Utility function testing

2. **Integration Tests**
   - API endpoint integration
   - Database operations
   - Authentication flows

3. **E2E Tests**
   - User flows with Cypress
   - Payment processing
   - Form submissions

## Performance Optimization

1. **Frontend**
   - Image optimization
   - Code splitting
   - Lazy loading
   - Caching strategies

2. **Backend**
   - Database indexing
   - Query optimization
   - Rate limiting
   - Response caching

## Deployment

1. **Development**
   ```bash
   npm run dev
   ```

2. **Production Build**
   ```bash
   npm run build
   npm start
   ```

3. **Database Migration**
   ```bash
   npx prisma migrate deploy
   ```

## Monitoring and Logging

1. **Error Tracking**
   - Console logging
   - Error boundaries
   - API error handling

2. **Performance Monitoring**
   - Page load times
   - API response times
   - Database query performance

3. **User Analytics**
   - Page views
   - User interactions
   - Conversion tracking 