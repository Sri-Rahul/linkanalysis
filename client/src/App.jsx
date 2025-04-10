import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';

// Layout components
import Layout from '@/components/layout/Layout';

// Page components
import Home from '@/pages/Home';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import UrlCreate from '@/pages/UrlCreate';
import UrlDetails from '@/pages/UrlDetails';
import NotFound from '@/pages/NotFound';
import Profile from '@/pages/Profile';
import Analytics from '@/pages/Analytics';

// Auth components
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="link-analytics-theme">
      <Toaster />
      <Routes>
        {/* Public Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<UrlCreate />} />
            <Route path="/urls/:id" element={<UrlDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/analytics" element={<Analytics />} />
          </Route>
        </Route>
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;