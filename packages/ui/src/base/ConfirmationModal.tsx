"use client";

import React, { useEffect } from "react";

import { Button } from "./Button";

export interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) => {
  // Handle escape key press
  useEffect(() => {
    const handleEscapePress = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        event.preventDefault();
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapePress);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapePress);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden animate-fade-in-scale">
        <div className="p-5">
          <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-500">{message}</p>
        </div>

        <div className="bg-gray-50 px-5 py-4 flex justify-end space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            aria-label={cancelText}
          >
            {cancelText}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onConfirm}
            aria-label={confirmText}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
