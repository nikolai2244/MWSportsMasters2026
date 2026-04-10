import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Layout from './components/Layout';
import Home from './pages/Home';
import Leaderboard from './pages/Leaderboard';
import About from './pages/About';
import VIPSignup from './pages/VIPSignup';
import MyBets from './pages/MyBets';
import TournamentFinishes from './pages/TournamentFinishes';
import RoundDetails from './pages/RoundDetails';
import AdminPanel from './pages/AdminPanel';
import LoadScreen from './loadscreen';


// Simulate VIP status (replace with real logic as needed)
function useVIPStatus() {
    // Replace with real VIP check (e.g., from backend or context) if needed
  const [isVIP, setIsVIP] = useState(false);
  return { isVIP, setIsVIP };
}

const AuthenticatedApp = () => {
    const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
    const { isVIP } = useVIPStatus();

    // Only allow Home page if not VIP
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                {!isVIP ? (
                    <Route path="*" element={<VIPGate />} />
                ) : (
                    <>
                        <Route path="/leaderboard" element={<Leaderboard />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/signup" element={<VIPSignup />} />
                        <Route path="/bets" element={<MyBets />} />
                        <Route path="/finishes" element={<TournamentFinishes />} />
                        <Route path="/rounds" element={<RoundDetails />} />
                        <Route path="/admin" element={<AdminPanel />} />
                        <Route path="*" element={<PageNotFound />} />
                    </>
                )}
            </Route>
        </Routes>
    );
};



function App() {
    const [showLoader, setShowLoader] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShowLoader(false), 25000);
        return () => clearTimeout(timer);
    }, []);

    if (showLoader) {
        return <LoadScreen onComplete={() => setShowLoader(false)} />;
    }

    return (
        <AuthProvider>
            <QueryClientProvider client={queryClientInstance}>
                <Router>
                    <AuthenticatedApp />
                </Router>
                <Toaster />
            </QueryClientProvider>
        </AuthProvider>
    );
}

export default App