import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { authApi } from '../../../api/auth.api';
import AuthLayout from '../../../layouts/AuthLayout';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await authApi.forgotPassword({ email });
            setSubmitted(true);
        } catch (err) {
            setError(err.message || 'Error sending reset email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Reset password</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Enter your email address and we'll send you a password reset link.
                    </p>
                </div>

                {error && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200/80 flex items-start gap-2.5 text-xs text-red-700">
                        <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                {submitted ? (
                    <div className="p-6 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-center space-y-3">
                        <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                        <h3 className="text-base font-semibold text-emerald-900">Check your inbox</h3>
                        <p className="text-xs text-emerald-700 leading-relaxed">
                            If an account exists with <strong>{email}</strong>, a password reset link has been dispatched. The link is valid for 30 minutes.
                        </p>
                        <div className="pt-2">
                            <Link to="/login">
                                <Button variant="secondary" size="sm">
                                    Return to sign in
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Registered Email"
                            type="email"
                            placeholder="admin@sms.com"
                            icon={Mail}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <Button
                            type="submit"
                            loading={loading}
                            className="w-full py-3 rounded-xl text-base shadow-sm font-semibold flex items-center justify-center gap-2"
                        >
                            <span>Send Reset Link</span>
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </form>
                )}

                <div className="text-center pt-2">
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Back to sign in</span>
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}
