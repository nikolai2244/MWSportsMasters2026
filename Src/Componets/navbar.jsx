import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, LogOut, User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import MWLogo from "./MWLogo";
import ThemeToggle from "./ThemeToggle";

const PUBLIC_LINKS = [
    { to: "/", label: "Home" },
    { to: "/leaderboard", label: "Leaderboard" },
    { to: "/about", label: "About" },
];

const VIP_LINKS = [
    { to: "/bets", label: "My Masters Bets", icon: "🎯" },
    { to: "/finishes", label: "Tournament Finishes", icon: "🏆" },
    { to: "/rounds", label: "Round Details", icon: "⛳" },
];

const ADMIN_LINKS = [
    { to: "/admin", label: "Admin Panel", icon: "🎲" },
];

export default function Navbar({ isLoggedIn, currentUser, onLoginClick, onLogout }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const isAdmin = currentUser?.role === "admin";

    const allLinks = [
        ...PUBLIC_LINKS,
        ...(isLoggedIn ? VIP_LINKS : []),
        ...(isLoggedIn && isAdmin ? ADMIN_LINKS : []),
    ];

    return (
        <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="shrink-0">
                        <MWLogo className="h-9" />
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {allLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`px-3 py-2 text-sm font-body font-medium rounded-md transition-colors ${location.pathname === link.to
                                        ? "text-foreground bg-surface-offset"
                                        : "text-muted-foreground hover:text-foreground hover:bg-surface-offset/50"
                                    }`}
                            >
                                {link.icon ? `${link.icon} ${link.label}` : link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-2">
                        <ThemeToggle />

                        {!isLoggedIn ? (
                            <div className="hidden md:flex items-center gap-2">
                                <Link to="/signup">
                                    <Button variant="outline" size="sm" className="text-xs border-gold/30 text-gold hover:bg-gold/10">
                                        VIP Sign Up
                                    </Button>
                                </Link>
                                <Button size="sm" onClick={onLoginClick} className="text-xs bg-primary hover:bg-primary/80">
                                    <Lock className="h-3 w-3 mr-1" /> Login
                                </Button>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center gap-2">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface-offset">
                                    <User className="h-3.5 w-3.5 text-gold" />
                                    <span className="text-xs font-medium">{currentUser?.name}</span>
                                    {isAdmin && (
                                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gold/20 text-gold font-medium">
                                            ADMIN
                                        </span>
                                    )}
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onLogout}>
                                    <LogOut className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        )}

                        {/* Mobile hamburger */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden h-9 w-9"
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
                    <div className="px-4 py-3 space-y-1">
                        {allLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setMobileOpen(false)}
                                className={`block px-3 py-2.5 text-sm rounded-md transition-colors ${location.pathname === link.to
                                        ? "text-foreground bg-surface-offset"
                                        : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                {link.icon ? `${link.icon} ${link.label}` : link.label}
                            </Link>
                        ))}
                        <div className="pt-2 border-t border-border/50">
                            {!isLoggedIn ? (
                                <div className="space-y-2">
                                    <Link to="/signup" onClick={() => setMobileOpen(false)}>
                                        <Button variant="outline" className="w-full text-xs border-gold/30 text-gold">
                                            VIP Sign Up
                                        </Button>
                                    </Link>
                                    <Button className="w-full text-xs" onClick={() => { onLoginClick(); setMobileOpen(false); }}>
                                        <Lock className="h-3 w-3 mr-1" /> Login
                                    </Button>
                                </div>
                            ) : (
                                <Button variant="ghost" className="w-full justify-start text-sm" onClick={onLogout}>
                                    <LogOut className="h-4 w-4 mr-2" /> Sign Out
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}