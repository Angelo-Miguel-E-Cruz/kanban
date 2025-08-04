export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
      <div className="p-8 bg-gradient-to-b from-zinc-900 to-zinc-800 flex flex-col items-center justify-center rounded shadow-lg relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500">✕</button>
        {children}
      </div>
    </div>
  );
}
