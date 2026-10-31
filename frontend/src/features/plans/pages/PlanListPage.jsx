import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, CalendarDays, Edit, Trash2 } from 'lucide-react';
import { plansApi } from '../../../api/plans.api';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/ui/Spinner';
import Table from '../../../components/ui/Table';
import EmptyState from '../../../components/ui/EmptyState';
import Badge from '../../../components/ui/Badge';
import { useAuth } from '../../../hooks/useAuth';

export default function PlanListPage() {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadPlans = async () => {
        setLoading(true);
        try {
            const res = await plansApi.getAll();
            setPlans(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPlans();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this plan?')) return;
        try {
            await plansApi.delete(id);
            setPlans(plans.filter((p) => p._id !== id));
        } catch (err) {
            alert(err.message);
        }
    };

    const columns = [
        {
            header: 'Plan Name',
            accessor: 'name',
            cell: (row) => <span className="font-semibold text-gray-900">{row.name}</span>,
        },
        {
            header: 'Billing Frequency',
            accessor: 'billingPeriod',
            cell: (row) => <Badge variant="orange">{row.billingPeriod}</Badge>,
        },
        {
            header: 'Price',
            accessor: 'price',
            cell: (row) => <span className="font-bold text-gray-900">{formatCurrency(row.price)}</span>,
        },
        {
            header: 'Min Qty',
            accessor: 'minQuantity',
        },
        {
            header: 'Dates',
            cell: (row) => (
                <span className="text-xs text-gray-500">
                    {formatDate(row.startDate)} {row.endDate ? `→ ${formatDate(row.endDate)}` : '(Ongoing)'}
                </span>
            ),
        },
        {
            header: 'Rules',
            cell: (row) => (
                <div className="flex flex-wrap gap-1">
                    {row.autoClose && <Badge variant="red" size="sm">Auto-Close</Badge>}
                    {row.allowPause && <Badge variant="purple" size="sm">Pause OK</Badge>}
                    {row.allowEarlyClose && <Badge variant="amber" size="sm">Early Close</Badge>}
                    {row.allowRenew && <Badge variant="green" size="sm">Renew OK</Badge>}
                </div>
            ),
        },
        ...(isAdmin ? [
            {
                header: 'Actions',
                cell: (row) => (
                    <div className="flex items-center gap-2">
                        <Link to={`/plans/${row._id}/edit`}>
                            <button className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                                <Edit className="h-4 w-4" />
                            </button>
                        </Link>
                        <button
                            onClick={() => handleDelete(row._id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                ),
            },
        ] : []),
    ];

    if (loading) return <Spinner size="lg" />;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Subscription Plans</h1>
                    <p className="text-xs text-gray-500 mt-1">Configure billing cycles, minimum seats, and termination rules.</p>
                </div>
                {isAdmin && (
                    <Link to="/plans/new">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            <span>Create Plan</span>
                        </Button>
                    </Link>
                )}
            </div>

            <Card>
                {plans.length === 0 ? (
                    <EmptyState
                        icon={CalendarDays}
                        title="No plans configured"
                        description="Create your first daily, weekly, monthly, or yearly billing plan."
                        actionLabel={isAdmin ? 'Create Plan' : undefined}
                        onAction={() => (window.location.href = '/plans/new')}
                    />
                ) : (
                    <Table columns={columns} data={plans} />
                )}
            </Card>
        </div>
    );
}

