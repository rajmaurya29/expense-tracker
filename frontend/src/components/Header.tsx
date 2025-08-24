import React from "react";
import { MdMenu } from "react-icons/md";
import {  useDispatch } from "react-redux";
import type { AppDispatch } from "../redux/store";
import { toggleSidebar } from "../redux/slices/SidebarSlice"

export interface HeaderProps {
  
  headerHeight?: number;
}

const Header: React.FC<HeaderProps> = ({  headerHeight = 190 }) => {
    const dispatch=useDispatch<AppDispatch>();
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 55,
        display: "flex",
        alignItems: "center",
        background: "#fff",
        borderBottom: "1px solid #eee",
        padding: "0 12px",
        zIndex: 300,
      }}
    >
      <button
        onClick={()=>dispatch(toggleSidebar())}
        className="hamburger-btn"
        aria-label="Toggle sidebar"
        style={{
          background: "transparent",
          border: "none",
          color: "#222",
          width: 40,
          height: 40,
          fontSize: 26,
          display: "none", // hidden on desktop
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 310, // above overlay
          marginRight: 8,
        }}
      >
        <MdMenu />
      </button>

      <span style={{ fontWeight: 600, fontSize: "1.35rem", color: "#222",marginLeft:30 }}>
        Expense Tracker
      </span>

      <style>
        {`
          @media (max-width: 768px) {
            .hamburger-btn { display: inline-flex !important; }
          }
        `}
      </style>
    </header>
  );
};

export default Header;
