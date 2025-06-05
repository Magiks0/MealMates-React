import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-1 backdrop-blur-sm"
      onClick={onClose} // Fermer si clic hors de la modal
    >
      <div
        className="rounded-lg shadow-lg max-w-lg w-full p-6 relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-black">{title}</h2>
        </div>
        <div className=" dark:text-gray-300">{children}</div>
        <footer className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-white bg-red-500 hover:bg-red-700 transition"
          >
            Annuler
          </button>
          <button
            onClick={() => {
              onClose();
            }}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition"
          >
            Confirmer
          </button>
        </footer>
      </div>
    </div>
  );
};

export default Modal;
