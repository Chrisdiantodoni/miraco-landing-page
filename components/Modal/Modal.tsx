import React from "react";

const modalStyles = {
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

const closeStyles = {
  position: "absolute",
  top: 20,
  right: 30,
  color: "#fff",
  fontSize: "2rem",
  cursor: "pointer",
};

const modalContentStyles = {
  maxWidth: "90%",
  maxHeight: "90%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const ModalContent = ({ onClose, children }) => {
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
