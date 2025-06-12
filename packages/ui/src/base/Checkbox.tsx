import { InputHTMLAttributes, forwardRef } from "react";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = "", label, id, ...props }, ref) => {
    const checkboxId =
      id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="flex items-center">
        <input
          ref={ref}
          id={checkboxId}
          type="checkbox"
          className={`
            h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500
            ${className}
          `}
          {...props}
        />
        {label && (
          <label
            htmlFor={checkboxId}
            className="ml-2 block text-sm text-gray-700"
          >
            {label}
          </label>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
