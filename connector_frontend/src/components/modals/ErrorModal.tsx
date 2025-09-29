"use client";

export function ErrorModal({ title, message, onClose }: { title: string; message: string; onClose: () => void }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b">
          <div className="text-red-700 font-medium">{title}</div>
        </div>
        <div className="p-4 text-sm">{message}</div>
        <div className="p-3 border-t flex justify-end">
          <button className="btn btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
