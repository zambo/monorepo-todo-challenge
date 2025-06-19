"use client";

import { TASK_FILTERS } from "@repo/shared";
import {
  useTasks,
  useFilter,
  useIsEditing,
  useAddTask,
  useToggleTask,
  useDeleteTask,
  useEditTask,
  useStartEditing,
  useCancelEditing,
  useClearCompleted,
  useSetFilter,
  useGetProgress,
} from "@repo/stores";
import {
  TaskInput,
  Input,
  Checkbox,
  ActionButton,
  Button,
  DateHeader,
} from "@repo/ui";
import { cn } from "@repo/utils";
import { useState, useEffect } from "react";

export default function Home() {
  // Store hooks
  const tasks = useTasks();
  const filter = useFilter();
  const isEditing = useIsEditing();
  const addTask = useAddTask();
  const toggleTask = useToggleTask();
  const deleteTask = useDeleteTask();
  const editTask = useEditTask();
  const startEditing = useStartEditing();
  const cancelEditing = useCancelEditing();
  const clearCompleted = useClearCompleted();
  const setFilter = useSetFilter();
  const getProgress = useGetProgress();

  // UI state for mobile modal
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Local editing state
  const [editData, setEditData] = useState<{
    name: string;
    description: string;
  }>({ name: "", description: "" });

  // Reset edit data when editing mode changes
  useEffect(() => {
    if (!isEditing) {
      setEditData({ name: "", description: "" });
    }
  }, [isEditing]);

  // Set hydrated state to prevent hydration mismatch
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showMobileModal) {
        setShowMobileModal(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showMobileModal]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showMobileModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showMobileModal]);

  // Get progress data
  const progress = getProgress();

  const handleAddTask = (taskName: string, description?: string) => {
    addTask(taskName, description);
    setShowMobileModal(false);
  };

  const handleStartEdit = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setEditData({ name: task.name, description: task.description || "" });
      startEditing(taskId);
    }
  };

  const handleSaveEdit = (taskId: string) => {
    if (editData.name.trim()) {
      const saveData = {
        name: editData.name.trim(),
        ...(editData.description.trim() && {
          description: editData.description.trim(),
        }),
      };
      editTask(taskId, saveData);
    }
  };

  const handleCancelEdit = () => {
    setEditData({ name: "", description: "" });
    cancelEditing();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Main Card with Group for Focus Management */}
      <div className="group bg-white rounded-2xl shadow-lg w-full max-w-md overflow-hidden focus-within:ring-4 focus-within:ring-teal-100 transition-all duration-200">
        {/* Date Header */}
        <div className="px-6 py-6 border-b border-gray-100">
          <DateHeader />
        </div>

        {/* Progress Tracker - Simplified */}
        {isHydrated && tasks.length > 0 && (
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-800">
                    Progress
                  </h3>
                  <p className="text-xs text-gray-500">
                    {progress.percentage === 0 && "Get started!"}
                    {progress.percentage > 0 &&
                      progress.percentage <= 25 &&
                      "Just getting started"}
                    {progress.percentage > 25 &&
                      progress.percentage <= 50 &&
                      "Making progress"}
                    {progress.percentage > 50 &&
                      progress.percentage <= 75 &&
                      "Almost there"}
                    {progress.percentage > 75 && "Great job!"}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-800">
                    {progress.percentage}%
                  </div>
                  <div className="text-xs text-gray-500">
                    {progress.completed} of {progress.total}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative">
                <div className="w-full h-2 rounded-full overflow-hidden bg-gray-200">
                  <div
                    className={cn(
                      "h-full transition-all duration-500 ease-out rounded-full",
                      progress.percentage === 0 && "bg-gray-300",
                      progress.percentage > 0 &&
                        progress.percentage <= 25 &&
                        "bg-teal-200",
                      progress.percentage > 25 &&
                        progress.percentage <= 50 &&
                        "bg-teal-300",
                      progress.percentage > 50 &&
                        progress.percentage <= 75 &&
                        "bg-teal-400",
                      progress.percentage > 75 &&
                        progress.percentage <= 100 &&
                        "bg-teal-500",
                      progress.percentage >= 100 && "bg-green-500",
                    )}
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
              </div>
            </div>
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

        {/* Task List with Proper Components */}
        <div className="px-6 py-4 max-h-96 overflow-y-auto">
          {!isHydrated ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📝</div>
              <div className="text-gray-400 text-sm">Loading tasks...</div>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📝</div>
              <div className="text-gray-400 text-sm">
                Add a task to get started!
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks
                .filter((task) => {
                  switch (filter) {
                    case TASK_FILTERS.ACTIVE:
                      return !task.completed;
                    case TASK_FILTERS.COMPLETED:
                      return task.completed;
                    default:
                      return true;
                  }
                })
                .map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "group rounded-lg border border-gray-200 transition-all duration-200",
                      "hover:border-gray-300 hover:shadow-sm focus-within:ring-2 focus-within:ring-teal-100",
                      isEditing === task.id &&
                        "border-teal-300 shadow-md ring-2 ring-teal-100",
                      task.completed && "opacity-60",
                    )}
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        {/* Checkbox */}
                        <Checkbox
                          checked={task.completed}
                          onChange={() => toggleTask(task.id)}
                          className="mt-1"
                        />

                        {/* Task Content */}
                        <div className="flex-1 min-w-0">
                          {isEditing === task.id ? (
                            <div className="space-y-3">
                              <Input
                                value={editData.name}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    name: e.target.value,
                                  })
                                }
                                wrapper={false}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleSaveEdit(task.id);
                                  } else if (e.key === "Escape") {
                                    handleCancelEdit();
                                  }
                                }}
                                className="text-sm font-medium"
                                placeholder="Task name"
                                autoFocus
                              />
                              <textarea
                                value={editData.description}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    description: e.target.value,
                                  })
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSaveEdit(task.id);
                                  } else if (e.key === "Escape") {
                                    handleCancelEdit();
                                  }
                                }}
                                className={cn(
                                  "w-full text-xs bg-white border border-gray-300 rounded-md px-3 py-2",
                                  "focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200",
                                  "text-gray-700 placeholder-gray-500 resize-none",
                                )}
                                placeholder="Description (optional)"
                                rows={2}
                              />
                            </div>
                          ) : (
                            <div>
                              <span
                                className={cn(
                                  "text-sm text-gray-900 font-medium transition-all duration-200",
                                  task.completed &&
                                    "line-through text-gray-500",
                                )}
                              >
                                {task.name}
                              </span>
                              {task.description && (
                                <div
                                  className={cn(
                                    "text-xs text-gray-600 mt-1",
                                    task.completed &&
                                      "line-through text-gray-400",
                                  )}
                                >
                                  {task.description}
                                </div>
                              )}
                              {/* Task Date */}
                              <div
                                className={cn(
                                  "text-xs mt-2 flex items-center gap-1",
                                  task.completed
                                    ? "text-gray-500"
                                    : "text-gray-400",
                                )}
                              >
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                <span>
                                  {task.completed
                                    ? "completed on "
                                    : "added on "}
                                  {(task.completed
                                    ? task.updatedAt
                                    : task.createdAt
                                  ).toLocaleDateString("en", {
                                    month: "short",
                                    day: "numeric",
                                    year:
                                      (task.completed
                                        ? task.updatedAt
                                        : task.createdAt
                                      ).getFullYear() !==
                                      new Date().getFullYear()
                                        ? "numeric"
                                        : undefined,
                                  })}
                                  {" at "}
                                  {(task.completed
                                    ? task.updatedAt
                                    : task.createdAt
                                  ).toLocaleTimeString("en", {
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                  })}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                          {isEditing === task.id ? (
                            <>
                              <ActionButton
                                onClick={() => handleSaveEdit(task.id)}
                                icon={
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                }
                                label="Save changes"
                                variant="save"
                                size="sm"
                              />
                              <ActionButton
                                onClick={handleCancelEdit}
                                icon={
                                  <svg
                                    className="w-4 h-4"
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
                                }
                                label="Cancel editing"
                                variant="cancel"
                                size="sm"
                              />
                            </>
                          ) : (
                            <>
                              <ActionButton
                                onClick={() => handleStartEdit(task.id)}
                                icon={
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                }
                                label="Edit task"
                                variant="edit"
                                size="sm"
                              />
                              <ActionButton
                                onClick={() => deleteTask(task.id)}
                                icon={
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                }
                                label="Delete task"
                                variant="delete"
                                size="sm"
                              />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Filter Bar */}
        <div className="px-6 py-4 border-t border-gray-100">
          <div className="flex gap-2 mb-4">
            {Object.entries(TASK_FILTERS).map(([key, value]) => (
              <Button
                key={key}
                onClick={() => setFilter(value)}
                variant={filter === value ? "primary" : "ghost"}
                size="sm"
                className={cn(
                  "transition-all duration-200",
                  filter === value && "ring-1 ring-teal-200",
                )}
              >
                {key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()}
              </Button>
            ))}
          </div>

          {/* Clear Completed */}
          {isHydrated && progress.completed > 0 && (
            <div className="text-center">
              <Button
                onClick={clearCompleted}
                variant="ghost"
                size="sm"
                className="text-teal-600 hover:text-teal-700 transition-colors font-medium"
              >
                Clear {progress.completed} completed task
                {progress.completed > 1 ? "s" : ""}
              </Button>
            </div>
          )}
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
      {showMobileModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-end justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowMobileModal(false);
            }
          }}
        >
          <div className="bg-white w-full max-w-md rounded-t-2xl shadow-xl transform transition-transform duration-300 ease-out">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-lg font-medium text-gray-800">
                Add New Task
              </h3>
              <button
                onClick={() => setShowMobileModal(false)}
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
      )}

      {/* Development Info */}
      {isHydrated && process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 left-4 p-3 bg-black bg-opacity-75 text-white text-xs rounded-lg max-w-xs">
          <div className="font-medium mb-1">Enhanced Features Active</div>
          <div>Proper UI Components • Group Focus • Better Spacing</div>
          <div>
            Progress: {progress.percentage}% | Editing: {isEditing || "None"}
          </div>
        </div>
      )}
    </div>
  );
}
