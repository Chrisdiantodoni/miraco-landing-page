import { useState, useEffect, useRef, ReactNode } from "react";

interface DropdownProps {
  // Trigger button content - bisa custom sesuai kebutuhan
  trigger: ReactNode;

  // Children - isi dropdown bisa apa aja (button, link, dll)
  children: ReactNode;

  // Position dropdown (opsional)
  position?: "left" | "right" | "center";

  // Custom styling (opsional)
  triggerClassName?: string;
  dropdownClassName?: string;
  triggerStyle?: React.CSSProperties;
  dropdownStyle?: React.CSSProperties;

  // Callback ketika dropdown dibuka/ditutup (opsional)
  onToggle?: (isOpen: boolean) => void;

  // Close on click inside? (default: true)
  closeOnClick?: boolean;
}

const Dropdown = ({
  trigger,
  children,
  position = "right",
  triggerClassName = "",
  dropdownClassName = "",
  triggerStyle = {},
  dropdownStyle = {},
  onToggle,
  closeOnClick = true,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState);
  };

  const closeDropdown = () => {
    setIsOpen(false);
    onToggle?.(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle click di dalam dropdown
  const handleDropdownClick = () => {
    if (closeOnClick) {
      closeDropdown();
    }
  };

  // Tentukan posisi dropdown
  const getPositionStyle = (): React.CSSProperties => {
    switch (position) {
      case "left":
        return { left: 0 };
      case "center":
        return { left: "50%", transform: "translateX(-50%)" };
      case "right":
      default:
        return { right: 0 };
    }
  };

  //   const defaultTriggerStyle: React.CSSProperties = {
  //     background: "none",
  //     border: "1px solid #ccc",
  //     padding: "8px 12px",
  //     borderRadius: "4px",
  //     cursor: "pointer",
  //     display: "flex",
  //     alignItems: "center",
  //     gap: "6px",
  //     fontSize: "14px",
  //     fontWeight: "500",
  //     ...triggerStyle,
  //   };

  const defaultDropdownStyle: React.CSSProperties = {
    position: "absolute",
    top: "100%",
    ...getPositionStyle(),
    background: "white",
    border: "1px solid #ccc",
    borderRadius: "4px",
    marginTop: "8px",
    width: "max-content",
    // minWidth: "140px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    zIndex: 1000,
    ...dropdownStyle,
  };

  return (
    <div
      ref={dropdownRef}
      style={{
        position: "relative",
        display: "inline-block",
      }}
    >
      {/* Trigger Button */}
      <button
        onClick={toggleDropdown}
        className={triggerClassName}
        // style={defaultTriggerStyle}
      >
        {trigger}
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div
          className={dropdownClassName}
          style={defaultDropdownStyle}
          onClick={handleDropdownClick}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default Dropdown;

// ============================================
// CONTOH PENGGUNAAN
// ============================================

// 1. Basic Dropdown dengan Button
/*
import Dropdown from "./Dropdown";

<Dropdown
  trigger={<span>☰ Menu</span>}
>
  <button onClick={() => console.log("Profile")}>Profile</button>
  <button onClick={() => console.log("Settings")}>Settings</button>
  <button onClick={() => console.log("Logout")}>Logout</button>
</Dropdown>
*/

// 2. Dropdown dengan Link (Next.js)
/*
import Link from "next/link";
import Dropdown from "./Dropdown";

<Dropdown
  trigger={
    <>
      <span>🌐</span>
      <span>Language</span>
    </>
  }
  position="right"
>
  <Link href="/en" style={{ display: "block", padding: "12px 16px" }}>
    🇺🇸 English
  </Link>
  <Link href="/id" style={{ display: "block", padding: "12px 16px" }}>
    🇮🇩 Indonesia
  </Link>
  <Link href="/zh" style={{ display: "block", padding: "12px 16px" }}>
    🇨🇳 Chinese
  </Link>
</Dropdown>
*/

// 3. Dropdown dengan Custom Styling
/*
<Dropdown
  trigger={<span>👤 Account</span>}
  position="left"
  triggerStyle={{
    background: "#007bff",
    color: "white",
    border: "none",
  }}
  dropdownStyle={{
    minWidth: "200px",
    background: "#f8f9fa",
  }}
  closeOnClick={false}
>
  <div style={{ padding: "16px" }}>
    <h4>User Profile</h4>
    <p>email@example.com</p>
    <button>Edit Profile</button>
  </div>
</Dropdown>
*/

// 4. Dropdown dengan Mixed Content (button + link + custom)
/*
<Dropdown
  trigger={<span>⚙️ Options</span>}
  onToggle={(isOpen) => console.log("Dropdown is", isOpen ? "open" : "closed")}
>
  <button style={{ width: "100%", padding: "12px", textAlign: "left" }}>
    Action 1
  </button>
  <a href="/somewhere" style={{ display: "block", padding: "12px" }}>
    Go Somewhere
  </a>
  <div style={{ padding: "12px", background: "#f0f0f0" }}>
    Custom Content Here
  </div>
  <button style={{ width: "100%", padding: "12px", textAlign: "left" }}>
    🐈 Taik Kucing
  </button>
</Dropdown>
*/
