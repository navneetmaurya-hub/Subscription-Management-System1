import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, trend }) {
    return (
        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] relative overflow-hidden">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</span>
                {Icon && (
                    <div className="h-9 w-9 rounded-xl bg-orange-50/80 border border-orange-100 flex items-center justify-center text-[#e04f2d]">
                        <Icon className="h-4 w-4" />
                    </div>
                )}
            </div>

            <div className="mt-3">
                <div className="text-2xl font-extrabold text-gray-900 tracking-tight">{value}</div>
                {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
                {trend && (
                    <div className="mt-2 text-xs font-semibold text-emerald-600 flex items-center gap-1">
                        <span>↑</span> {trend}
                    </div>
                )}
            </div>
        </div>
    );
}

