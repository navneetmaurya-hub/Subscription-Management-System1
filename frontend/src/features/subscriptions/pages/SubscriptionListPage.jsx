import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Repeat, Eye } from 'lucide-react';
import { subscriptionsApi } from '../../../api/subscriptions.api';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/ui/Spinner';
import Table from '../../../components/ui/Table';
import EmptyState from '../../../components/ui/EmptyState';
import StatusBadge from '../../../components/common/StatusBadge';

export default function SubscriptionListPage() {
    const [subs, setSubs] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadSubs = async () => {
        setLoading(true);
        try {
            const res = await subscriptionsApi.getAll();
            setSubs(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSubs();
    }, []);

    const columns = [
        {
            header: 'Subscription #',
            accessor: 'number',
            cell: (row) => (
                <Link to={`/subscriptions/${row._id}`} className="font-bold text-gray-900 hover:text-[#e04f2d]">
                    {row.number}
                </Link>
            ),
        },
        {
            header: 'Customer',
            accessor: 'customer',
            cell: (row) => row.customer?.name || row.customer?.email || '—',
        },
        {
            header: 'Plan',
            accessor: 'plan',
            cell: (row) => (
                <span className="font-medium text-gray-900">{row.plan?.name || '—'}</span>
            ),
        },
        {
            header: 'Status',
            accessor: 'status',
            cell: (row) => <StatusBadge status={row.status} />,
        },
        {
            header: 'Start Date',
            accessor: 'startDate',
            cell: (row) => formatDate(row.startDate),
        },
        {
            header: 'Next Billing',
            accessor: 'nextBillingDate',
            cell: (row) => (row.nextBillingDate ? formatDate(row.nextBillingDate) : '—'),
        },
        {
            header: 'Subtotal',
            accessor: 'subtotal',
            cell: (row) => <span className="font-bold text-gray-900">{formatCurrency(row.subtotal)}</span>,
        },
        {
            header: 'Actions',
            cell: (row) => (
                <Link to={`/subscriptions/${row._id}`}>
                    <Button variant="secondary" size="sm" className="gap-1.5">
                        <Eye className="h-3.5 w-3.5" />
                        <span>Manage</span>
                    </Button>
                </Link>
            ),
        },
    ];

    if (loading) return <Spinner size="lg" />;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Subscriptions</h1>
                    <p className="text-xs text-gray-500 mt-1">Manage quotations, active contracts, and recurring cycles.</p>
                </div>
                <Link to="/subscriptions/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        <span>New Subscription</span>
                    </Button>
                </Link>
            </div>

            <Card>
                {subs.length === 0 ? (
                    <EmptyState
                        icon={Repeat}
                        title="No subscriptions recorded"
                        description="Start a new subscription from scratch or from a quotation template."
                        actionLabel="Create Subscription"
                        onAction={() => (window.location.href = '/subscriptions/new')}
                    />
                ) : (
                    <Table columns={columns} data={subs} />
                )}
            </Card>
        </div>
    );
}
