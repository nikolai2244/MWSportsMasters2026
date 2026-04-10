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
import VIPGate from './VIPGate';

const AuthenticatedApp = () => {
    useAuth();

    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<VIPSignup />} />
                <Route path="/leaderboard" element={<VIPGate><Leaderboard /></VIPGate>} />
                <Route path="/about" element={<VIPGate><About /></VIPGate>} />
                <Route path="/bets" element={<VIPGate><MyBets /></VIPGate>} />
                <Route path="/finishes" element={<VIPGate><TournamentFinishes /></VIPGate>} />
                <Route path="/rounds" element={<VIPGate><RoundDetails /></VIPGate>} />
                <Route path="/admin" element={<VIPGate><AdminPanel /></VIPGate>} />
                <Route path="*" element={<PageNotFound />} />
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