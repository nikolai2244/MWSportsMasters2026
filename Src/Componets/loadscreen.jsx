import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LOAD_DURATION = 25000; // 25 seconds

export default function LoadScreen({ onComplete }) {
    const [progress, setProgress] = useState(0);
    const [phase, setPhase] = useState("ball"); // ball → logo → ready
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const pct = Math.min((elapsed / LOAD_DURATION) * 100, 100);
            setProgress(pct);

            if (pct > 20 && phase === "ball") setPhase("logo");
            if (pct >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    setVisible(false);
                    setTimeout(onComplete, 600);
                }, 300);
            }
        }, 50);

        return () => clearInterval(interval);
    }, [onComplete, phase]);

    const handleSkip = () => {
        setVisible(false);
        setTimeout(onComplete, 400);
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
                    style={{ background: "linear-gradient(180deg, #080d06 0%, #0a1208 60%, #0d1a0a 100%)" }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Floating gold particles */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 rounded-full"
                                style={{
                                    background: `hsl(${45 + Math.random() * 10} ${70 + Math.random() * 20}% ${50 + Math.random() * 20}%)`,
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                }}
                                animate={{
                                    y: [0, -80 - Math.random() * 120],
                                    opacity: [0, 0.8, 0],
                                    scale: [0, 1.5, 0],
                                }}
                                transition={{
                                    duration: 3 + Math.random() * 4,
                                    repeat: Infinity,
                                    delay: Math.random() * 5,
                                    ease: "easeOut",
                                }}
                            />
                        ))}
                    </div>

                    {/* Grass texture at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
                        <motion.div
                            className="absolute inset-0"
                            style={{
                                background: "linear-gradient(to top, #1a3d12 0%, #122a0e 40%, transparent 100%)",
                            }}
                            animate={{ opacity: [0.4, 0.7, 0.4] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        />
                        {Array.from({ length: 40 }).map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute bottom-0 rounded-t-full"
                                style={{
                                    width: 3,
                                    height: 15 + Math.random() * 20,
                                    background: `hsl(${110 + Math.random() * 20} ${40 + Math.random() * 20}% ${20 + Math.random() * 15}%)`,
                                    left: `${(i / 40) * 100}%`,
                                }}
                                animate={{ rotate: [-3, 3, -3] }}
                                transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}
                            />
                        ))}
                    </div>

                    {/* Golf ball animation */}
                    <div className="relative mb-8">
                        <motion.div
                            className="relative"
                            initial={{ y: -200, opacity: 0 }}
                            animate={
                                phase === "ball"
                                    ? { y: [-200, 0, -40, 0, -15, 0], opacity: 1 }
                                    : { y: 0, opacity: 1 }
                            }
                            transition={{ duration: 2, ease: "easeOut", times: [0, 0.4, 0.55, 0.7, 0.85, 1] }}
                        >
                            {/* Golf ball */}
                            <div className="relative w-16 h-16 mx-auto">
                                <div
                                    className="w-full h-full rounded-full"
                                    style={{
                                        background: "radial-gradient(circle at 35% 35%, #fff 0%, #e8e8e8 50%, #ccc 100%)",
                                        boxShadow: "0 4px 20px rgba(0,0,0,0.4), inset 0 -2px 6px rgba(0,0,0,0.1)",
                                    }}
                                >
                                    {/* Dimples */}
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="absolute w-2 h-2 rounded-full"
                                            style={{
                                                background: "radial-gradient(circle, rgba(0,0,0,0.05) 0%, transparent 70%)",
                                                top: `${20 + Math.sin(i * 0.8) * 25}%`,
                                                left: `${20 + Math.cos(i * 0.8) * 25}%`,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Golf hole below */}
                            <motion.div
                                className="mx-auto mt-2"
                                style={{
                                    width: 48,
                                    height: 12,
                                    borderRadius: "50%",
                                    background: "radial-gradient(ellipse, #000 60%, #0a1208 100%)",
                                    boxShadow: "0 0 10px rgba(0,0,0,0.5)",
                                }}
                                animate={{ scale: [0.8, 1, 0.8] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </motion.div>
                    </div>

                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: phase !== "ball" ? 1 : 0, y: phase !== "ball" ? 0 : 20 }}
                        transition={{ duration: 1 }}
                        className="text-center mb-6"
                    >
                        <h1 className="font-display text-4xl md:text-6xl font-bold tracking-wide text-foreground">
                            MayorWard
                        </h1>
                        <p className="font-display text-xl md:text-2xl text-muted-foreground tracking-[0.3em] mt-1">
                            SPORTS
                        </p>
                    </motion.div>

                    {/* Masters Week text with gold shimmer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: progress > 30 ? 1 : 0 }}
                        transition={{ duration: 1 }}
                        className="mb-10"
                    >
                        <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-[0.4em] gold-shimmer">
                            MASTERS WEEK
                        </h2>
                    </motion.div>

                    {/* Progress ring */}
                    <div className="relative w-20 h-20 mb-6">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                            <circle
                                cx="40" cy="40" r="34"
                                fill="none"
                                stroke="hsl(100 20% 15%)"
                                strokeWidth="3"
                            />
                            <circle
                                cx="40" cy="40" r="34"
                                fill="none"
                                stroke="hsl(45 70% 47%)"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 34}`}
                                strokeDashoffset={`${2 * Math.PI * 34 * (1 - progress / 100)}`}
                                style={{ transition: "stroke-dashoffset 0.1s linear" }}
                            />
                        </svg>
                        {/* Flag icon in center */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg width="18" height="24" viewBox="0 0 18 24" fill="none" className="text-gold">
                                <line x1="3" y1="2" x2="3" y2="22" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M3 2 L15 6 L3 10 Z" fill="currentColor" opacity="0.8" />
                            </svg>
                        </div>
                    </div>

                    <motion.p
                        className="font-mono text-sm text-muted-foreground"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        {Math.ceil((LOAD_DURATION - (progress / 100) * LOAD_DURATION) / 1000)}s
                    </motion.p>

                    {/* Skip button */}
                    <motion.button
                        onClick={handleSkip}
                        className="absolute bottom-6 right-6 text-xs font-body text-muted-foreground/50 hover:text-muted-foreground transition-colors border border-border/30 rounded-full px-4 py-1.5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: progress > 10 ? 1 : 0 }}
                        whileHover={{ scale: 1.05 }}
                    >
                        Skip →
                    </motion.button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}