import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

/**
 * Main layout component for authenticated pages
 * Includes navbar, sidebar, and main content area
 */
const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  // Close sidebar on route change on mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar setSidebarOpen={setSidebarOpen} />
      <div className="flex">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <main className="flex-1 p-4 md:p-6 pt-28 md:ml-64 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;