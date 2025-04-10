import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { X, LayoutDashboard, Link2, BarChart3, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Sidebar = ({ open, setOpen }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden transition-all duration-300"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-all duration-300 bg-card border-r border-border md:translate-x-0 shadow-md",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="overflow-y-auto py-5 px-3 h-full flex flex-col">
          <div className="flex items-center justify-between md:hidden mb-5 px-2">
            <span className="text-lg font-semibold">Menu</span>
            <Button
              onClick={() => setOpen(false)}
              variant="ghost"
              size="icon"
              className="rounded-full"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <ul className="space-y-2 flex-1">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  cn(
                    "flex items-center p-2 text-base font-medium rounded-lg transition-all duration-200 hover:bg-accent group",
                    isActive ? "bg-accent text-foreground" : "text-foreground/80"
                  )
                }
                onClick={() => setOpen(false)}
              >
                <LayoutDashboard className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/create"
                className={({ isActive }) =>
                  cn(
                    "flex items-center p-2 text-base font-medium rounded-lg transition-all duration-200 hover:bg-accent group",
                    isActive ? "bg-accent text-foreground" : "text-foreground/80"
                  )
                }
                onClick={() => setOpen(false)}
              >
                <Link2 className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" />
                <span>Create Link</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/analytics"
                className={({ isActive }) =>
                  cn(
                    "flex items-center p-2 text-base font-medium rounded-lg transition-all duration-200 hover:bg-accent group",
                    isActive ? "bg-accent text-foreground" : "text-foreground/80"
                  )
                }
                onClick={() => setOpen(false)}
              >
                <BarChart3 className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" />
                <span>Analytics</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  cn(
                    "flex items-center p-2 text-base font-medium rounded-lg transition-all duration-200 hover:bg-accent group",
                    isActive ? "bg-accent text-foreground" : "text-foreground/80"
                  )
                }
                onClick={() => setOpen(false)}
              >
                <User className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" />
                <span>Profile</span>
              </NavLink>
            </li>
          </ul>
          <div className="pt-5 mt-5 space-y-2 border-t border-border">
            <div className="px-3 py-2 bg-accent/50 rounded-lg shadow-sm">
              <p className="text-sm font-medium">Logged in as:</p>
              <p className="text-sm text-muted-foreground overflow-hidden text-ellipsis">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;