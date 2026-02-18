import React, { useState, useEffect, useRef } from "react";
import { MdMenu, MdDarkMode } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { toggleSidebar } from "../redux/slices/SidebarSlice";
import { setCustomRange, setFilterLabel } from "../redux/slices/filterSlice";


const Header: React.FC<{ toggleTheme: () => void }> = ({ toggleTheme }) => {
  const dispatch = useDispatch<AppDispatch>();
  const userInfo = useSelector((state: RootState) => state.userInfo.userInfo);
  const isAuthenticated = !!userInfo;

  const [open, setOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [label, setLabel] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const panelRef = useRef<HTMLDivElement>(null);
  const customRef = useRef<HTMLDivElement>(null);

  // outside click close logic
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Close custom dialog
      if (customOpen && customRef.current && !customRef.current.contains(target)) {
        if (!fromDate && !toDate) setLabel("All");
        setCustomOpen(false);
      }

      // Close dropdown
      if (open && panelRef.current && !panelRef.current.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [customOpen, open, fromDate, toDate]);

  const handleSelect = (value: string) => {
    dispatch(setFilterLabel(value));
    setLabel(value);
    setOpen(false);
    
    if (value === "Custom Range") setCustomOpen(true);
    else{ setCustomOpen(false);
      // dispatch(totalAmount());
      // dispatch(dashboardIncomes());
    }
  };

  const applyCustomRange = () => {
    if (!fromDate || !toDate) return;

    setLabel(`Custom: ${fromDate} → ${toDate}`);

    setCustomOpen(false);
    // dispatch(totalAmount());
    
    dispatch(setCustomRange({from:fromDate,to:toDate}));
    // dispatch(dashboardIncomes());
  };

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
        justifyContent: "space-between",
        background: "var(--header-bg)",
        borderBottom: "1px solid var(--header-border)",
        padding: "0 20px",
        zIndex: 300,
      }}
    >
      {/* LEFT SIDE: Menu + Title */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {isAuthenticated && (
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="hamburger-btn"
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-color)",
              width: 40,
              height: 40,
              fontSize: 26,
              display: "none",
              cursor: "pointer",
            }}
          >
            <MdMenu />
          </button>
        )}

        <span
          style={{
            fontWeight: 600,
            fontSize: "1.35rem",
            color: "var(--text-color)",
          }}
        >
          Expense Tracker
        </span>
      </div>

      {/* RIGHT SIDE: Date Filter */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginRight:"20px"
        }}
      >
        <button
          onClick={toggleTheme}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-color)",
            width: 40,
            height: 40,
            fontSize: 26,
            cursor: "pointer",
          }}
        >
          <MdDarkMode />
        </button>
        {isAuthenticated && (
          <>
            <span style={{ fontSize: 14, color: "var(--text-color)" }}>Date:</span>

            <button
              onClick={() => setOpen(!open)}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                border: "1px solid #ccc",
                background: "#fafafa",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              {label} ▼
            </button>
          </>
        )}

        {/* DROPDOWN */}
        {isAuthenticated && open && (
          <div
            ref={panelRef}
            style={{
              position: "absolute",
              right: 0,
              top: 42,
              width: 170,
              background: "var(--card-bg)",
              borderRadius: 8,
              boxShadow: "0px 2px 10px rgba(0,0,0,0.12)",
              padding: "6px 0",
              zIndex: 350,
            }}
          >
            {["All", "Last Month", "Last 3 Months", "Custom Range"].map((opt) => (
              <div
                key={opt}
                onClick={() => handleSelect(opt)}
                style={{
                  padding: "8px 14px",
                  cursor: "pointer",
                  fontSize: 14,
                  color: "var(--text-color)"
                }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.background = "#f2f2f2")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.background = "var(--card-bg)")}
              >
                {opt}
              </div>
            ))}
          </div>
        )}

        {/* CUSTOM RANGE POPUP */}
        {isAuthenticated && customOpen && (
          <div
            ref={customRef}
            style={{
              position: "absolute",
              right: 0,
              top: 42,
              width: 240,
              background: "var(--card-bg)",
              borderRadius: 10,
              boxShadow: "0px 2px 14px rgba(0,0,0,0.15)",
              padding: "14px",
              zIndex: 360,
            }}
          >
            <div style={{ marginBottom: 10, fontSize: 15, fontWeight: 600, color: "var(--text-color)" }}>
              Select Custom Range
            </div>

            <label style={{ fontSize: 13, color: "var(--text-color)" }}>From</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              style={{
                width: "100%",
                padding: "6px 8px",
                marginBottom: 12,
                borderRadius: 6,
                border: "1px solid #ccc",
                fontSize: 14,
              }}
            />

            <label style={{ fontSize: 13, color: "var(--text-color)" }}>To</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              style={{
                width: "100%",
                padding: "6px 8px",
                marginBottom: 14,
                borderRadius: 6,
                border: "1px solid #ccc",
                fontSize: 14,
              }}
            />

            <button
              onClick={applyCustomRange}
              style={{
                width: "100%",
                padding: "8px",
                background: "#4b38f5",
                color: "#fff",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Apply
            </button>
          </div>
        )}
      </div>

      <style>
        {`
          @media (max-width: 768px) {
            .hamburger-btn {
              display: inline-flex !important;
            }

            header {
              padding: 0 14px;
            }
          }
            /* RESPONSIVE: shorten date label on small screens */
          @media (max-width: 480px) {
            button[style*="padding: 6px 12px"] {
              max-width: 110px;            /* restrict width */
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }

        `}
      </style>
    </header>
  );
};

export default Header;
//redeploy