import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { productsApi } from '../../../api/products.api';
import { PRODUCT_TYPES } from '../../../utils/constants';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

export default function ProductFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [form, setForm] = useState({
        name: '',
        type: 'software',
        salesPrice: '',
        costPrice: '',
        notes: '',
        variants: [],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEdit) {
            productsApi.getById(id)
                .then((res) => {
                    const p = res.data;
                    setForm({
                        name: p.name,
                        type: p.type,
                        salesPrice: p.salesPrice,
                        costPrice: p.costPrice || '',
                        notes: p.notes || '',
                        variants: p.variants || [],
                    });
                })
                .catch((err) => setError(err.message));
        }
    }, [id, isEdit]);

    const addVariant = () => {
        setForm({
            ...form,
            variants: [...form.variants, { attribute: 'Brand', value: 'Odoo', extraPrice: 560 }],
        });
    };

    const updateVariant = (index, field, value) => {
        const next = [...form.variants];
        next[index] = { ...next[index], [field]: value };
        setForm({ ...form, variants: next });
    };

    const removeVariant = (index) => {
        setForm({
            ...form,
            variants: form.variants.filter((_, i) => i !== index),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const payload = {
            ...form,
            salesPrice: Number(form.salesPrice),
            costPrice: Number(form.costPrice || 0),
            variants: form.variants.map((v) => ({
                ...v,
                extraPrice: Number(v.extraPrice || 0),
            })),
        };

        try {
            if (isEdit) {
                await productsApi.update(id, payload);
            } else {
                await productsApi.create(payload);
            }
            navigate('/products');
        } catch (err) {
            setError(err.message || 'Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
                <Link to="/products" className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                        {isEdit ? 'Edit Product' : 'New Product'}
                    </h1>
                    <p className="text-xs text-gray-500 mt-0.5">Configure software license, add-ons, or variant pricing.</p>
                </div>
            </div>

            {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card title="Product Details">
                    <div className="space-y-4">
                        <Input
                            label="Product Name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="e.g. Enterprise Cloud ERP"
                            required
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Select
                                label="Type"
                                value={form.type}
                                onChange={(e) => setForm({ ...form, type: e.target.value })}
                                options={PRODUCT_TYPES}
                                required
                            />
                            <Input
                                label="Sales Price ($)"
                                type="number"
                                step="0.01"
                                value={form.salesPrice}
                                onChange={(e) => setForm({ ...form, salesPrice: e.target.value })}
                                placeholder="1000.00"
                                required
                            />
                            <Input
                                label="Cost Price ($)"
                                type="number"
                                step="0.01"
                                value={form.costPrice}
                                onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
                                placeholder="400.00"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                                Notes & Description
                            </label>
                            <textarea
                                rows={3}
                                className="block w-full rounded-xl border border-gray-200 p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#e04f2d] focus:ring-2 focus:ring-orange-100"
                                value={form.notes}
                                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                placeholder="Details about this product or add-on..."
                            />
                        </div>
                    </div>
                </Card>

                {/* Variants Card (e.g. Brand: Odoo +560) */}
                <Card
                    title="Product Variants"
                    subtitle="Offer variants (e.g., brand, tier) with optional price adjustments."
                    action={
                        <Button type="button" variant="secondary" size="sm" onClick={addVariant} className="gap-1.5">
                            <Plus className="h-3.5 w-3.5" />
                            <span>Add Variant</span>
                        </Button>
                    }
                >
                    {form.variants.length === 0 ? (
                        <p className="text-xs text-gray-400 text-center py-4">No variants added. Click above to add one.</p>
                    ) : (
                        <div className="space-y-3">
                            {form.variants.map((v, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                    <Input
                                        placeholder="Attribute (e.g. Brand)"
                                        value={v.attribute}
                                        onChange={(e) => updateVariant(i, 'attribute', e.target.value)}
                                        required
                                    />
                                    <Input
                                        placeholder="Value (e.g. Odoo)"
                                        value={v.value}
                                        onChange={(e) => updateVariant(i, 'value', e.target.value)}
                                        required
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Extra Price (+560)"
                                        value={v.extraPrice}
                                        onChange={(e) => updateVariant(i, 'extraPrice', e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeVariant(i)}
                                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                <div className="flex items-center justify-end gap-3">
                    <Link to="/products">
                        <Button type="button" variant="secondary">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" loading={loading}>
                        {isEdit ? 'Save Changes' : 'Create Product'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
