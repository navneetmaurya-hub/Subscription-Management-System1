import React, { useEffect, useState } from 'react';
import { subscriptionsApi } from '../../../api/subscriptions.api';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';
import Card from '../../../components/ui/Card';
import StatusBadge from '../../../components/common/StatusBadge';
import Table from '../../../components/ui/Table';
import Spinner from '../../../components/ui/Spinner';
import EmptyState from '../../../components/ui/EmptyState';
import { Repeat } from 'lucide-react';

export default function MySubscriptionsPage() {
    const [subs, setSubs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        subscriptionsApi.getAll()
            .then((res) => setSubs(res.data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const columns = [
        { header: 'Subscription #', accessor: 'number', cell: (row) => <span className="font-bold text-gray-900">{row.number}</span> },
        { header: 'Plan', accessor: 'plan', cell: (row) => row.plan?.name || '—' },
        { header: 'Status', accessor: 'status', cell: (row) => <StatusBadge status={row.status} /> },
        { header: 'Start Date', accessor: 'startDate', cell: (row) => formatDate(row.startDate) },
        { header: 'Next Renewal', accessor: 'nextBillingDate', cell: (row) => formatDate(row.nextBillingDate) },
        { header: 'Amount', accessor: 'subtotal', cell: (row) => <span className="font-bold text-gray-900">{formatCurrency(row.subtotal)}</span> },
    ];

    if (loading) return <Spinner size="lg" />;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">My Subscriptions</h1>
                <p className="text-xs text-gray-500 mt-1">Review your contracted plans, lines, and billing schedules.</p>
            </div>

            <Card>
                {subs.length === 0 ? (
                    <EmptyState
                        icon={Repeat}
                        title="No subscriptions found"
                        description="Contact sales or check quotation offers sent to your email."
                    />
                ) : (
                    <Table columns={columns} data={subs} />
                )}
            </Card>
        </div>
    );
}

