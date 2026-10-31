import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowRight, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { authApi } from '../../../api/auth.api';
import AuthLayout from '../../../layouts/AuthLayout';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

export default function ResetPasswordPage() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const checks = {
        length: password.length > 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
    };
    const isPasswordValid = Object.values(checks).every(Boolean);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!isPasswordValid) {
            setError('Please satisfy all password security criteria');
            return;
        }

        setLoading(true);
        try {
            await authApi.resetPassword(token, { password });
            navigate('/login');
        } catch (err) {
            setError(err.message || 'Invalid or expired reset token');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Set new password</h2>
                    <p className="text-sm text-gray-500 mt-1">Please enter your new strong password</p>
                </div>

                {error && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200/80 flex items-start gap-2.5 text-xs text-red-700">
                        <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Input
                            label="New Password"
                            type="password"
                            placeholder="••••••••••••"
                            icon={Lock}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {/* Checklist */}
                        <div className="mt-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs space-y-1.5">
                            <span className="font-semibold text-gray-700 block mb-1">Password Requirements:</span>
                            <div className={`flex items-center gap-1.5 ${checks.length ? 'text-emerald-700' : 'text-gray-400'}`}>
                                {checks.length ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                                <span>More than 8 characters</span>
                            </div>
                            <div className={`flex items-center gap-1.5 ${checks.uppercase ? 'text-emerald-700' : 'text-gray-400'}`}>
                                {checks.uppercase ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                                <span>At least one uppercase letter (A-Z)</span>
                            </div>
                            <div className={`flex items-center gap-1.5 ${checks.lowercase ? 'text-emerald-700' : 'text-gray-400'}`}>
                                {checks.lowercase ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                                <span>At least one lowercase letter (a-z)</span>
                            </div>
                            <div className={`flex items-center gap-1.5 ${checks.special ? 'text-emerald-700' : 'text-gray-400'}`}>
                                {checks.special ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                                <span>At least one special character (!@#$%^&*)</span>
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        loading={loading}
                        disabled={!isPasswordValid}
                        className="w-full py-3 rounded-xl text-base shadow-sm font-semibold flex items-center justify-center gap-2"
                    >
                        <span>Update Password</span>
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </form>

                <div className="text-center pt-2">
                    <Link to="/login" className="text-xs font-semibold text-gray-600 hover:text-gray-900">
                        Back to sign in
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}
