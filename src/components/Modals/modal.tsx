import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean,
  onClose: () => void,
  children: ReactNode
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 border-black border-2 flex items-center justify-center z-50">
      <div className="p-8 bg-zinc-900 flex flex-col items-center justify-center rounded shadow-lg relative">
        <button onClick={onClose} className="absolute top-2 right-3 text-gray-500">✕</button>
        {children}
      </div>
    </div>
  );
}
