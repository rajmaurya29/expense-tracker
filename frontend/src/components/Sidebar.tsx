import React from "react";
import { NavLink } from "react-router-dom";
import { MdDashboard, MdLogout, MdClose } from "react-icons/md";
import { BiMoney } from "react-icons/bi";
import { BsCurrencyDollar } from "react-icons/bs";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  headerHeight: number;
}

const SIDEBAR_WIDTH = 260;

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, headerHeight }) => {
  const user = { name: "Mike William", avatar: "https://i.pravatar.cc/80?img=3" };

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

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className="overlay"
        onClick={onClose}
        style={{
          position: "fixed",
          top: headerHeight,
          left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.15)",
          zIndex: 220,
          display: "none",
        }}
      />

      <aside
        className="sidebar"
        style={{
          position: "fixed",
          top: headerHeight,
          left: 0,
          width: SIDEBAR_WIDTH,
          height: `calc(100vh - ${headerHeight}px)`,
          background: "#fff",
          boxShadow: "2px 0 6px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 16,
          zIndex: 240,
          transition: "transform 0.3s ease",
          transform: "translateX(0)", // desktop default
        }}
      >
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Close sidebar"
          style={{
            alignSelf: "flex-end",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: 24,
            marginBottom: 8,
            display: "none",
          }}
        >
          <MdClose />
        </button>

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <img
            src={user.avatar}
            alt={user.name}
            style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", marginBottom: 8 }}
          />
          <div style={{ fontWeight: 600, color: "#222" }}>{user.name}</div>
        </div>

        <nav style={{ width: "100%" }}>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li style={{ margin: "10px 0" }}>
              <NavLink to="/dashboard" style={({isActive}) => ({...linkBase, background: isActive ? "#8b5cf6" : "transparent", color: isActive ? "#fff" : "#222"})}>
                <MdDashboard size={20} /> Dashboard
              </NavLink>
            </li>
            <li style={{ margin: "10px 0" }}>
              <NavLink to="/income" style={({isActive}) => ({...linkBase, background: isActive ? "#8b5cf6" : "transparent", color: isActive ? "#fff" : "#222"})}>
                <BiMoney size={20} /> Income
              </NavLink>
            </li>
            <li style={{ margin: "10px 0" }}>
              <NavLink to="/expense" style={({isActive}) => ({...linkBase, background: isActive ? "#8b5cf6" : "transparent", color: isActive ? "#fff" : "#222"})}>
                <BsCurrencyDollar size={20} /> Expense
              </NavLink>
            </li>
            <li style={{ margin: "10px 0" }}>
              <NavLink to="/logout" style={({isActive}) => ({...linkBase, background: isActive ? "#8b5cf6" : "transparent", color: isActive ? "#fff" : "#222"})}>
                <MdLogout size={20} /> Logout
              </NavLink>
            </li>
          </ul>
        </nav>

        <style>
          {`
            @media (max-width: 768px) {
              .sidebar { transform: ${isOpen ? "translateX(0)" : "translateX(-100%)"}; }
              .overlay { display: ${isOpen ? "block" : "none"}; }
              .close-btn { display: inline-flex; }
            }
            @media (min-width: 769px) {
              .sidebar { transform: translateX(0) !important; }
              .overlay, .close-btn { display: none !important; }
            }
          `}
        </style>
      </aside>
    </>
  );
};

export default Sidebar;
