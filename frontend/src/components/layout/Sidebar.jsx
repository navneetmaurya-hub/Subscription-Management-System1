import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Repeat,
    Receipt,
    CreditCard,
    Package,
    CalendarDays,
    FileSpreadsheet,
    Percent,
    Shield,
    BarChart3,
    Layers,
    UserCheck,
    Tags,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function Sidebar({ isOpen, onClose }) {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    const navItems = [
        { label: 'Overview', to: '/dashboard', icon: LayoutDashboard },
        { label: 'Subscriptions', to: '/subscriptions', icon: Repeat },
        { label: 'Invoices', to: '/invoices', icon: Receipt },
        { label: 'Payments', to: '/payments', icon: CreditCard },
        { label: 'Reports', to: '/reports', icon: BarChart3 },
        { header: 'CATALOG & CONFIG' },
        { label: 'Products & Variants', to: '/products', icon: Package },
        { label: 'Plans', to: '/plans', icon: CalendarDays },
        { label: 'Quotation Templates', to: '/templates', icon: FileSpreadsheet },
        { label: 'Tax Rules', to: '/taxes', icon: Percent },
        { label: 'Discounts', to: '/discounts', icon: Tags, adminOnly: true },
        ...(isAdmin ? [
            { header: 'ADMINISTRATION' },
            { label: 'Staff Team', to: '/staff', icon: UserCheck },
        ] : []),
    ];

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Brand Logo */}
                <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-100">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#e04f2d] to-orange-500 flex items-center justify-center text-white shadow-sm shadow-orange-500/20">
                        <Layers className="h-4 w-4" />
                    </div>
                    <div className="flex items-center font-bold text-lg tracking-tight text-gray-900">
                        Bright<span className="text-[#e04f2d]">loop</span>
                        <span className="text-[10px] font-semibold ml-1.5 px-1.5 py-0.5 rounded bg-orange-100/80 text-orange-800">
                            ERP
                        </span>
                    </div>
                </div>

                {/* Navigation list */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                    {navItems.map((item, index) => {
                        if (item.header) {
                            return (
                                <div
                                    key={index}
                                    className="pt-4 pb-1.5 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider"
                                >
                                    {item.header}
                                </div>
                            );
                        }

                        if (item.adminOnly && !isAdmin) return null;

                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                                        isActive
                                            ? 'bg-orange-50 text-[#e04f2d] font-bold shadow-sm'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`
                                }
                            >
                                <Icon className="h-4 w-4 shrink-0" />
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </div>

                {/* Bottom status badge */}
                <div className="p-4 border-t border-gray-100">
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-500 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-[#e04f2d]" />
                        <span>System status: <strong>Online</strong></span>
                    </div>
                </div>
            </aside>
        </>
    );
}
