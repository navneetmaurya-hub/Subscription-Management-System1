import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Building, Phone, ArrowRight, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import AuthLayout from '../../../layouts/AuthLayout';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

export default function SignupPage() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        company: '',
        phone: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Validation checks for password rule: > 8 chars, 1 uppercase, 1 lowercase, 1 special character
    const checks = {
        length: form.password.length > 8,
        uppercase: /[A-Z]/.test(form.password),
        lowercase: /[a-z]/.test(form.password),
        special: /[^A-Za-z0-9]/.test(form.password),
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
            await register(form);
            navigate('/portal');
        } catch (err) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create account</h2>
                    <p className="text-sm text-gray-500 mt-1">Register for the customer billing portal</p>
                </div>

                {error && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200/80 flex items-start gap-2.5 text-xs text-red-700">
                        <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Full Name / Contact Person"
                        name="name"
                        placeholder="Sarah Connor"
                        icon={User}
                        value={form.name}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        label="Business Email"
                        name="email"
                        type="email"
                        placeholder="sarah@acme.com"
                        icon={Mail}
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            label="Company Name"
                            name="company"
                            placeholder="Acme Corp"
                            icon={Building}
                            value={form.company}
                            onChange={handleChange}
                        />
                        <Input
                            label="Phone Number"
                            name="phone"
                            placeholder="+1 (555) 000-0000"
                            icon={Phone}
                            value={form.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="••••••••••••"
                            icon={Lock}
                            value={form.password}
                            onChange={handleChange}
                            required
                        />

                        {/* Password Requirements Checklist */}
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
                        <span>Create Portal Account</span>
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </form>

                <p className="text-center text-xs text-gray-500 pt-2">
                    Already registered?{' '}
                    <Link to="/login" className="text-[#e04f2d] font-semibold hover:underline">
                        Sign in here
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}

