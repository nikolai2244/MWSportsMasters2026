import { Outlet } from "react-router-dom";
import { useState } from "react";
import Navbar from "./navbar";
import LoginModal from "./loginmodal";
import LoadScreen from "./loadscreen";
import AnnouncementBanner from "./Announcementbanner";

const VIP_PROMO_TEXT = "Welcome to this rare exclusive access oppurtunity for Masters Weekend. 15$+ donation gets you full access to our picks. We are up over 30k since Septemeber on PGA picks! As this is just a beta run all i ask for donations of 15$ as anything helps run our models, site, etc Sign up now! (Side note: donations of 30$+ get a years worth of access to all our picks)";

export default function Layout() {
  const [showLoad, setShowLoad] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);

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
      <AnnouncementBanner text={VIP_PROMO_TEXT} />
      <Navbar
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        onLoginClick={() => setLoginOpen(true)}
        onLogout={handleLogout}
      />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} onLogin={handleLogin} />
      <main>
        <Outlet context={{ isLoggedIn, currentUser, onLoginClick: () => setLoginOpen(true) }} />
      </main>
    </div>
  );
}
