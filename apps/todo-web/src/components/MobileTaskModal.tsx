"use client";

import { TaskInput } from "@repo/ui";
import { useEffect } from "react";

interface MobileTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (taskName: string, description?: string) => void;
}

export function MobileTaskModal({
  isOpen,
  onClose,
  onAddTask,
}: MobileTaskModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleAddTask = (taskName: string, description?: string) => {
    onAddTask(taskName, description);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-end justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white w-full max-w-md rounded-t-2xl shadow-xl transform transition-transform duration-300 ease-out">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-800">Add New Task</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 pb-8">
          <TaskInput
            onAddTask={handleAddTask}
            placeholder="Add a new task..."
            autoFocus={true}
          />
        </div>
      </div>
    </div>
  );
}
