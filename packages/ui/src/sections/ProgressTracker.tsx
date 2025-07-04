"use client";

import {
  getProgressColor,
  getProgressLabel,
  PROGRESS_COLORS,
} from "@repo/shared";
import type { ProgressData } from "@repo/shared";
import { cn } from "@repo/utils";
import { Target, CheckCircle2, Clock, Trophy } from "lucide-react";
import React from "react";

interface ProgressTrackerProps {
  progress: ProgressData;
  className?: string;
  showDetails?: boolean;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  progress,
  className,
  showDetails = true,
}) => {
  const { completed, total, percentage } = progress;
  const progressColor = getProgressColor(percentage);
  const progressLabel = getProgressLabel(percentage);

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className={cn(
              "text-lg font-semibold",
              PROGRESS_COLORS.text.primary,
            )}
          >
            Progress Tracker
          </h2>
          <p className={cn("text-sm", PROGRESS_COLORS.text.secondary)}>
            {progressLabel}
          </p>
        </div>
        <div className="text-right">
          <div
            className={cn("text-2xl font-bold", PROGRESS_COLORS.text.primary)}
          >
            {percentage}%
          </div>
          {showDetails && (
            <div className={cn("text-sm", PROGRESS_COLORS.text.secondary)}>
              {completed} of {total} tasks
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div
          className={cn(
            "w-full h-3 rounded-full overflow-hidden",
            PROGRESS_COLORS.container,
          )}
        >
          <div
            className={cn(
              "h-full transition-all duration-500 ease-out rounded-full",
              progressColor,
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Progress indicator dot */}
        {percentage > 0 && (
          <div
            className={cn(
              "absolute top-1/2 w-4 h-4 rounded-full border-2 border-white",
              "transform -translate-y-1/2 transition-all duration-500 ease-out shadow-sm",
              progressColor,
            )}
            style={{ left: `calc(${percentage}% - 8px)` }}
          />
        )}
      </div>

      {/* Detailed Stats */}
      {showDetails && total > 0 && (
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-lg font-semibold text-teal-600">
              <CheckCircle2 className="w-4 h-4" />
              {completed}
            </div>
            <div className={cn("text-xs", PROGRESS_COLORS.text.secondary)}>
              Completed
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-lg font-semibold text-orange-500">
              <Clock className="w-4 h-4" />
              {total - completed}
            </div>
            <div className={cn("text-xs", PROGRESS_COLORS.text.secondary)}>
              Remaining
            </div>
          </div>
          <div className="text-center">
            <div
              className={cn(
                "flex items-center justify-center gap-1 text-lg font-semibold",
                PROGRESS_COLORS.text.primary,
              )}
            >
              <Target className="w-4 h-4" />
              {total}
            </div>
            <div className={cn("text-xs", PROGRESS_COLORS.text.secondary)}>
              Total
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {total === 0 && (
        <div className="text-center py-6">
          <div className="flex justify-center mb-2">
            <Trophy className="w-8 h-8 text-teal-400" />
          </div>
          <p className={cn("text-sm", PROGRESS_COLORS.text.secondary)}>
            Add your first task to start tracking progress!
          </p>
        </div>
      )}
    </div>
  );
};
