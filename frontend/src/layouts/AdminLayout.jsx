import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#fafafa]">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="lg:pl-64 flex flex-col min-h-screen">
                <Navbar onMenuToggle={() => setSidebarOpen(true)} />
                <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
