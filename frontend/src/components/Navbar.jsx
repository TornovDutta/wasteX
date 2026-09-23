import { Link } from "react-router-dom";
import { Leaf, Menu, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50">
      <nav className="sticky top-0 z-50 border-b border-gray-800 bg-primary/80 backdrop-blur-md transition-colors">
        <div className="box-border mx-auto w-[1300px] max-w-full px-5 lg:px-16 border-x border-gray-800 border-dashed">
          <div className="flex h-14 items-center justify-between">
            <div className="flex min-w-0 gap-10 items-center">
              <Link to="/" className="flex shrink-0 items-center gap-2.5 text-lg font-semibold text-textmain">
                <img src="/logo.jpg" alt="WasteX Logo" className="w-7 h-7 rounded" />
                WasteX
              </Link>
              <div className="hidden min-w-0 flex-nowrap items-center gap-6 overflow-x-auto md:mr-6 md:flex">
                <Link to="/" className="shrink-0 text-sm text-textmuted transition-colors hover:text-textmain font-mono uppercase tracking-wider">Home</Link>
                <a href="#marketplace" className="shrink-0 text-sm text-textmuted transition-colors hover:text-textmain font-mono uppercase tracking-wider">Marketplace</a>
                <a href="#process" className="shrink-0 text-sm text-textmuted transition-colors hover:text-textmain font-mono uppercase tracking-wider">Process</a>
                <a href="#benefits" className="shrink-0 text-sm text-textmuted transition-colors hover:text-textmain font-mono uppercase tracking-wider">Benefits</a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-3 md:flex">
                <Link to="/create" className="relative inline-flex shrink-0 items-center justify-center rounded-sm border border-transparent bg-accent text-primary font-medium whitespace-nowrap transition-all outline-none select-none hover:bg-orange-500 h-8 gap-1.5 px-3 text-sm">
                  List Waste
                </Link>
                
                {user && (
                  <Link to="/nearby-buyers" className="relative inline-flex shrink-0 items-center justify-center rounded-sm border border-gray-700 bg-secondary text-textmain font-medium whitespace-nowrap transition-all hover:bg-gray-800 h-8 px-3 text-sm">
                    Nearby Buyers
                  </Link>
                )}
                
                {user ? (
                  <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-800">
                    <div className="flex items-center gap-2">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="Profile" className="w-6 h-6 rounded-full" />
                      ) : (
                        <UserIcon className="w-5 h-5 text-textmuted" />
                      )}
                      <span className="text-sm font-mono text-textmain">{user.displayName || user.email}</span>
                    </div>
                    <button onClick={logout} className="text-textmuted hover:text-red-400 transition-colors" title="Sign out">
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="ml-2 relative inline-flex shrink-0 items-center justify-center rounded-sm border border-gray-700 bg-secondary text-textmain font-medium whitespace-nowrap transition-all hover:bg-gray-800 h-8 px-3 text-sm">
                    Sign in
                  </Link>
                )}
              </div>
              <button className="md:hidden text-textmain">
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
