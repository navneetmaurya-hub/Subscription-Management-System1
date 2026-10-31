import React from 'react';

export default function Card({ children, className = '', title, subtitle, action, footer }) {
    return (
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden transition-all ${className}`}>
            {(title || action) && (
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        {title && <h3 className="text-base font-semibold text-gray-900">{title}</h3>}
                        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
                    </div>
                    {action && <div>{action}</div>}
                </div>
            )}
            <div className="p-6">{children}</div>
            {footer && <div className="px-6 py-3.5 bg-gray-50/70 border-t border-gray-100">{footer}</div>}
        </div>
    );
}

