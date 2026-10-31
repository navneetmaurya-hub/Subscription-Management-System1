import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Layers, Repeat, Receipt, User, LogOut } from 'lucide-react';

export default function PortalLayout() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col">
            {/* Header */}
            <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
                <div className="flex items-center gap-6">
                    <Link to="/portal" className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#e04f2d] to-orange-500 flex items-center justify-center text-white shadow-sm shadow-orange-500/20">
                            <Layers className="h-4 w-4" />
                        </div>
                        <div className="font-bold text-lg text-gray-900 tracking-tight">
                            Bright<span className="text-[#e04f2d]">loop</span>
                            <span className="text-xs font-semibold ml-2 px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                                Customer Portal
                            </span>
                        </div>
                    </Link>

                    <nav className="hidden sm:flex items-center gap-1">
                        <NavLink
                            to="/portal"
                            end
                            className={({ isActive }) =>
                                `px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                    isActive
                                        ? 'bg-orange-50 text-[#e04f2d]'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`
                            }
                        >
                            Overview
                        </NavLink>
                        <NavLink
                            to="/portal/subscriptions"
                            className={({ isActive }) =>
                                `px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                    isActive
                                        ? 'bg-orange-50 text-[#e04f2d]'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`
                            }
                        >
                            My Subscriptions
                        </NavLink>
                        <NavLink
                            to="/portal/invoices"
                            className={({ isActive }) =>
                                `px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                    isActive
                                        ? 'bg-orange-50 text-[#e04f2d]'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`
                            }
                        >
                            My Invoices
                        </NavLink>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-orange-50 border border-orange-100 text-[#e04f2d] flex items-center justify-center font-bold text-xs">
                            {user?.name?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
                        </div>
                        <span className="text-xs font-bold text-gray-800 hidden sm:inline">{user?.name}</span>
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

            {/* Content */}
            <main className="flex-1 p-6 lg:p-8 max-w-5xl w-full mx-auto">
                <Outlet />
            </main>
        </div>
    );
}

