import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Link2, BarChart3, Clock, ChevronRight } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Link Analytics</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">
              Login
            </Link>
            <Link 
              to="/register" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 flex flex-col-reverse md:flex-row items-center">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Track your links with powerful analytics</h1>
          <p className="text-xl text-muted-foreground">
            Create shortened links, share them anywhere, and track their performance with detailed analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/register" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Start for free
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
            <Link 
              to="/login" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              Sign in
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 mb-8 md:mb-0 flex justify-center">
          <div className="w-full max-w-md aspect-video rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-center h-full bg-accent/20 rounded">
              <BarChart3 className="h-16 w-16 text-muted-foreground" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-accent/20 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <Link2 className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">URL Shortening</h3>
              <p className="text-muted-foreground">
                Turn long URLs into short, shareable links that are easy to remember and track.
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <BarChart3 className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Detailed Analytics</h3>
              <p className="text-muted-foreground">
                Track clicks, geographic data, devices, and more with comprehensive dashboards.
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <Clock className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Link Expiration</h3>
              <p className="text-muted-foreground">
                Set expiration dates for your links to control when they should no longer be active.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of users who are tracking their links and gaining valuable insights with Link Analytics.
        </p>
        <Link 
          to="/register" 
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2"
        >
          Create your account
        </Link>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Link Analytics. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;