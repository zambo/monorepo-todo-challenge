"use client";

import { cn } from "@repo/utils";
import React, { useState, useEffect } from "react";

export interface DateHeaderProps {
  date?: Date;
  className?: string;
  showDayName?: boolean;
  variant?: "default" | "compact";
}

export const DateHeader: React.FC<DateHeaderProps> = ({
  date,
  className,
  showDayName = true,
  variant = "default",
}) => {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  // Set the date on client side to avoid hydration issues
  useEffect(() => {
    setCurrentDate(date || new Date());
  }, [date]);

  // Show loading state during hydration
  if (!currentDate) {
    return (
      <div className={cn("flex items-center justify-between", className)}>
        <div>
          <div className="text-4xl font-light text-gray-800 leading-none">
            --
          </div>
          <div className="text-xs font-medium text-gray-500 mt-1">--- ----</div>
        </div>
        {showDayName && (
          <div className="text-sm font-medium text-gray-600 tracking-wide">
            -------
          </div>
        )}
      </div>
    );
  }

  const day = currentDate.getDate();
  const month = currentDate
    .toLocaleDateString("en", { month: "short" })
    .toUpperCase();
  const year = currentDate.getFullYear();
  const dayName = currentDate
    .toLocaleDateString("en", { weekday: "long" })
    .toUpperCase();

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-light text-gray-800">{day}</span>
          <span className="text-xs font-medium text-gray-500">
            {month} {year}
          </span>
        </div>
        {showDayName && (
          <span className="text-xs font-medium text-gray-600 tracking-wide">
            {dayName}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div>
        <div className="text-4xl font-light text-gray-800 leading-none">
          {day}
        </div>
        <div className="text-xs font-medium text-gray-500 mt-1">
          {month} {year}
        </div>
      </div>
      {showDayName && (
        <div className="text-sm font-medium text-gray-600 tracking-wide">
          {dayName}
        </div>
      )}
    </div>
  );
};
