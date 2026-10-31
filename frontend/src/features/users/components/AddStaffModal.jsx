import React, { useState } from 'react';
import { User, Mail, Lock, CheckCircle2 } from 'lucide-react';
import { usersApi } from '../../../api/users.api';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

export default function AddStaffModal({ isOpen, onClose, onSuccess }) {
    const [form, setForm] = useState({ name: '', email: '', password: 'Password@123' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await usersApi.createStaff(form);
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to add staff');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Staff Member">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                        {error}
                    </div>
                )}

                <Input
                    label="Full Name"
                    placeholder="e.g. Alex Morgan"
                    icon={User}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                />

                <Input
                    label="Email Address"
                    type="email"
                    placeholder="alex@brightloop.com"
                    icon={Mail}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                />

                <Input
                    label="Temporary Password"
                    type="password"
                    icon={Lock}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    helperText="Password must be > 8 chars with uppercase, lowercase, and special character."
                    required
                />

                <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={loading} className="gap-1.5">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Create Staff Account</span>
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

