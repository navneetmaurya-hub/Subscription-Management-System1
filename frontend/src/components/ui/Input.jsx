import React from 'react';

export default function Input({
    label,
    error,
    helperText,
    icon: Icon,
    rightElement,
    className = '',
    id,
    ...props
}) {
    const inputId = id || props.name || Math.random().toString(36).substring(7);

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={inputId} className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    {label}
                </label>
            )}
            <div className="relative rounded-xl shadow-sm">
                {Icon && (
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                )}
                <input
                    id={inputId}
                    className={`block w-full rounded-xl border transition-all duration-150 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                        Icon ? 'pl-10' : 'pl-3.5'
                    } ${rightElement ? 'pr-10' : 'pr-3.5'} py-2.5 ${
                        error
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50/20'
                            : 'border-gray-200 hover:border-gray-300 focus:border-[#e04f2d] focus:ring-orange-100 bg-white'
                    } ${className}`}
                    {...props}
                />
                {rightElement && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        {rightElement}
                    </div>
                )}
            </div>
            {error ? (
                <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>
            ) : helperText ? (
                <p className="mt-1.5 text-xs text-gray-500">{helperText}</p>
            ) : null}
        </div>
    );
}

