# Shakham Project

A full-stack application with React + Vite frontend and Express backend.

## Prerequisites

- Node.js (v18 or higher)
- npm (Node Package Manager)

## Project Structure

```
shakham/
├── client/                # React + Vite frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── ui/       # Base UI components (buttons, inputs, etc.)
│   │   │   ├── course/   # Course-related components
│   │   │   └── layout/   # Layout components (header, footer, etc.)
│   │   ├── features/      # Feature-specific components
│   │   │   ├── auth/     # Authentication related components
│   │   │   ├── courses/  # Course management components
│   │   │   └── profile/  # User profile components
│   │   ├── hooks/        # Custom React hooks
│   │   │   ├── useAuth   # Authentication hooks
│   │   │   └── useCourse # Course management hooks
│   │   ├── store/        # Redux store configuration
│   │   │   ├── slices/   # Redux slices
│   │   │   └── api/      # API integration
│   │   └── types/        # TypeScript interfaces
├── server/               # Express backend
│   ├── controllers/      # Route controllers
│   │   ├── auth         # Authentication controllers
│   │   ├── courses      # Course management
│   │   └── users        # User management
│   ├── models/          # Data models
│   │   ├── Course       # Course schema
│   │   └── User         # User schema
│   ├── routes/          # API routes
│   │   ├── auth         # Auth routes
│   │   ├── courses      # Course routes
│   │   └── users        # User routes
│   └── middleware/      # Custom middleware
│       ├── auth         # Authentication middleware
│       └── validation   # Request validation
└── package.json         # Root package.json for concurrent execution
```

## Quick Start

1. **Install Dependencies**

   Install all dependencies for client, server, and root project:
   ```bash
   npm run install-all
   ```

2. **Environment Setup**

   Create `.env` file in the server directory:
   ```
   PORT=5000
   ```

3. **Start Development Server**

   Run both frontend and backend concurrently:
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend at: `http://localhost:5173`
   - Backend at: `http://localhost:5000`

## API Routes

### Course Routes
- `GET /api/courses` - Get all courses with optional filtering
  - Query params:
    - `category`: Filter by course category
    - `priceRange`: Filter by price ranges ("Free", "Under ₹500", "₹500-₹2000", "Above ₹2000")
    - `level`: Filter by difficulty ("Beginner", "Intermediate", "Advanced", "All Levels")
    - `tags`: Filter by course tags (comma-separated)
    - `sortBy`: Sort results ("popular", "new", "rating", "price")
    - `page`: Pagination page number
    - `limit`: Items per page
- `GET /api/courses/:id` - Get course by ID
  - Returns detailed course information including videos
- `POST /api/courses` - Create new course (requires teacher auth)
  - Required fields: title, description, price, category, videos
  - Optional fields: thumbnail, tags, level, duration
- `PUT /api/courses/:id` - Update course (requires teacher auth)
  - Can update any course fields
  - Validates teacher ownership
- `DELETE /api/courses/:id` - Delete course (requires teacher auth)
  - Validates teacher ownership before deletion

### User Routes
- `POST /api/auth/register` - Register new user
  - Required fields: name, email, password, role
  - Validates email uniqueness
  - Returns JWT token
- `POST /api/auth/login` - User login
  - Required fields: email, password
  - Returns JWT token and user details
- `GET /api/users/me` - Get current user profile (requires auth)
  - Returns user details and role
- `GET /api/users/:id/courses` - Get user's courses
  - For students: returns enrolled courses
  - For teachers: returns created courses

## API Documentation

### Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Course Routes

#### GET /api/courses
Get all courses with filtering options.

**Query Parameters:**
```typescript
{
  category?: string          // Course category
  priceRange?: string       // "Free" | "Under ₹500" | "₹500-₹2000" | "Above ₹2000"
  level?: string           // "Beginner" | "Intermediate" | "Advanced" | "All Levels"
  tags?: string           // Comma-separated tags
  sortBy?: string        // "popular" | "new" | "rating" | "price"
  page?: number         // Default: 1
  limit?: number       // Default: 10
}
```

**Response:**
```typescript
{
  courses: Course[]
  total: number
  page: number
  totalPages: number
}
```

#### GET /api/courses/:id
Get detailed course information.

**Response:**
```typescript
{
  _id: string
  title: string
  description: string
  instructor?: string
  thumbnail?: string
  price: number
  discountedPrice?: number
  rating: number
  totalRatings?: number
  totalStudents?: number
  duration?: string
  level?: string
  category: string
  tags?: string[]
  isPopular?: boolean
  isNew?: boolean
  videos: string[]
  teacher: string
}
```

#### POST /api/courses
Create a new course (requires teacher auth).

