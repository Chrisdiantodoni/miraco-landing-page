/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

const modalStyles: React.CSSProperties = {
  position: "fixed",
  zIndex: 1000,
  left: 0,
  top: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const closeStyles: React.CSSProperties = {
  position: "absolute",
  top: "20px",
  right: "30px",
  color: "#fff",
  fontSize: "2rem",
  cursor: "pointer",
};

const modalContentStyles: React.CSSProperties = {
  maxWidth: "90%",
  maxHeight: "90%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

interface ModalContentProps {
  onClose: () => void;
  children: React.ReactNode;
}

export const ModalContent = ({ onClose, children }: ModalContentProps) => {
  return (
    <div style={modalStyles} onClick={onClose}>
      <span style={closeStyles} onClick={onClose}>
        &times;
      </span>
      <div style={modalContentStyles} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};
