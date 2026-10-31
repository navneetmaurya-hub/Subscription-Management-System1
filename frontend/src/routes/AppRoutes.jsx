import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Layouts
import AdminLayout from '../layouts/AdminLayout';
import PortalLayout from '../layouts/PortalLayout';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

// Auth Pages
import LoginPage from '../features/auth/pages/LoginPage';
import SignupPage from '../features/auth/pages/SignupPage';
import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from '../features/auth/pages/ResetPasswordPage';

// Admin / Staff Pages
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import ProductListPage from '../features/products/pages/ProductListPage';
import ProductFormPage from '../features/products/pages/ProductFormPage';
import PlanListPage from '../features/plans/pages/PlanListPage';
import PlanFormPage from '../features/plans/pages/PlanFormPage';
import SubscriptionListPage from '../features/subscriptions/pages/SubscriptionListPage';
import SubscriptionDetailPage from '../features/subscriptions/pages/SubscriptionDetailPage';
import SubscriptionFormPage from '../features/subscriptions/pages/SubscriptionFormPage';
import InvoiceListPage from '../features/invoices/pages/InvoiceListPage';
import InvoiceDetailPage from '../features/invoices/pages/InvoiceDetailPage';
import PaymentListPage from '../features/payments/pages/PaymentListPage';
import TaxListPage from '../features/taxes/pages/TaxListPage';
import DiscountListPage from '../features/discounts/pages/DiscountListPage';
import DiscountFormPage from '../features/discounts/pages/DiscountFormPage';
import TemplateListPage from '../features/templates/pages/TemplateListPage';
import TemplateFormPage from '../features/templates/pages/TemplateFormPage';
import StaffListPage from '../features/users/pages/StaffListPage';
import ReportsPage from '../features/reports/pages/ReportsPage';

// Customer Portal Pages
import PortalHomePage from '../features/portal/pages/PortalHomePage';
import MySubscriptionsPage from '../features/portal/pages/MySubscriptionsPage';
import MyInvoicesPage from '../features/portal/pages/MyInvoicesPage';

// Common
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRoutes() {
    const { user } = useAuth();

    return (
        <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

            {/* Root redirect */}
            <Route
                path="/"
                element={
                    <Navigate
                        to={user ? (user.role === 'customer' ? '/portal' : '/dashboard') : '/login'}
                        replace
                    />
                }
            />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                {/* Admin & Staff Portal */}
                <Route element={<RoleRoute allowedRoles={['admin', 'staff']} />}>
                    <Route element={<AdminLayout />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/products" element={<ProductListPage />} />
                        <Route path="/products/new" element={<ProductFormPage />} />
                        <Route path="/products/:id/edit" element={<ProductFormPage />} />
                        <Route path="/plans" element={<PlanListPage />} />
                        <Route path="/plans/new" element={<PlanFormPage />} />
                        <Route path="/plans/:id/edit" element={<PlanFormPage />} />
                        <Route path="/subscriptions" element={<SubscriptionListPage />} />
                        <Route path="/subscriptions/new" element={<SubscriptionFormPage />} />
                        <Route path="/subscriptions/:id" element={<SubscriptionDetailPage />} />
                        <Route path="/invoices" element={<InvoiceListPage />} />
                        <Route path="/invoices/:id" element={<InvoiceDetailPage />} />
                        <Route path="/payments" element={<PaymentListPage />} />
                        <Route path="/taxes" element={<TaxListPage />} />
                        <Route path="/discounts" element={<DiscountListPage />} />
                        <Route path="/discounts/new" element={<DiscountFormPage />} />
                        <Route path="/templates" element={<TemplateListPage />} />
                        <Route path="/templates/new" element={<TemplateFormPage />} />
                        <Route path="/staff" element={<StaffListPage />} />
                        <Route path="/reports" element={<ReportsPage />} />
                    </Route>
                </Route>

                {/* Customer Portal */}
                <Route element={<RoleRoute allowedRoles={['customer', 'admin']} />}>
                    <Route path="/portal" element={<PortalLayout />}>
                        <Route index element={<PortalHomePage />} />
                        <Route path="subscriptions" element={<MySubscriptionsPage />} />
                        <Route path="invoices" element={<MyInvoicesPage />} />
                    </Route>
                </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

