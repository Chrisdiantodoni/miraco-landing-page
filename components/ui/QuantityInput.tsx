"use client";

import { useState, useEffect, useCallback } from "react";
import { Minus, Plus } from "lucide-react";

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  size?: "sm" | "md";
}

export default function QuantityInput({
  value,
  onChange,
  size = "md",
}: QuantityInputProps) {
  const [localValue, setLocalValue] = useState(String(value));

  useEffect(() => {
    setLocalValue(String(value));
  }, [value]);

  const commit = useCallback(() => {
    const num = parseInt(localValue, 10);
    const clamped = !isNaN(num) && num >= 1 ? num : 1;
    onChange(clamped);
    setLocalValue(String(clamped));
  }, [localValue, onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur();
    }
  };

  const dec = () => {
    if (value > 1) onChange(value - 1);
  };

  const inc = () => {
    onChange(value + 1);
  };

  const iconSize = size === "sm" ? 12 : 14;

  return (
    <div className={`qty-input qty-input--${size}`}>
      <button
        type="button"
        className="qty-input-btn"
        onClick={dec}
        aria-label="Decrease"
      >
        <Minus size={iconSize} />
      </button>
      <input
        type="number"
        className="qty-input-field"
        min={1}
        value={localValue}
        onChange={handleChange}
        onBlur={commit}
        onKeyDown={handleKeyDown}
      />
      <button
        type="button"
        className="qty-input-btn"
        onClick={inc}
        aria-label="Increase"
      >
        <Plus size={iconSize} />
      </button>
    </div>
  );
}
