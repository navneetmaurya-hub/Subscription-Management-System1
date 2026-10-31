import React, { useEffect, useState } from 'react';
import { Plus, Percent, Trash2 } from 'lucide-react';
import { taxesApi } from '../../../api/taxes.api';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Modal from '../../../components/ui/Modal';
import Spinner from '../../../components/ui/Spinner';
import Table from '../../../components/ui/Table';
import EmptyState from '../../../components/ui/EmptyState';
import Badge from '../../../components/ui/Badge';
import { useAuth } from '../../../hooks/useAuth';

export default function TaxListPage() {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    const [taxes, setTaxes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState({ name: '', type: 'percentage', rate: '' });
    const [submitting, setSubmitting] = useState(false);

    const loadTaxes = async () => {
        setLoading(true);
        try {
            const res = await taxesApi.getAll();
            setTaxes(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTaxes();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await taxesApi.create({ ...form, rate: Number(form.rate) });
            setForm({ name: '', type: 'percentage', rate: '' });
            setModalOpen(false);
            await loadTaxes();
        } catch (err) {
            alert(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete tax rule?')) return;
        try {
            await taxesApi.delete(id);
            setTaxes(taxes.filter((t) => t._id !== id));
        } catch (err) {
            alert(err.message);
        }
    };

    const columns = [
        { header: 'Tax Name', accessor: 'name', cell: (row) => <span className="font-semibold text-gray-900">{row.name}</span> },
        { header: 'Type', accessor: 'type', cell: (row) => <Badge variant="orange">{row.type}</Badge> },
        {
            header: 'Rate',
            accessor: 'rate',
            cell: (row) => <span className="font-bold text-gray-900">{row.rate}{row.type === 'percentage' ? '%' : ' (fixed)'}</span>,
        },
        ...(isAdmin ? [
            {
                header: 'Actions',
                cell: (row) => (
                    <button onClick={() => handleDelete(row._id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg">
                        <Trash2 className="h-4 w-4" />
                    </button>
                ),
            },
        ] : []),
    ];

    if (loading) return <Spinner size="lg" />;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Tax Rules</h1>
                    <p className="text-xs text-gray-500 mt-1">Configured taxes are automatically computed on invoices and line items.</p>
                </div>
                {isAdmin && (
                    <Button onClick={() => setModalOpen(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        <span>Add Tax Rule</span>
                    </Button>
                )}
            </div>

            <Card>
                {taxes.length === 0 ? (
                    <EmptyState
                        icon={Percent}
                        title="No taxes configured"
                        description="Add GST, VAT, or local sales taxes."
                        actionLabel={isAdmin ? 'Add Tax Rule' : undefined}
                        onAction={() => setModalOpen(true)}
                    />
                ) : (
                    <Table columns={columns} data={taxes} />
                )}
            </Card>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Tax Rule">
                <form onSubmit={handleCreate} className="space-y-4">
                    <Input
                        label="Tax Name"
                        placeholder="e.g. GST 18%"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <Select
                            label="Calculation Type"
                            value={form.type}
                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                            options={[
                                { label: 'Percentage (%)', value: 'percentage' },
                                { label: 'Fixed per unit ($)', value: 'fixed' },
                            ]}
                            required
                        />
                        <Input
                            label="Rate"
                            type="number"
                            step="0.01"
                            placeholder="18"
                            value={form.rate}
                            onChange={(e) => setForm({ ...form, rate: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button type="submit" loading={submitting}>Save Tax Rule</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

