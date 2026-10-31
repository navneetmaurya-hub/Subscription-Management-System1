import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Dialog */}
            <div className={`relative bg-white w-full ${maxWidth} rounded-2xl shadow-xl border border-gray-100 z-10 overflow-hidden transform transition-all`}>
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-gray-900">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 rounded-lg p-1 hover:bg-gray-100 transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}
