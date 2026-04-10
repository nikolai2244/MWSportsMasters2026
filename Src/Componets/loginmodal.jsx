import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// In-memory user accounts
const ACCOUNTS = [
    { id: 1, username: "admin", password: "MayorWard2025!", role: "admin", name: "MayorWard Admin" },
    { id: 2, username: "vip_demo", password: "demo123", role: "vip", name: "VIP Demo User" },
];

export default function LoginModal({ open, onClose, onLogin, approvedUsers = [] }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [shake, setShake] = useState(false);

    const allAccounts = [...ACCOUNTS, ...approvedUsers];

    const handleSubmit = (e) => {
        e.preventDefault();
        const user = allAccounts.find(
            (u) => u.username === username && u.password === password
        );
        if (user) {
            setError("");
            onLogin(user);
            setUsername("");
            setPassword("");
        } else {
            setError("Invalid credentials");
            setShake(true);
            setTimeout(() => setShake(false), 600);
        }
    };

    if (!open) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="relative w-full max-w-sm mx-4 bg-card border border-border rounded-xl p-6 shadow-2xl"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{
                        scale: 1,
                        opacity: 1,
                        x: shake ? [0, -10, 10, -10, 10, 0] : 0,
                    }}
                    transition={{ duration: shake ? 0.5 : 0.2 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={onClose}
                    >
                        <X className="h-4 w-4" />
                    </button>

                    <div className="text-center mb-6">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                            <Lock className="h-5 w-5 text-primary" />
                        </div>
                        <h2 className="font-display text-2xl font-bold">VIP Access</h2>
                        <p className="text-sm text-muted-foreground mt-1">Sign in to your MayorWard Sports account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="login-username" className="text-xs font-medium">Username</Label>
                            <Input
                                id="login-username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                className="bg-surface2 border-border/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="login-password" className="text-xs font-medium">Password</Label>
                            <div className="relative">
                                <Input
                                    id="login-password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="bg-surface2 border-border/50 pr-10"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-xs text-loss font-medium text-center"
                            >
                                {error}
                            </motion.p>
                        )}

                        <Button type="submit" className="w-full bg-primary hover:bg-primary/80 font-medium">
                            Sign In
                        </Button>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}