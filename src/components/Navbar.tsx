import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FlaskConical, LayoutDashboard, Zap, History, ChevronDown, LogOut, User, Menu, X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = user
    ? [
        { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { to: "/generate", label: "Generar", icon: Zap },
        { to: "/history", label: "Historial", icon: History },
      ]
    : [];

  const isActive = (path: string) => location.pathname === path;

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Usuario";
  const planColors: Record<string, string> = {
    free: "bg-slate-700 text-slate-300",
    pro: "bg-sky-500/20 text-sky-300 border border-sky-500/30",
    team: "bg-violet-500/20 text-violet-300 border border-violet-500/30",
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-violet-600">
              <FlaskConical className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-slate-100 text-sm">TestCraft AI</span>
          </Link>

          {/* Desktop nav */}
          {user && (
            <div className="hidden sm:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? "bg-sky-500/10 text-sky-400"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {profile && (
                  <span className={`hidden sm:inline text-xs px-2 py-0.5 rounded-full font-medium capitalize ${planColors[profile.plan] ?? planColors.free}`}>
                    {profile.plan}
                  </span>
                )}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-sky-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white">
                      {displayName[0]?.toUpperCase()}
                    </div>
                    <span className="hidden sm:block text-sm text-slate-300 max-w-[100px] truncate">
                      {displayName}
                    </span>
                    <ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-1 w-48 rounded-xl bg-slate-800 border border-slate-700 shadow-xl z-50 overflow-hidden">
                      <div className="px-3 py-2 border-b border-slate-700">
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/pricing"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-700 transition-colors"
                      >
                        <User className="h-4 w-4 text-slate-400" />
                        Plan y precios
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
                {/* Mobile hamburger */}
                <button
                  className="sm:hidden p-1.5 rounded-lg hover:bg-slate-800 text-slate-400"
                  onClick={() => setMobileMenuOpen((v) => !v)}
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-sm text-slate-300 hover:text-slate-100 transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-sm font-medium transition-colors"
                >
                  Empezar gratis
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {user && mobileMenuOpen && (
          <div className="sm:hidden border-t border-slate-800 py-2 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? "bg-sky-500/10 text-sky-400"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
