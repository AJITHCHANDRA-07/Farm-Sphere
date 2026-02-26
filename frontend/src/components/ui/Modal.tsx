import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-7xl max-h-[95vh] overflow-y-auto w-full mx-8 relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
        >
          ×
        </button>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
