import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, User, Bell } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export default function Navbar({ onMenuToggle }) {
    const { user, logout } = useAuth();

    return (
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuToggle}
                    className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <div className="hidden sm:block">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Workspace
                    </span>
                    <h2 className="text-sm font-bold text-gray-800">Brightloop Software Platform</h2>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <StatusBadge status={user?.role} />

                <div className="h-8 w-px bg-gray-200" />

                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-orange-50 border border-orange-100 text-[#e04f2d] flex items-center justify-center font-bold text-sm">
                        {user?.name?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
                    </div>
                    <div className="hidden md:block text-left">
                        <div className="text-xs font-bold text-gray-900 leading-tight">{user?.name}</div>
                        <div className="text-[11px] text-gray-500">{user?.email}</div>
                    </div>
                </div>

                <button
                    onClick={logout}
                    title="Sign Out"
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                    <LogOut className="h-4 w-4" />
                </button>
            </div>
        </header>
    );
}
