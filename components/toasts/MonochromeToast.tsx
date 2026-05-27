// File: components/MonochromeToast.tsx

import React from "react";

interface MonochromeToastProps {
  message: string;
  type: "success" | "error" | "info";
}

const MonochromeToast: React.FC<MonochromeToastProps> = ({ message, type }) => {
  const isError = type === "error";

  const style = {
    backgroundColor: isError ? "black" : "white",
    color: isError ? "white" : "black",
    border: isError ? "none" : "1px solid #ccc",
    padding: "12px 16px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    fontWeight: "500",
  };

  const Icon = isError ? "❌" : "✅"; // Simbol monokrom sederhana

  return (
    <div style={style}>
      <span style={{ marginRight: "10px" }}>{Icon}</span>
      <span>{message}</span>
    </div>
  );
};

export default MonochromeToast;
