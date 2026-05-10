import { Check } from 'lucide-react';

export default function ConfirmationModal({ isOpen, title, message, onClose, type = 'success' }) {
  if (!isOpen) return null;

  const bgColor = type === 'success' ? 'bg-green-50' : 'bg-blue-50';
  const borderColor = type === 'success' ? 'border-green-200' : 'border-blue-200';
  const iconBgColor = type === 'success' ? 'bg-green-100' : 'bg-blue-100';
  const iconColor = type === 'success' ? 'text-green-600' : 'text-blue-600';
  const textColor = type === 'success' ? 'text-green-900' : 'text-blue-900';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`${bgColor} border ${borderColor} rounded-lg shadow-xl max-w-sm w-full p-6 animate-in fade-in zoom-in-95`}>
        <div className="flex items-center gap-4 mb-4">
          <div className={`${iconBgColor} rounded-full p-3 flex items-center justify-center`}>
            <Check className={`${iconColor} w-6 h-6`} />
          </div>
          <h3 className={`text-lg font-semibold ${textColor}`}>{title}</h3>
        </div>
        <p className={`${textColor} text-sm mb-6 opacity-90`}>{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className={`${type === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white px-6 py-2 rounded-lg font-medium transition`}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
