import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { templatesApi } from '../../../api/templates.api';
import { plansApi } from '../../../api/plans.api';
import { productsApi } from '../../../api/products.api';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

export default function TemplateFormPage() {
    const navigate = useNavigate();

    const [plans, setPlans] = useState([]);
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({
        name: '',
        validityDays: 30,
        plan: '',
        lines: [],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        Promise.all([plansApi.getAll(), productsApi.getAll()]).then(([pRes, prRes]) => {
            setPlans(pRes.data || []);
            setProducts(prRes.data || []);
            if (pRes.data?.[0]) setForm((f) => ({ ...f, plan: pRes.data[0]._id }));
            if (prRes.data?.[0]) {
                const firstProd = prRes.data[0];
                const variant = firstProd.variants?.[0] ? { attribute: firstProd.variants[0].attribute, value: firstProd.variants[0].value } : undefined;
                setForm((f) => ({ ...f, lines: [{ product: firstProd._id, variant, quantity: 1 }] }));
            }
        });
    }, []);

    const addLine = () => {
        if (!products.length) return;
        const firstProd = products[0];
        const variant = firstProd.variants?.[0] ? { attribute: firstProd.variants[0].attribute, value: firstProd.variants[0].value } : undefined;
        setForm({
            ...form,
            lines: [...form.lines, { product: firstProd._id, variant, quantity: 1 }],
        });
    };

    const updateLine = (idx, field, val) => {
        const next = [...form.lines];
        next[idx] = { ...next[idx], [field]: val };
        setForm({ ...form, lines: next });
    };

    const removeLine = (idx) => {
        setForm({
            ...form,
            lines: form.lines.filter((_, i) => i !== idx),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await templatesApi.create({
                ...form,
                validityDays: Number(form.validityDays),
                lines: form.lines.map((l) => ({
                    ...l,
                    quantity: Number(l.quantity || 1),
                })),
            });
            navigate('/templates');
        } catch (err) {
            setError(err.message || 'Failed to save template');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
                <Link to="/templates" className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Create Quotation Template</h1>
                    <p className="text-xs text-gray-500 mt-0.5">Pre-bundle plans and products for quick offers.</p>
                </div>
            </div>

            {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card title="Template Setup">
                    <div className="space-y-4">
                        <Input
                            label="Template Name"
                            placeholder="e.g. Standard Business Software Offer"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Select
                                label="Default Subscription Plan"
                                value={form.plan}
                                onChange={(e) => setForm({ ...form, plan: e.target.value })}
                                options={plans.map((p) => ({ label: `${p.name} ($${p.price}/${p.billingPeriod})`, value: p._id }))}
                                required
                            />
                            <Input
                                label="Validity Days"
                                type="number"
                                min="1"
                                value={form.validityDays}
                                onChange={(e) => setForm({ ...form, validityDays: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                </Card>

                <Card
                    title="Pre-configured Products & Lines"
                    action={
                        <Button type="button" variant="secondary" size="sm" onClick={addLine} className="gap-1.5">
                            <Plus className="h-3.5 w-3.5" />
                            <span>Add Line</span>
                        </Button>
                    }
                >
                    <div className="space-y-3">
                        {form.lines.map((line, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                <Select
                                    value={line.product}
                                    onChange={(e) => updateLine(idx, 'product', e.target.value)}
                                    options={products.map((p) => ({ label: p.name, value: p._id }))}
                                    className="flex-1"
                                />
                                <Input
                                    type="number"
                                    min="1"
                                    placeholder="Qty"
                                    value={line.quantity}
                                    onChange={(e) => updateLine(idx, 'quantity', e.target.value)}
                                    className="w-24"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeLine(idx)}
                                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </Card>

                <div className="flex items-center justify-end gap-3">
                    <Link to="/templates">
                        <Button type="button" variant="secondary">Cancel</Button>
                    </Link>
                    <Button type="submit" loading={loading}>Save Template</Button>
                </div>
            </form>
        </div>
    );
}

