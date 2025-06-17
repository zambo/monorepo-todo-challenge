"use client";

import { cn } from "@repo/utils";
import React from "react";

interface ActionButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  variant?: "edit" | "delete" | "save" | "cancel";
  size?: "sm" | "md";
  className?: string;
}

const variantStyles = {
  edit: "text-teal-600 hover:text-teal-800 hover:bg-teal-50",
  delete: "text-red-600 hover:text-red-800 hover:bg-red-50",
  save: "text-green-600 hover:text-green-800 hover:bg-green-50",
  cancel: "text-gray-600 hover:text-gray-800 hover:bg-gray-50",
};

const sizeStyles = {
  sm: "w-6 h-6 p-1",
  md: "w-8 h-8 p-1.5",
};

export const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  icon,
  label,
  variant = "edit",
  size = "sm",
  className,
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center rounded-md transition-colors duration-200",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      title={label}
      aria-label={label}
    >
      {icon}
    </button>
  );
};
