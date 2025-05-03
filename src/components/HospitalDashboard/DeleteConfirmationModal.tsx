import React from 'react';
import { Modal } from '../Modal/Modal';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  doctorName: string;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  doctorName
}: DeleteConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Doctor">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-100 rounded-full">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1">Confirm Deletion</h3>
            <p className="text-[#B3B3B3]">
              Are you sure you want to delete Dr. {doctorName}? This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 rounded-xl border border-[#3E3E3E] font-medium 
                     text-white hover:bg-[#3E3E3E] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-4 rounded-xl font-medium bg-red-600 text-white 
                     hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}