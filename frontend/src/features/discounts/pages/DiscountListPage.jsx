import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Tags, Trash2 } from 'lucide-react';
import { discountsApi } from '../../../api/discounts.api';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/ui/Spinner';
import Table from '../../../components/ui/Table';
import EmptyState from '../../../components/ui/EmptyState';
import Badge from '../../../components/ui/Badge';

export default function DiscountListPage() {
    const [discounts, setDiscounts] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadDiscounts = async () => {
        setLoading(true);
        try {
            const res = await discountsApi.getAll();
            setDiscounts(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDiscounts();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete discount rule?')) return;
        try {
            await discountsApi.delete(id);
            setDiscounts(discounts.filter((d) => d._id !== id));
        } catch (err) {
            alert(err.message);
        }
    };

    const columns = [
        { header: 'Discount Name', accessor: 'name', cell: (row) => <span className="font-semibold text-gray-900">{row.name}</span> },
        {
            header: 'Type & Value',
            cell: (row) => (
                <span className="font-bold text-gray-900">
                    {row.type === 'percentage' ? `${row.value}%` : formatCurrency(row.value)}
                </span>
            ),
        },
        { header: 'Applies To', accessor: 'appliesTo', cell: (row) => <Badge variant="orange">{row.appliesTo}</Badge> },
        {
            header: 'Criteria',
            cell: (row) => (
                <span className="text-xs text-gray-500">
                    Min ${row.minPurchase || 0} • Min {row.minQuantity || 0} seats
                </span>
            ),
        },
        {
            header: 'Usage Limit',
            cell: (row) => (
                <span className="text-xs text-gray-500">
                    {row.usedCount || 0} / {row.usageLimit || '∞'} used
                </span>
            ),
        },
        {
            header: 'Dates',
            cell: (row) => (
                <span className="text-xs text-gray-500">
                    {formatDate(row.startDate)} → {row.endDate ? formatDate(row.endDate) : 'Never'}
                </span>
            ),
        },
        {
            header: 'Actions',
            cell: (row) => (
                <button onClick={() => handleDelete(row._id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg">
                    <Trash2 className="h-4 w-4" />
                </button>
            ),
        },
    ];

    if (loading) return <Spinner size="lg" />;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Discounts & Promotions</h1>
                    <p className="text-xs text-gray-500 mt-1">Admin rules automatically applied to invoices until exhausted or expired.</p>
                </div>
                <Link to="/discounts/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        <span>Create Discount Rule</span>
                    </Button>
                </Link>
            </div>

            <Card>
                {discounts.length === 0 ? (
                    <EmptyState
                        icon={Tags}
                        title="No discount rules"
                        description="Configure fixed or percentage promotions with volume thresholds."
                        actionLabel="Create Discount"
                        onAction={() => (window.location.href = '/discounts/new')}
                    />
                ) : (
                    <Table columns={columns} data={discounts} />
                )}
            </Card>
        </div>
    );
}

