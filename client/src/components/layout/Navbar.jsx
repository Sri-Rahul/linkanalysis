import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, X, Plus, Moon, Sun, User, LogOut, Settings, LineChart } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { logout } from '@/redux/slices/authSlice';

// Import Shadcn UI components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';

const Navbar = ({ setSidebarOpen }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    dispatch(logout());
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-background border-b border-border shadow-sm h-16">
      <div className="px-3 py-3 lg:px-5 lg:pl-3 h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center justify-start">
            <Button 
              onClick={() => setSidebarOpen(true)}
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <Link to="/" className="flex ml-2 md:mr-24 items-center gap-2 group">
              <LineChart className="w-7 h-7 text-primary transition-transform group-hover:scale-110 duration-300" />
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap transition-colors group-hover:text-primary">Link Analytics</span>
            </Link>
          </div>
          <div className="flex items-center">
            <div className="flex items-center ml-3 gap-2">
              <Button
                onClick={toggleTheme}
                variant="ghost"
                size="icon"
                className="rounded-lg"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>
              
              <Link
                to="/create"
                className="hidden sm:flex ml-1 items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 focus:ring-4 focus:ring-primary/50 transition-all duration-200 shadow-sm hover:shadow"
              >
                <Plus className="w-4 h-4 mr-1" />
                New Link
              </Link>
              
              <div className="relative ml-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full focus:ring-2 focus:ring-primary transition-all duration-200 p-1 hover:bg-accent"
                    >
                      <span className="sr-only">Open user menu</span>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground shadow-sm">
                        {user?.name ? user.name[0].toUpperCase() : <User className="w-4 h-4" />}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer">
                        <LineChart className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive cursor-pointer" 
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;