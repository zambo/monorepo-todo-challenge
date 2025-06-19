import { cn } from "@repo/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "destructive";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      icon,
      iconPosition = "left",
      className = "",
      children,
      ...props
    },
    ref,
  ) => {
    const baseClasses = cn(
      "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200",
      "focus:outline-none focus:ring-2 focus:ring-offset-2",
      "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
    );

    const variantClasses = {
      primary: cn(
        "bg-teal-500 text-white hover:bg-teal-600 active:bg-teal-700",
        "focus:ring-teal-500",
      ),
      secondary: cn(
        "bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300",
        "focus:ring-gray-500",
      ),
      ghost: cn(
        "text-gray-700 hover:bg-gray-100 active:bg-gray-200",
        "focus:ring-gray-500",
      ),
      outline: cn(
        "border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100",
        "focus:ring-gray-500",
      ),
      destructive: cn(
        "bg-red-500 text-white hover:bg-red-600 active:bg-red-700",
        "focus:ring-red-500",
      ),
    };

    const sizeClasses = {
      sm: "h-8 px-3 text-sm gap-1.5",
      md: "h-10 px-4 text-sm gap-2",
      lg: "h-12 px-6 text-base gap-2",
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {icon && iconPosition === "left" && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        {children && <span>{children}</span>}
        {icon && iconPosition === "right" && (
          <span className="flex-shrink-0">{icon}</span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
