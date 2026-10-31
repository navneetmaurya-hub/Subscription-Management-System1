import React from 'react';

export default function Select({
    label,
    error,
    helperText,
    icon: Icon,
    options = [],
    className = '',
    id,
    placeholder = 'Select an option...',
    ...props
}) {
    const selectId = id || props.name || Math.random().toString(36).substring(7);

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={selectId} className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    {label}
                </label>
            )}
            <div className="relative rounded-xl shadow-sm">
                {Icon && (
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                )}
                <select
                    id={selectId}
                    className={`block w-full rounded-xl border transition-all duration-150 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                        Icon ? 'pl-10' : 'pl-3.5'
                    } pr-8 py-2.5 appearance-none bg-white ${
                        error
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                            : 'border-gray-200 hover:border-gray-300 focus:border-[#e04f2d] focus:ring-orange-100'
                    } ${className}`}
                    {...props}
                >
                    {placeholder && <option value="">{placeholder}</option>}
                    {options.map((opt) => {
                        const val = typeof opt === 'object' ? opt.value : opt;
                        const label = typeof opt === 'object' ? opt.label : opt;
                        return (
                            <option key={val} value={val}>
                                {label}
                            </option>
                        );
                    })}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            {error ? (
                <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>
            ) : helperText ? (
                <p className="mt-1.5 text-xs text-gray-500">{helperText}</p>
            ) : null}
        </div>
    );
}

