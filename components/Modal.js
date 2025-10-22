import { IoClose } from "react-icons/io5";
export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 text-3xl right-2 text-gray-500 cursor-pointer hover:text-gray-700"
        >
          <IoClose />{" "}
        </button>
        {children}
      </div>
    </div>
  );
}