**Request Body:**
```typescript
{
  title: string          // Required
  description: string    // Required
  price: number         // Required
  category: string      // Required
  videos: string[]      // Required
  thumbnail?: string    // Optional
  tags?: string[]       // Optional
  level?: string        // Optional
  duration?: string     // Optional
  discountedPrice?: number // Optional
}
```

**Response:** Created course object

#### PUT /api/courses/:id
Update course details (requires teacher auth).

**Request Body:** Any course fields to update
**Response:** Updated course object

#### DELETE /api/courses/:id
Delete a course (requires teacher auth).

**Response:**
```typescript
{
  message: "Course deleted successfully"
}
```

### User Routes

#### POST /api/auth/register
Register a new user.

**Request Body:**
```typescript
{
  name: string      // Required
  email: string     // Required, must be unique
  password: string  // Required, min 6 characters
  role: string      // Required: "student" | "teacher"
}
```

**Response:**
```typescript
{
  token: string
  user: {
    _id: string
    name: string
    email: string
    role: string
  }
}
```

#### POST /api/auth/login
User login.

**Request Body:**
```typescript
{
  email: string
  password: string
}
```

**Response:**
```typescript
{
  token: string
  user: {
    _id: string
    name: string
    email: string
    role: string
  }
}
```

#### GET /api/users/me
Get current user profile (requires auth).

**Response:**
```typescript
{
  _id: string
  name: string
  email: string
  role: string
  enrolledCourses?: string[]  // For students
  createdCourses?: string[]   // For teachers
}
```

#### GET /api/users/:id/courses
Get user's courses.

**Query Parameters:**
```typescript
{
  page?: number     // Default: 1
  limit?: number    // Default: 10
  sortBy?: string   // "recent" | "rating"
}
```

**Response:**
```typescript
{
  courses: Course[]
  total: number
  page: number
  totalPages: number
}
```

### Error Responses
All API endpoints return standardized error responses:

```typescript
{
  error: {
    message: string
    code: string
    details?: any
  }
}
```

Common error codes:
- `AUTH_REQUIRED`: Authentication required
- `INVALID_CREDENTIALS`: Invalid login credentials
- `NOT_FOUND`: Resource not found
- `FORBIDDEN`: User doesn't have permission
- `VALIDATION_ERROR`: Invalid request data

### Rate Limiting
- API requests are limited to 100 requests per IP per 15 minutes
- Authentication endpoints are limited to 5 attempts per IP per 15 minutes

## API Usage Examples

#### Authentication Flow Example
```javascript
// 1. Register a new user
const registerUser = async () => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: "John Doe",
      email: "john@example.com",
      password: "secure123",
      role: "student"
    })
  });
  const data = await response.json();
  // Store token: data.token
};

// 2. Login
const login = async () => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: "john@example.com",
      password: "secure123"
    })
  });
  const data = await response.json();
  // Store token: data.token
};

// 3. Using the token for protected routes
const getUserProfile = async (token) => {
  const response = await fetch('/api/users/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const profile = await response.json();
};
```

#### Course Filtering Examples
```javascript
// 1. Get beginner courses under ₹500
const getBeginnerCourses = async () => {
  const response = await fetch('/api/courses?level=Beginner&priceRange=Under ₹500');
  const data = await response.json();
};

// 2. Get popular web development courses
const getPopularWebDevCourses = async () => {
  const response = await fetch('/api/courses?category=Web Development&sortBy=popular');
  const data = await response.json();
};

// 3. Get courses with multiple filters
const getFilteredCourses = async () => {
  const params = new URLSearchParams({
    category: 'Programming',
    level: 'Intermediate',
    tags: 'javascript,react',
    sortBy: 'rating',
    page: '1',
    limit: '10'
  });
  const response = await fetch(`/api/courses?${params}`);
  const data = await response.json();
};
```

