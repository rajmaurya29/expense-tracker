import React from "react";
import { NavLink } from "react-router-dom";
import { MdDashboard, MdLogout, MdClose } from "react-icons/md";
import { BiMoney } from "react-icons/bi";
import { BsCurrencyDollar } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import type { RootState,AppDispatch } from "../redux/store";
import { closeSidebar } from "../redux/slices/SidebarSlice";

export interface SidebarProps {
  // isOpen: boolean;
  // onClose: () => void;
  headerHeight?: number;
  sidebarWidth?: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  // isOpen,
  // onClose,
  headerHeight = 54,
  sidebarWidth = 260,
}) => {
  const isOpen=useSelector((state:RootState)=>state.toggleSidbar.isOpen);
  const dispatch=useDispatch<AppDispatch>();

  const linkBase: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    textDecoration: "none",
    fontWeight: 500,
    fontSize: "1rem",
    padding: "10px 14px",
    borderRadius: 8,
    color: "#222",
  };
const userName = useSelector((state: RootState) => state.userInfo?.userInfo?.name);
  const user = { name: userName, avatar: "https://i.pravatar.cc/80?img=3" };

  return (
    <>
      {/* Overlay (mobile only) */}
      <div
        onClick={()=>dispatch(closeSidebar())}
        style={{
          position: "fixed",
          top: headerHeight,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.15)",
          zIndex: 220,
          display: isOpen ? "block" : "none",
        }}
      />

      <aside
        style={{
          position: "fixed",
          top: headerHeight,
          left: 0,
          width: sidebarWidth,
          height: `calc(100vh - ${headerHeight}px)`,
          background: "#fff",
          boxShadow: "2px 0 6px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 16,
          zIndex: 240,
          transition: "transform 0.3s ease",
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          willChange: "transform",
        }}
      >
        {/* Close button (mobile only) */}
        <button
          onClick={()=>dispatch(closeSidebar())}
          aria-label="Close sidebar"
          style={{
            alignSelf: "flex-end",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: 24,
            marginBottom: 8,
            display: "none", // hidden on desktop
          }}
          className="drawer-close-btn"
        >
          <MdClose />
        </button>

        {/* User */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <img
            src={user.avatar}
            alt={user.name}
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: 8,
            }}
          />
          <div style={{ fontWeight: 600, color: "#222" }}>{user.name}</div>
        </div>

        {/* Nav */}
        <nav style={{ width: "100%" }}>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li style={{ margin: "10px 0" }}>
              <NavLink
                to="/"
                style={({ isActive }) => ({
                  ...linkBase,
                  background: isActive ? "#8b5cf6" : "transparent",
                  color: isActive ? "#fff" : "#222",
                })}
              >
                <MdDashboard size={20} /> Dashboard
              </NavLink>
            </li>
            <li style={{ margin: "10px 0" }}>
              <NavLink
                to="/income"
                style={({ isActive }) => ({
                  ...linkBase,
                  background: isActive ? "#8b5cf6" : "transparent",
                  color: isActive ? "#fff" : "#222",
                })}
              >
                <BiMoney size={20} /> Income
              </NavLink>
            </li>
            <li style={{ margin: "10px 0" }}>
              <NavLink
                to="/expense"
                style={({ isActive }) => ({
                  ...linkBase,
                  background: isActive ? "#8b5cf6" : "transparent",
                  color: isActive ? "#fff" : "#222",
                })}
              >
                <BsCurrencyDollar size={20} /> Expense
              </NavLink>
            </li>
            <li style={{ margin: "10px 0" }}>
              <NavLink
                to="/logout"
                style={({ isActive }) => ({
                  ...linkBase,
                  background: isActive ? "#8b5cf6" : "transparent",
                  color: isActive ? "#fff" : "#222",
                })}
              >
                <MdLogout size={20} /> Logout
              </NavLink>
            </li>
          </ul>
        </nav>

        <style>
          {`
            @media (max-width: 768px) {
              .drawer-close-btn { display: inline-flex !important; }
            }
            @media (min-width: 769px) {
              aside { transform: translateX(0) !important; }
            }
          `}
        </style>
      </aside>
    </>
  );
};

export default Sidebar;
