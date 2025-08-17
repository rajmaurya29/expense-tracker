import React from "react";
import { MdMenu } from "react-icons/md";

interface HeaderProps {
  onMenuClick: () => void;
}

const HEADER_HEIGHT = 54;

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    const onMenuClick1=()=>{
        console.log("hamburger clicked");
    }
  return (
    <header
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        height: HEADER_HEIGHT,
        display: "flex",
        alignItems: "center",
        background: "#fff",
        borderBottom: "1px solid #eee",
        padding: "0 12px",
        zIndex: 300,
      }}
    >
      <button
        onClick={onMenuClick}
        className="hamburger"
        aria-label="Open sidebar"
        style={{
          background: "transparent",
          border: "none",
          color: "#222",
          width: 40, height: 40,
          fontSize: 26,
          display: "none",
          alignItems: "center", justifyContent: "center",
          cursor: "pointer",
          zIndex: 310,
          marginRight: 8,
        }}
      >
        <MdMenu />
      </button>

      <span style={{ fontWeight: 700, fontSize: "1.1rem", color: "#222" }}>
        Expense Tracker
      </span>

      <style>
        {`
          @media (max-width: 768px) {
            .hamburger { display: inline-flex !important; }
          }
        `}
      </style>
    </header>
  );
};

export default Header;
