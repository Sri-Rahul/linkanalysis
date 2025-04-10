# Link Analytics Dashboard

A full-stack URL shortener with analytics dashboard, similar to Bitly. Users can create shortened links and track their performance including clicks, locations, and devices.

## Features

- **Authentication**: Email/password login using JWT
- **URL Shortening**: Create shortened links with optional custom aliases and expiration dates
- **Analytics Dashboard**: Track link performance with detailed statistics
- **QR Code Generation**: Generate QR codes for shortened URLs
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- React.js
- Redux Toolkit for state management
- Recharts for data visualization
- Shadcn UI components
- TailwindCSS for styling

### Backend
- Node.js
- Express.js
- MongoDB for database
- JWT for authentication

## Project Structure

```
linkanalysis/
├── client/                # Frontend React application
│   ├── public/            # Public assets
│   └── src/               # Source files
│       ├── components/    # UI components
│       ├── lib/           # Utility functions
│       ├── redux/         # Redux store and slices
│       ├── pages/         # Page components
│       └── App.jsx        # Main application component
└── server/                # Backend Node.js/Express application
    ├── config/            # Configuration files
    ├── controllers/       # Request handlers
    ├── middleware/        # Express middleware
    ├── models/            # MongoDB models
    ├── routes/            # API routes
    └── server.js          # Entry point
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

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

Create a `.env` file in the server directory with the following variables:

```
MONGODB_URI=mongodb://localhost:27017/linkanalysis
JWT_SECRET=your_jwt_secret
BASE_URL=http://localhost:3000
PORT=5000
```

4. Start the development servers

```bash
# Start the backend server (from the server directory)
npm run dev

# Start the frontend server (from the client directory)
npm run dev
```

## Test Credentials

Use the following credentials to test the application:

- Email: intern@dacoid.com
- Password: Test123

## Deployment

The application is deployed at: [Link to deployed application]

## License

This project is licensed under the MIT License - see the LICENSE file for details.