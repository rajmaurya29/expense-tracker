import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

const HEADER_HEIGHT = 54;
const SIDEBAR_WIDTH = 260;

const Shell: React.FC = () => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 769);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Resize listener
  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 769);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Close sidebar on route change (mobile only)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => setSidebarOpen((s) => !s);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      <Header onMenuToggle={toggleSidebar} headerHeight={HEADER_HEIGHT} />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        headerHeight={HEADER_HEIGHT}
        sidebarWidth={SIDEBAR_WIDTH}
      />

      <main
        style={{
          marginTop: HEADER_HEIGHT,
          marginLeft: isDesktop ? SIDEBAR_WIDTH : 0,
          padding: "16px",
          minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
          background: "#fafafc",
          transition: "margin 0.2s ease",
        }}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<h2>Dashboard</h2>} />
          <Route path="/income" element={<h2>Income</h2>} />
          <Route path="/expense" element={<h2>Expense</h2>} />
          <Route path="/logout" element={<h2>Logout</h2>} />
          <Route path="*" element={<h2>Not Found</h2>} />
        </Routes>
      </main>
    </>
  );
};

const App: React.FC = () => (
  <BrowserRouter>
    <Shell />
  </BrowserRouter>
);

export default App;
