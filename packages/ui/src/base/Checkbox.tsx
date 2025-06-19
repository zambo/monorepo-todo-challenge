import { cn } from "@repo/utils";
import { InputHTMLAttributes, forwardRef, useId } from "react";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = "", label, id, checked, onChange, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;

    return (
      <div className="flex items-center">
        <div className="relative">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="sr-only"
            {...props}
          />
          <div
            className={cn(
              "w-4 h-4 rounded-full border-2 transition-all duration-200 cursor-pointer",
              "flex items-center justify-center",
              checked
                ? "bg-teal-500 border-teal-500"
                : "border-gray-300 hover:border-teal-400",
              className,
            )}
            onClick={() =>
              onChange?.({
                target: { checked: !checked },
              } as React.ChangeEvent<HTMLInputElement>)
            }
          >
            {checked && (
              <svg
                className="w-2.5 h-2.5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
        </div>
        {label && (
          <label
            htmlFor={checkboxId}
            className="ml-2 block text-sm text-gray-700 cursor-pointer"
          >
            {label}
          </label>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
