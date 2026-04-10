import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
// import { base44 } from "@/api/base44Client";
import Navbar from "./navbar";
import LoginModal from "./loginmodal";
import LoadScreen from "./loadscreen";
import AnnouncementBanner from "./Announcementbanner";

export default function Layout() {
    const [showLoad, setShowLoad] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [loginOpen, setLoginOpen] = useState(false);
    const [announcement, setAnnouncement] = useState(null);

    useEffect(() => {
        // Fetch announcement from backend if needed
        // Example:
        // fetch('/api/announcement').then(res => res.json()).then(data => setAnnouncement(data[0]));
    }, []);

    const handleLogin = (user) => {
        setCurrentUser(user);
        setIsLoggedIn(true);
        setLoginOpen(false);
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setIsLoggedIn(false);
    };

    if (showLoad) {
        return <LoadScreen onComplete={() => setShowLoad(false)} />;
    }

    return (
        <div className="min-h-screen bg-background">
            {announcement && <AnnouncementBanner text={announcement.text} />}
            <Navbar
                isLoggedIn={isLoggedIn}
                currentUser={currentUser}
                onLoginClick={() => setLoginOpen(true)}
                onLogout={handleLogout}
            />
            <LoginModal
                open={loginOpen}
                onClose={() => setLoginOpen(false)}
                onLogin={handleLogin}
            />
            <main>
                <Outlet context={{ isLoggedIn, currentUser, onLoginClick: () => setLoginOpen(true) }} />
            </main>
        </div>
    );
