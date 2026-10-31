import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { discountsApi } from '../../../api/discounts.api';
import { productsApi } from '../../../api/products.api';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

export default function DiscountFormPage() {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({
        name: '',
        type: 'percentage',
        value: '',
        minPurchase: 0,
        minQuantity: 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        usageLimit: '',
        appliesTo: 'subscription',
        products: [],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        productsApi.getAll().then((res) => setProducts(res.data || []));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const payload = {
            ...form,
            value: Number(form.value),
            minPurchase: Number(form.minPurchase || 0),
            minQuantity: Number(form.minQuantity || 0),
            usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
            endDate: form.endDate ? new Date(form.endDate) : undefined,
        };

        try {
            await discountsApi.create(payload);
            navigate('/discounts');
        } catch (err) {
            setError(err.message || 'Failed to save discount');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
                <Link to="/discounts" className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Create Discount Rule</h1>
                    <p className="text-xs text-gray-500 mt-0.5">Admin-only pricing concession with usage limits and product filters.</p>
                </div>
            </div>

            {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card title="Discount Parameters">
                    <div className="space-y-4">
                        <Input
                            label="Discount Rule Name"
                            placeholder="e.g. Volume Seats Discount 20%"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Select
                                label="Discount Type"
                                value={form.type}
                                onChange={(e) => setForm({ ...form, type: e.target.value })}
                                options={[
                                    { label: 'Percentage (%)', value: 'percentage' },
                                    { label: 'Fixed Amount ($)', value: 'fixed' },
                                ]}
                                required
                            />
                            <Input
                                label="Discount Value"
                                type="number"
                                step="0.01"
                                placeholder={form.type === 'percentage' ? '20' : '150.00'}
                                value={form.value}
                                onChange={(e) => setForm({ ...form, value: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Select
                                label="Applies To"
                                value={form.appliesTo}
                                onChange={(e) => setForm({ ...form, appliesTo: e.target.value })}
                                options={[
                                    { label: 'Whole Subscription Total', value: 'subscription' },
                                    { label: 'Specific Products', value: 'product' },
                                ]}
                                required
                            />
                            <Input
                                label="Usage Limit (Max redemptions)"
                                type="number"
                                placeholder="e.g. 50 (or leave empty for infinite)"
                                value={form.usageLimit}
                                onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Minimum Purchase ($)"
                                type="number"
                                step="0.01"
                                value={form.minPurchase}
                                onChange={(e) => setForm({ ...form, minPurchase: e.target.value })}
                            />
                            <Input
                                label="Minimum Quantity / Seats"
                                type="number"
                                value={form.minQuantity}
                                onChange={(e) => setForm({ ...form, minQuantity: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Start Date"
                                type="date"
                                value={form.startDate}
                                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                                required
                            />
                            <Input
                                label="End Date (Optional)"
                                type="date"
                                value={form.endDate}
                                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                            />
                        </div>
                    </div>
                </Card>

                <div className="flex items-center justify-end gap-3">
                    <Link to="/discounts">
                        <Button type="button" variant="secondary">Cancel</Button>
                    </Link>
                    <Button type="submit" loading={loading}>Save Discount Rule</Button>
                </div>
            </form>
        </div>
    );
}