#### Course Management Examples
```javascript
// 1. Create a new course
const createCourse = async (token) => {
  const response = await fetch('/api/courses', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: "Advanced React Development",
      description: "Master React with advanced concepts",
      price: 1999,
      category: "Web Development",
      level: "Advanced",
      videos: ["video1.mp4", "video2.mp4"],
      tags: ["react", "javascript", "web"],
      duration: "10 hours"
    })
  });
  const course = await response.json();
};

// 2. Update course price and description
const updateCourse = async (token, courseId) => {
  const response = await fetch(`/api/courses/${courseId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      price: 1499,
      description: "Updated course description",
      discountedPrice: 999
    })
  });
  const updated = await response.json();
};
```

#### Error Handling Examples
```javascript
// 1. Handle authentication errors
const handleAuthError = async () => {
  try {
    const response = await fetch('/api/users/me', {
      headers: { 'Authorization': 'Bearer invalid_token' }
    });
    const data = await response.json();
    
    if (!response.ok) {
      switch (data.error.code) {
        case 'AUTH_REQUIRED':
          // Redirect to login
          break;
        case 'INVALID_CREDENTIALS':
          // Show login error message
          break;
      }
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};

// 2. Handle validation errors
const handleValidationError = async (token) => {
  try {
    const response = await fetch('/api/courses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: "", // Invalid: empty title
        price: -100 // Invalid: negative price
      })
    });
    const data = await response.json();
    
    if (data.error.code === 'VALIDATION_ERROR') {
      // Example validation error response:
      // {
      //   error: {
      //     code: 'VALIDATION_ERROR',
      //     message: 'Invalid request data',
      //     details: {
      //       title: 'Title is required',
      //       price: 'Price must be a positive number'
      //     }
      //   }
      // }
      
      Object.entries(data.error.details).forEach(([field, message]) => {
        console.error(`${field}: ${message}`);
      });
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};

// 3. Handle rate limiting
const handleRateLimit = async () => {
  try {
    const response = await fetch('/api/courses');
    
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      console.log(`Rate limit exceeded. Try again in ${retryAfter} seconds`);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};
```

#### Using WebSocket for Real-time Updates
```javascript
// Connect to WebSocket for real-time course updates
const connectWebSocket = (token) => {
  const ws = new WebSocket('ws://your-api-domain/ws');
  
  ws.onopen = () => {
    // Authenticate WebSocket connection
    ws.send(JSON.stringify({ type: 'auth', token }));
  };
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    switch (data.type) {
      case 'course_updated':
        // Handle course update
        break;
      case 'new_rating':
        // Handle new rating
        break;
      case 'student_enrolled':
        // Handle new enrollment
        break;
    }
  };
};
```

## Data Models

### Course Interface
```typescript
interface Course {
  _id: string
  title: string
  description: string
  instructor?: string
  thumbnail?: string
  price: number
  discountedPrice?: number
  rating: number
  totalRatings?: number
  totalStudents?: number
  duration?: string
  level?: "Beginner" | "Intermediate" | "Advanced" | "All Levels"
  category: string
  tags?: string[]
  isPopular?: boolean
  isNew?: boolean
  videos: string[]
  teacher: string
}
```

### Filter State Interface
```typescript
interface FilterState {
  categories: string[]
  priceRange: string
  level?: string
  userCourses: "all" | "my"
  tags?: string[]
  sortBy?: "popular" | "new" | "rating" | "price"
}
```

## Features

### Course Management
- **Advanced Filtering System**
  - Category-based filtering with dynamic category extraction
  - Price range filtering with Indian Rupee ranges
  - Level-based filtering (Beginner to Advanced)
  - Tag-based filtering with multiple tag support
  - Sort by popularity, newest, rating, or price
  
- **Price Management**
  - Indian Rupee (₹) formatting
  - Support for free courses
  - Discounted price handling
  - Price range categories

- **Content Organization**
  - Duration display with automatic formatting
  - Tag system with pill styling
  - Thumbnail management with fallback images
  - Video content management
  - Level indicators

- **User Experience**
  - Rating system with total ratings display
  - Student enrollment tracking
  - Progress tracking
  - Teacher-specific edit capabilities
  - Course popularity indicators

### UI Components
- **Modern Design Elements**
  - Hero section with gradient background
  - Responsive grid layout
    - 1 column for mobile
    - 2 columns for tablet
    - 3-4 columns for desktop
  - Hover effects on course cards
  - Modern typography

- **Interactive Elements**
  - Advanced search functionality
  - Filter sheets with clear indicators
  - Loading skeletons for better UX
  - Empty state designs
  - Toast notifications for feedback

- **Course Cards**
  - Thumbnail display with fallback
  - Price display with discount badges
  - Rating display with stars
  - Level and duration indicators
  - Tag pills with overflow handling

### Authentication & Authorization
- JWT-based authentication
- Role-based access control
  - Student features
  - Teacher features
- Protected route handling
- Token persistence
- Automatic token refresh

## Available Scripts

- `npm run dev` - Start both client and server in development mode
- `npm run client` - Start only the frontend
- `npm run server` - Start only the backend
- `npm run install-all` - Install dependencies for client, server, and root project

## Tech Stack

### Frontend
- React
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui

### Backend
- Express.js
- Node.js
- CORS enabled
  

## Team Shakham.Inc

Our dedicated team members:

- **Frontend Development**: Dhananjay Kakade
- **Backend Development**: Saad Sayyed
- **AI/ML Model**: 
  - Siddhi Bodake
  - Prathamesh Ghatmal
- **Documentation**: Dhananjay Kakade
