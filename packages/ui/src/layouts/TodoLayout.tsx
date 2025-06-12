import React, { ReactNode } from "react";

export interface TodoLayoutProps {
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export const TodoLayout = ({
  header,
  children,
  footer,
  className = "",
}: TodoLayoutProps) => {
  return (
    <div className={`max-w-3xl mx-auto px-4 py-8 ${className}`}>
      {header && <header className="mb-6">{header}</header>}

      <main className="mb-8">{children}</main>

      {footer && (
        <footer className="text-center text-sm text-gray-500">{footer}</footer>
      )}
    </div>
  );
};
