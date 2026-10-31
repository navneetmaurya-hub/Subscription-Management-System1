import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Shield, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import AuthLayout from '../../../layouts/AuthLayout';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const user = await login(email, password);
            if (user.role === 'customer') {
                navigate('/portal');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    const handleOneClickLogin = async (roleEmail, rolePass) => {
        setEmail(roleEmail);
        setPassword(rolePass);
        setError('');
        setLoading(true);
        try {
            const user = await login(roleEmail, rolePass);
            if (user.role === 'customer') {
                navigate('/portal');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(`Demo account error: ${err.message}. You can also sign up or register below.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Sign in</h2>
                    <p className="text-sm text-gray-500 mt-1">Access the operations portal</p>
                </div>

                {error && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200/80 flex items-start gap-2.5 text-xs text-red-700">
                        <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                {/* One-Click Role Login (Demo Review) */}
                <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#e04f2d]">
                        <Shield className="h-4 w-4" />
                        <span>One-Click Role Login (Demo Review)</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                        <button
                            type="button"
                            onClick={() => handleOneClickLogin('admin@sms.com', 'Admin@12345')}
                            className="p-3 rounded-xl bg-gray-50 hover:bg-orange-50/60 border border-gray-100 hover:border-orange-200 text-left transition-all group"
                        >
                            <div className="text-xs font-bold text-gray-900 group-hover:text-[#e04f2d]">Admin</div>
                            <div className="text-[11px] text-gray-500 mt-0.5">Full System Access</div>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleOneClickLogin('staff@brightloop.com', 'Password@123')}
                            className="p-3 rounded-xl bg-gray-50 hover:bg-orange-50/60 border border-gray-100 hover:border-orange-200 text-left transition-all group"
                        >
                            <div className="text-xs font-bold text-gray-900 group-hover:text-[#e04f2d]">Operations</div>
                            <div className="text-[11px] text-gray-500 mt-0.5">Billing & Invoices</div>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleOneClickLogin('customer@brightloop.com', 'Password@123')}
                            className="p-3 rounded-xl bg-gray-50 hover:bg-orange-50/60 border border-gray-100 hover:border-orange-200 text-left transition-all group"
                        >
                            <div className="text-xs font-bold text-gray-900 group-hover:text-[#e04f2d]">Customer</div>
                            <div className="text-[11px] text-gray-500 mt-0.5">Self-Service Portal</div>
                        </button>

                        <Link
                            to="/signup"
                            className="p-3 rounded-xl bg-gray-50 hover:bg-orange-50/60 border border-gray-100 hover:border-orange-200 text-left transition-all group block"
                        >
                            <div className="text-xs font-bold text-gray-900 group-hover:text-[#e04f2d] flex items-center justify-between">
                                <span>Sign Up</span>
                                <UserCheck className="h-3.5 w-3.5 text-gray-400 group-hover:text-[#e04f2d]" />
                            </div>
                            <div className="text-[11px] text-gray-500 mt-0.5">Create New Account</div>
                        </Link>
                    </div>
                </div>

                {/* Divider */}
                <div className="relative flex items-center justify-center">
                    <div className="border-t border-gray-200 w-full" />
                    <span className="bg-[#fafafa] px-3 text-xs text-gray-400 uppercase tracking-wider shrink-0">
                        or sign in manually
                    </span>
                </div>

                {/* Manual Login Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="admin@sms.com"
                        icon={Mail}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Password
                            </label>
                            <Link to="/forgot-password" tabIndex={-1} className="text-xs text-[#e04f2d] hover:underline font-medium">
                                Forgot password?
                            </Link>
                        </div>
                        <Input
                            type="password"
                            placeholder="••••••••••••"
                            icon={Lock}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        loading={loading}
                        className="w-full py-3 rounded-xl text-base shadow-sm font-semibold flex items-center justify-center gap-2"
                    >
                        <span>Sign In to Portal</span>
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </form>

                <p className="text-center text-xs text-gray-500 pt-2">
                    Need a customer portal account?{' '}
                    <Link to="/signup" className="text-[#e04f2d] font-semibold hover:underline">
                        Create one here
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}

