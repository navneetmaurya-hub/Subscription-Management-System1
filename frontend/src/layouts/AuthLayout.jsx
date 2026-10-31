import React from 'react';
import { Layers, ShieldCheck, Zap, RefreshCw, Users, FileText } from 'lucide-react';

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#fafafa]">
            {/* Left Hero Column */}
            <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-between bg-white border-b lg:border-b-0 lg:border-r border-gray-100">
                <div>
                    {/* Brand Header */}
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#e04f2d] to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
                            <Layers className="h-5 w-5" />
                        </div>
                        <div className="flex items-center font-bold text-xl tracking-tight text-gray-900">
                            Bright<span className="text-[#e04f2d]">loop</span>
                            <span className="text-xs font-semibold ml-1.5 px-1.5 py-0.5 rounded bg-orange-100/70 text-orange-800">
                                ERP
                            </span>
                        </div>
                    </div>

                    {/* Headline Banner & Hero */}
                    <div className="mt-14 max-w-xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50/80 border border-orange-200/60 text-xs font-semibold text-[#e04f2d] tracking-wide mb-6">
                            <span>✨</span> RECURRING BILLING & SUBSCRIPTIONS
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-[1.15]">
                            Run your business{' '}
                            <span className="text-[#e04f2d]">smarter.</span>
                        </h1>

                        <p className="mt-5 text-base text-gray-500 leading-relaxed">
                            The unified digital backbone for recurring revenue. Configure plans, product variants, automated billing cycles, taxes, discounts, and customer self-service in one place.
                        </p>
                    </div>

                    {/* 2x2 Value Cards */}
                    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
                        <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100">
                            <div className="flex items-center gap-2.5 text-xs font-semibold text-gray-900 mb-1">
                                <RefreshCw className="h-4 w-4 text-[#e04f2d]" />
                                Automated Billing
                            </div>
                            <p className="text-xs text-gray-500">
                                Cron-scheduled recurring invoices with double-billing protection.
                            </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100">
                            <div className="flex items-center gap-2.5 text-xs font-semibold text-gray-900 mb-1">
                                <FileText className="h-4 w-4 text-[#e04f2d]" />
                                Quotation Engine
                            </div>
                            <p className="text-xs text-gray-500">
                                Turn customer quotes into confirmed subscriptions in one click.
                            </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100">
                            <div className="flex items-center gap-2.5 text-xs font-semibold text-gray-900 mb-1">
                                <Zap className="h-4 w-4 text-[#e04f2d]" />
                                Flexible Catalog
                            </div>
                            <p className="text-xs text-gray-500">
                                Product variants (e.g. Odoo brand +560) and customizable billing terms.
                            </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100">
                            <div className="flex items-center gap-2.5 text-xs font-semibold text-gray-900 mb-1">
                                <Users className="h-4 w-4 text-[#e04f2d]" />
                                Role-Based Access
                            </div>
                            <p className="text-xs text-gray-500">
                                Dedicated workspaces for Admin, Staff operations, and Customer portal.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer copyright */}
                <div className="mt-12 text-xs text-gray-400">
                    © 2026 Brightloop Software — Built with Node.js + React & Tailwind
                </div>
            </div>

            {/* Right Auth Column */}
            <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>
        </div>
    );
}
