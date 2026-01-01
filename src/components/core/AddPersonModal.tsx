import React from 'react';

export interface AddPersonModalProps {
  isOpen: boolean;
  name: string;
  onChangeName: (v: string) => void;
  onCancel: () => void;
  onAdd: () => void;
}

const AddPersonModal: React.FC<AddPersonModalProps> = ({
  isOpen,
  name,
  onChangeName,
  onCancel,
  onAdd,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-20">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg w-11/12 max-w-md p-5 shadow-xl border border-gray-700 animate-slideUp">
        <h2 className="text-xl font-semibold text-gray-300 mb-4">Add New Person</h2>
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => onChangeName(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:border-gray-600"
            placeholder="Enter name"
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 cursor-pointer !rounded-button"
          >
            Cancel
          </button>
          <button
            onClick={onAdd}
            className="px-4 py-2 bg-gray-600 text-gray-200 rounded-lg hover:bg-gray-500 cursor-pointer !rounded-button"
          >
            Add Person
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPersonModal;
