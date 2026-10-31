import React from 'react';

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    loading = false,
    type = 'button',
    onClick,
    ...props
}) {
    const base = 'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';

    const sizes = {
        sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
        md: 'text-sm px-4 py-2.5 rounded-xl gap-2',
        lg: 'text-base px-6 py-3 rounded-xl gap-2.5',
    };

    const variants = {
        primary: 'bg-[#e04f2d] hover:bg-[#c84323] active:bg-[#b03a1d] text-white shadow-sm focus:ring-[#e04f2d]/40',
        secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200/90 shadow-sm focus:ring-gray-300',
        outline: 'border border-[#e04f2d] text-[#e04f2d] hover:bg-orange-50 focus:ring-[#e04f2d]/20',
        ghost: 'text-gray-600 hover:bg-gray-100/70 hover:text-gray-900',
        danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm focus:ring-red-400',
        success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm focus:ring-emerald-400',
    };

    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
            {...props}
        >
            {loading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            ) : null}
            {children}
        </button>
    );
}
