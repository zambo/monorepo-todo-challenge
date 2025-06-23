"use client";

import {
  useTasks,
  useFilter,
  useAddTask,
  useToggleTask,
  useDeleteTask,
  useEditTask,
  useClearCompleted,
  useSetFilter,
  useGetProgress,
} from "@repo/stores";
import {
  TaskInput,
  DateHeader,
  ProgressTracker,
  TaskList,
  MobileTaskModal,
} from "@repo/ui";
import { cn } from "@repo/utils";
import { useState, useEffect } from "react";

import { useMobileDetection } from "../hooks/useMobileDetection";

export default function Home() {
  // Store hooks
  const tasks = useTasks();
  const filter = useFilter();
  const addTask = useAddTask();
  const toggleTask = useToggleTask();
  const deleteTask = useDeleteTask();
  const editTask = useEditTask();
  const clearCompleted = useClearCompleted();
  const setFilter = useSetFilter();
  const getProgress = useGetProgress();

  // UI state
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const isMobile = useMobileDetection({ breakpoint: 768 });

  // Set hydrated state to prevent hydration mismatch
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Get progress data
  const progress = getProgress();

  const handleAddTask = (taskName: string, description?: string) => {
    addTask(taskName, description);
    setShowMobileModal(false);
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="group bg-white rounded-2xl shadow-lg w-full max-w-md overflow-hidden">
          <div className="px-6 py-6 border-b border-gray-100">
            <DateHeader />
          </div>
          <div className="px-6 py-4 text-center">
            <div className="text-4xl mb-4">📝</div>
            <div className="text-gray-400 text-sm">Loading tasks...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Main Card */}
      <div className="group bg-white rounded-2xl shadow-lg w-full max-w-md overflow-hidden focus-within:ring-4 focus-within:ring-teal-100 transition-all duration-200">
        {/* Date Header */}
        <div className="px-6 py-6 border-b border-gray-100">
          <DateHeader />
        </div>

        {/* Progress Tracker */}
        {tasks.length > 0 && (
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <ProgressTracker
              progress={progress}
              showDetails={false}
              className=""
            />
          </div>
        )}

        {/* Add Task Input - Desktop */}
        {!isMobile && (
          <div className="px-6 py-4 border-b border-gray-100">
            <TaskInput
              onAddTask={handleAddTask}
              placeholder="Add a new task..."
              autoFocus={false}
              className="border-0 ring-0 focus-within:ring-0 shadow-none"
            />
          </div>
        )}

        {/* Task List */}
        <div className="px-6 py-4 h-96">
          <TaskList
            tasks={tasks}
            currentFilter={filter}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
            onEditTask={editTask}
            onFilterChange={setFilter}
            onClearCompleted={clearCompleted}
            emptyMessage="Add a task to get started!"
          />
        </div>
      </div>

      {/* Floating Action Button - Mobile */}
      {isMobile && (
        <button
          onClick={() => setShowMobileModal(true)}
          className={cn(
            "fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-lg",
            "bg-teal-500 hover:bg-teal-600 text-white",
            "transform hover:scale-105 transition-all duration-200",
            "flex items-center justify-center z-10",
            "focus:outline-none focus:ring-4 focus:ring-teal-200",
          )}
          aria-label="Add new task"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      )}

      {/* Mobile Modal */}
      <MobileTaskModal
        isOpen={showMobileModal}
        onClose={() => setShowMobileModal(false)}
        onAddTask={handleAddTask}
      />

      {/* Development Info */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 left-4 p-3 bg-black bg-opacity-75 text-white text-xs rounded-lg max-w-xs">
          <div className="font-medium mb-1">Enhanced Features Active</div>
          <div>Atomic Design Components • Proper Architecture</div>
          <div>
            Progress: {progress.percentage}% | Tasks: {tasks.length}
          </div>
        </div>
      )}
    </div>
  );
}
