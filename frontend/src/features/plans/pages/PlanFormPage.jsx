import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { plansApi } from '../../../api/plans.api';
import { BILLING_PERIODS } from '../../../utils/constants';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

export default function PlanFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [form, setForm] = useState({
        name: '',
        price: '',
        billingPeriod: 'monthly',
        minQuantity: 1,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        autoClose: false,
        allowEarlyClose: false,
        allowPause: true,
        allowRenew: true,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEdit) {
            plansApi.getById(id)
                .then((res) => {
                    const p = res.data;
                    setForm({
                        name: p.name,
                        price: p.price,
                        billingPeriod: p.billingPeriod,
                        minQuantity: p.minQuantity || 1,
                        startDate: p.startDate ? p.startDate.split('T')[0] : '',
                        endDate: p.endDate ? p.endDate.split('T')[0] : '',
                        autoClose: Boolean(p.autoClose),
                        allowEarlyClose: Boolean(p.allowEarlyClose),
                        allowPause: Boolean(p.allowPause),
                        allowRenew: Boolean(p.allowRenew),
                    });
                })
                .catch((err) => setError(err.message));
        }
    }, [id, isEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const payload = {
            ...form,
            price: Number(form.price),
            minQuantity: Number(form.minQuantity || 1),
            endDate: form.endDate ? new Date(form.endDate) : undefined,
        };

        try {
            if (isEdit) {
                await plansApi.update(id, payload);
            } else {
                await plansApi.create(payload);
            }
            navigate('/plans');
        } catch (err) {
            setError(err.message || 'Failed to save plan');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
                <Link to="/plans" className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                        {isEdit ? 'Edit Plan' : 'New Plan'}
                    </h1>
                    <p className="text-xs text-gray-500 mt-0.5">Define recurrence, availability, and lifecycle rules.</p>
                </div>
            </div>

            {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card title="Plan Parameters">
                    <div className="space-y-4">
                        <Input
                            label="Plan Name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="e.g. Monthly Standard Business"
                            required
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Select
                                label="Billing Recurrence"
                                value={form.billingPeriod}
                                onChange={(e) => setForm({ ...form, billingPeriod: e.target.value })}
                                options={BILLING_PERIODS}
                                required
                            />
                            <Input
                                label="Base Price ($)"
                                type="number"
                                step="0.01"
                                value={form.price}
                                onChange={(e) => setForm({ ...form, price: e.target.value })}
                                placeholder="1000.00"
                                required
                            />
                            <Input
                                label="Minimum Quantity / Seats"
                                type="number"
                                min="1"
                                value={form.minQuantity}
                                onChange={(e) => setForm({ ...form, minQuantity: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                label="Availability Start Date"
                                type="date"
                                value={form.startDate}
                                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                                required
                            />
                            <Input
                                label="Availability End Date (Optional)"
                                type="date"
                                value={form.endDate}
                                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                            />
                        </div>
                    </div>
                </Card>

                {/* Lifecycle Rules Card */}
                <Card title="Subscription Lifecycle Rules" subtitle="The admin decides which actions are permitted on this plan.">
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.autoClose}
                                onChange={(e) => setForm({ ...form, autoClose: e.target.checked })}
                                className="h-4 w-4 rounded text-[#e04f2d] focus:ring-[#e04f2d]"
                            />
                            <div>
                                <div className="text-xs font-bold text-gray-900">Auto-Close on Plan End</div>
                                <div className="text-[11px] text-gray-500">Automatically close subscriptions when the plan reaches its end date.</div>
                            </div>
                        </label>

                        <label className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.allowEarlyClose}
                                onChange={(e) => setForm({ ...form, allowEarlyClose: e.target.checked })}
                                className="h-4 w-4 rounded text-[#e04f2d] focus:ring-[#e04f2d]"
                            />
                            <div>
                                <div className="text-xs font-bold text-gray-900">Allow Early Termination</div>
                                <div className="text-[11px] text-gray-500">Permit closing the subscription before the contract expiry date.</div>
                            </div>
                        </label>

                        <label className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.allowPause}
                                onChange={(e) => setForm({ ...form, allowPause: e.target.checked })}
                                className="h-4 w-4 rounded text-[#e04f2d] focus:ring-[#e04f2d]"
                            />
                            <div>
                                <div className="text-xs font-bold text-gray-900">Allow Pause</div>
                                <div className="text-[11px] text-gray-500">Customers or team can pause and resume active subscriptions without billing.</div>
                            </div>
                        </label>

                        <label className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.allowRenew}
                                onChange={(e) => setForm({ ...form, allowRenew: e.target.checked })}
                                className="h-4 w-4 rounded text-[#e04f2d] focus:ring-[#e04f2d]"
                            />
                            <div>
                                <div className="text-xs font-bold text-gray-900">Allow Renewal</div>
                                <div className="text-[11px] text-gray-500">Permit renewing the subscription upon expiration.</div>
                            </div>
                        </label>
                    </div>
                </Card>

                <div className="flex items-center justify-end gap-3">
                    <Link to="/plans">
                        <Button type="button" variant="secondary">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" loading={loading}>
                        {isEdit ? 'Save Changes' : 'Create Plan'}
                    </Button>
                </div>
            </form>
        </div>
    );
}

