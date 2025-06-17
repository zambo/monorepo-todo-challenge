import { InputHTMLAttributes, forwardRef, useId, useState } from "react";
import { cn } from "@repo/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  wrapper?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", error, label, id, wrapper = true, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const generatedId = useId();
    const inputId = id || generatedId;

    const inputElement = (
      <input
        ref={ref}
        id={inputId}
        className={cn(
          "w-full px-4 py-3 text-sm",
          wrapper
            ? cn(
                "bg-transparent focus:outline-none",
                "text-gray-900 placeholder-gray-500",
              )
            : cn(
                "border rounded-lg bg-white",
                "text-gray-900 placeholder-gray-500",
                "focus:outline-none focus:ring-2 focus:ring-teal-500",
                error
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-teal-500",
              ),
          className,
        )}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        {...props}
      />
    );

    if (!wrapper) {
      return (
        <div className="w-full">
          {label && (
            <label
              htmlFor={inputId}
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {label}
            </label>
          )}
          {inputElement}
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
      );
    }

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
          </label>
        )}

        {/* Input Wrapper with Focus Ring */}
        <div
          className={cn(
            "relative rounded-lg border-2 transition-all duration-200 bg-white",
            isFocused
              ? "border-teal-500 ring-4 ring-teal-100"
              : "border-gray-200 hover:border-gray-300",
            error && "border-red-500 ring-4 ring-red-100",
          )}
        >
          {inputElement}

          {/* Focus Background */}
          {isFocused && (
            <div className="absolute inset-0 rounded-lg pointer-events-none">
              <div className="absolute inset-0 rounded-lg bg-teal-500/5" />
            </div>
          )}
        </div>

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
