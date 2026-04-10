import { useOutletContext } from "react-router-dom";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VIPGate({ children }) {
    const { isLoggedIn, onLoginClick, currentUser } = useOutletContext();
    const isVIP = Boolean(
        currentUser?.isVIP ||
        currentUser?.is_vip ||
        currentUser?.vip ||
        currentUser?.tier === "vip" ||
        currentUser?.role === "vip" ||
        currentUser?.role === "admin"
    );

    if (!isLoggedIn) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="w-20 h-20 rounded-full bg-surface-offset flex items-center justify-center mb-6">
                    <Lock className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="font-display text-3xl font-bold mb-2">VIP Access Required</h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                    This section is exclusive to MayorWard Sports VIP members. Sign in or request VIP access to unlock premium betting insights and analytics.
                </p>
                <div className="flex gap-3">
                    <Button onClick={onLoginClick} className="bg-primary hover:bg-primary/80">
                        <Lock className="h-4 w-4 mr-2" /> Sign In to Access
                    </Button>
                    <a href="/signup" className="inline-flex items-center rounded-md border border-gold/40 px-4 py-2 text-sm font-semibold text-gold hover:bg-gold/10">
                        VIP Sign Up
                    </a>
                </div>
            </div>
        );
    }

    if (!isVIP) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-green-100 dark:from-slate-900 dark:to-slate-800">
                <div className="max-w-md w-full p-8 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-100 dark:border-slate-800">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-green-800 dark:text-green-200 mb-4">VIP Access Required</h1>
                        <p className="text-slate-700 dark:text-slate-300 mb-6">
                            To unlock all elite features, donate via PayPal or Venmo, then submit VIP signup.
                        </p>
                        <div className="flex flex-col gap-4 mb-6">
                            <a href="https://paypal.me/njw2244" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition">
                                Donate with PayPal
                            </a>
                            <a href="https://venmo.com/mayorward" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition">
                                Donate with Venmo
                            </a>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                            After donating, email <span className="font-mono">nikolairays@gmail.com</span> with your username and screenshot to unlock VIP.
                        </p>
                        <a href="/signup" className="inline-block mt-4 px-5 py-2 bg-gold text-white rounded hover:bg-yellow-500 transition font-bold">
                            Go to VIP Signup
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return children;
}