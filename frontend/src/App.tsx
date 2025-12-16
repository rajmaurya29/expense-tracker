import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "./redux/store";
import { closeSidebar } from "./redux/slices/SidebarSlice"
import LoginScreen from './screens/LoginScreen'
import SignUpScreen from './screens/SignUpScreen'
import LogoutScreen from "./screens/LogoutScreen";
import IncomeScreen from "./screens/IncomeScreen";
import ExpenseScreen from "./screens/ExpenseScreen";
import DashboardScreen from "./screens/DashboardScreen";
import { fetchUser } from "./redux/slices/UserSlice";
import { useTheme } from "./hooks/useTheme";

const HEADER_HEIGHT = 54;
const SIDEBAR_WIDTH = 260;

const Shell: React.FC = () => {

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 769);
  const [loader,setLoader]=useState(false);
  const location = useLocation();
  const dispatch=useDispatch<AppDispatch>();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
  const loadUser = async () => {
    try {
      setLoader(true);
      await dispatch(fetchUser());  // wait until fetchUser finishes
    } catch (e) {
      console.error("Error fetching user:", e);
    } finally {
      setLoader(false);
    }
  };

  loadUser();
}, [dispatch]);

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 769);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Close sidebar on route change (mobile only)
  useEffect(() => {
    dispatch(closeSidebar());
  }, [location.pathname,dispatch]);

  return (
    <>
      {
        loader ? (
          <div className="loader-container">
           <div className="loader">
             <div></div><div></div><div></div><div></div><div></div>
           </div>
          </div>

  ) :
        (
        <>  
      <Header toggleTheme={toggleTheme} />
      <Sidebar
        
        headerHeight={HEADER_HEIGHT}
        sidebarWidth={SIDEBAR_WIDTH}
      />

      <main
        style={{
          marginTop: HEADER_HEIGHT,
          marginLeft: isDesktop ? SIDEBAR_WIDTH : 0,
          padding: "16px",
          minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
          background: "var(--background-color)",
          transition: "margin 0.2s ease",
        }}
      >
        <Routes>
          <Route path="/" element={<DashboardScreen/>} />

          <Route path="/login" element={<LoginScreen/>} />
          <Route path="/logout" element={<LogoutScreen/>} />
          <Route path="/income" element={<IncomeScreen/>} />
          <Route path="/expense" element={<ExpenseScreen/>} />

          <Route path="/signup" element={<SignUpScreen/>} />

          
          <Route path="*" element={<h2>Not Found</h2>} />
        </Routes>
      </main>

        </>)
      }
    </>
  );
};

const App: React.FC = () => (
  <BrowserRouter>
    <Shell />
  </BrowserRouter>
);

export default App;
