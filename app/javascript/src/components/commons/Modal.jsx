import React, { useState } from "react";

const Modal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  input_label,
  input_placeholder,
}) => {
  const [categoryName, setCategoryName] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-96 rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">{title}</h2>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {input_label}
        </label>
        <input
          className="mb-4 w-full rounded border px-3 py-2"
          placeholder={input_placeholder}
          value={categoryName}
          onChange={e => setCategoryName(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <button
            className="rounded bg-gray-200 px-4 py-2"
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="rounded bg-blue-600 px-4 py-2 text-white"
            disabled={!categoryName.trim()}
            type="button"
            onClick={() => {
              onSubmit(categoryName);
              setCategoryName("");
            }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
