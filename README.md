# Link Analytics Dashboard
![image](https://github.com/user-attachments/assets/750f5f0b-541f-4742-870b-cdaf8d51a877)

A full-stack URL shortener with comprehensive analytics dashboard, similar to Bitly. Users can create shortened links and track their performance including clicks, geographic locations, device types, browsers, and operating systems.

## Features

### Core Features
- **JWT Authentication**: Secure user authentication with JWT tokens
- **URL Shortening**: Create shortened links with custom aliases and expiration dates
- **Analytics Dashboard**: Track comprehensive link performance metrics
- **QR Code Generation**: Generate QR codes for any shortened URL
- **Responsive Design**: Full mobile and desktop support with adaptive sidebar

### Analytics Capabilities
- **Click Tracking**: Record total clicks for each shortened link
- **Device Analytics**: Track visitor device types (mobile, desktop, tablet)
- **Browser Analytics**: Track visitor browser usage statistics
- **OS Analytics**: Track visitor operating system statistics
- **Timeframe Analysis**: Filter analytics by day, week, month or year
- **Visual Reports**: Interactive charts and graphs for data visualization

### User Experience
- **Dark/Light Theme**: Toggle between dark and light mode
- **Responsive Layout**: Mobile-friendly with collapsible sidebar
- **Search & Pagination**: Find and sort through links easily
- **Copy to Clipboard**: One-click copy functionality for shortened URLs
- **Loading States**: Skeleton loaders and loading indicators for better UX

## Tech Stack

### Frontend
- **React.js** (18.x): Modern component-based UI library
- **Redux Toolkit**: State management with thunks for async operations
- **React Router** (v6): Client-side routing with protected routes
- **Recharts/Chart.js**: Data visualization components
- **Shadcn UI**: Component library built on Radix UI primitives
- **TailwindCSS**: Utility-first CSS framework
- **Lucide Icons**: SVG icon library
- **Axios**: HTTP client for API requests
- **QRCodeSVG**: QR code generation library

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: MongoDB object modeling tool
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **UA-Parser-JS**: User agent parsing for analytics
- **Express Async Handler**: Error handling for async routes
- **Dotenv**: Environment variable management

## System Architecture

The application follows a RESTful client-server architecture:

- **Client**: React SPA with Redux for state management
- **API Server**: Express.js REST API with MongoDB database
- **Authentication**: JWT-based token authentication
- **Analytics Collection**: Asynchronous tracking of link clicks
- **Data Flow**: Redux thunks for API communication

## Project Structure

```
linkanalysis/
├── client/                # Frontend React application
│   ├── public/            # Public assets
│   ├── src/               # Source files
│   │   ├── components/    # UI components
│   │   │   ├── layout/    # Layout components (Navbar, Sidebar)
│   │   │   ├── ui/        # Reusable UI components
│   │   │   └── theme-provider.jsx # Theme management
│   │   ├── lib/           # Utility functions
│   │   │   └── axios.js   # API client configuration
│   │   ├── redux/         # Redux store and slices
│   │   │   ├── slices/    # Feature slices (auth, url, analytics)
│   │   │   └── store.js   # Redux store configuration
│   │   ├── pages/         # Page components
│   │   │   ├── Dashboard.jsx  # Main dashboard
│   │   │   ├── UrlDetails.jsx # URL analytics page
│   │   │   ├── Analytics.jsx  # Overall analytics
│   │   │   └── ...        # Other page components
│   │   └── App.jsx        # Main application component
│   ├── index.html         # HTML entry point
│   ├── tailwind.config.js # Tailwind configuration
│   └── netlify.toml       # Netlify deployment configuration
│
└── server/                # Backend Node.js/Express application
    ├── config/            # Configuration files
    │   └── db.js          # Database connection
    ├── controllers/       # Request handlers
    │   ├── authController.js      # Authentication logic
    │   ├── urlController.js       # URL shortening logic
    │   ├── analyticsController.js # Analytics logic
    │   └── redirectController.js  # URL redirection logic
    ├── middleware/        # Express middleware
    │   └── authMiddleware.js      # JWT verification
    ├── models/            # MongoDB models
    │   ├── User.js        # User model
    │   ├── Url.js         # URL model
    │   └── Analytics.js   # Analytics model
    ├── routes/            # API routes
    │   ├── authRoutes.js  # Authentication routes
    │   ├── urlRoutes.js   # URL management routes
    │   └── analyticsRoutes.js # Analytics routes
    └── server.js          # Entry point
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token
- `GET /api/auth/profile` - Get current user profile

### URL Management
- `POST /api/urls` - Create a new shortened URL
- `GET /api/urls` - Get all URLs for the user
- `GET /api/urls/:id` - Get a specific URL
- `PUT /api/urls/:id` - Update a URL
- `DELETE /api/urls/:id` - Delete a URL

### Analytics
- `GET /api/analytics/summary` - Get analytics summary for all URLs
- `GET /api/analytics/url/:urlId` - Get analytics for a specific URL
- `GET /api/analytics/url/:urlId/clicks` - Get clicks over time for a URL
- `GET /api/analytics/url/:urlId/devices` - Get device breakdown for a URL
- `GET /api/analytics/url/:urlId/browsers` - Get browser breakdown for a URL
- `GET /api/analytics/url/:urlId/os` - Get OS breakdown for a URL

### URL Redirection
- `GET /:code` - Redirect to original URL and track analytics

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### URL Model
```javascript
{
  originalUrl: String,
  shortCode: String,
  customAlias: String,
  user: ObjectId (ref: 'User'),
  clicks: Number,
  active: Boolean,
  createdAt: Date,
  expiresAt: Date
}
```

### Analytics Model
```javascript
{
  url: ObjectId (ref: 'Url'),
  timestamp: Date,
  ipAddress: String,
  device: String,
  browser: String,
  os: String,
  country: String,
  city: String,
  referrer: String
}
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/linkanalysis.git
cd linkanalysis
```

2. Install dependencies for both client and server
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables

Create a .env file in the server directory with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/linkanalysis
JWT_SECRET=your_jwt_secret
BASE_URL=http://localhost:3000
PORT=5000
NODE_ENV=development
SEED_DATABASE=true  # Set to true to seed demo data
DB_MODE=regular     # Use 'memory' for testing with MongoDB Memory Server
```

Create a .env file in the client directory:
```
VITE_API_URL=http://localhost:5000
```

4. Start the development servers
```bash
# Start the backend server (from the server directory)
npm run dev

# Start the frontend server (from the client directory)
npm run dev
```

## Deployment

### Live Deployment
- Frontend: [https://advanced-url-shortner.netlify.app](https://advanced-url-shortner.netlify.app)
- Backend: [https://link-analytics-api-jact.onrender.com](https://link-analytics-api-jact.onrender.com)

### Deployment Configuration
- **Frontend**: Deployed on Netlify with proxy configuration
- **Backend**: Deployed on Render with MongoDB Atlas
- **Database**: MongoDB Atlas cluster in Mumbai (ap-south-1) region

### Environment Setup
- **Netlify**: Uses netlify.toml configuration for redirects and proxy setup
- **Render**: Uses environment variables for MongoDB connection and JWT secrets
- **CORS**: Configured to allow requests between domains

## Test Credentials

Use the following credentials to test the application:
- Email: intern@dacoid.com
- Password: Test123

## Acknowledgments

- Built as a micro-SaaS project showcasing full-stack development capabilities
- Inspired by services like Bitly and TinyURL
