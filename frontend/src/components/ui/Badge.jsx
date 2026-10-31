import React from 'react';

export default function Badge({
    children,
    variant = 'gray',
    size = 'md',
    className = '',
    dot = false,
}) {
    const variants = {
        gray: 'bg-gray-100 text-gray-700 border-gray-200/60',
        orange: 'bg-orange-50 text-[#e04f2d] border-orange-200/70',
        blue: 'bg-blue-50 text-blue-700 border-blue-200/60',
        green: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
        amber: 'bg-amber-50 text-amber-800 border-amber-200/60',
        red: 'bg-rose-50 text-rose-700 border-rose-200/60',
        purple: 'bg-purple-50 text-purple-700 border-purple-200/60',
    };

    const dots = {
        gray: 'bg-gray-400',
        orange: 'bg-[#e04f2d]',
        blue: 'bg-blue-500',
        green: 'bg-emerald-500',
        amber: 'bg-amber-500',
        red: 'bg-rose-500',
        purple: 'bg-purple-500',
    };

    const sizes = {
        sm: 'text-[11px] px-2 py-0.5 rounded-md gap-1',
        md: 'text-xs px-2.5 py-1 rounded-lg gap-1.5 font-medium',
        lg: 'text-sm px-3 py-1.5 rounded-lg gap-2 font-medium',
    };

    return (
        <span
            className={`inline-flex items-center border capitalize ${variants[variant] || variants.gray} ${sizes[size]} ${className}`}
        >
            {dot && <span className={`h-1.5 w-1.5 rounded-full ${dots[variant] || dots.gray}`} />}
            {children}
        </span>
    );
}
