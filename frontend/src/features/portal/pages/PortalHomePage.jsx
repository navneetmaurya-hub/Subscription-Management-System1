import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Repeat, Receipt, ArrowRight, ShieldCheck } from 'lucide-react';
import { subscriptionsApi } from '../../../api/subscriptions.api';
import { invoicesApi } from '../../../api/invoices.api';
import { useAuth } from '../../../hooks/useAuth';
import { formatCurrency } from '../../../utils/formatCurrency';
import Card from '../../../components/ui/Card';
import StatusBadge from '../../../components/common/StatusBadge';
import Table from '../../../components/ui/Table';
import Spinner from '../../../components/ui/Spinner';

export default function PortalHomePage() {
    const { user } = useAuth();
    const [subs, setSubs] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            subscriptionsApi.getAll({ limit: 5 }),
            invoicesApi.getAll({ limit: 5 }),
        ])
            .then(([sRes, iRes]) => {
                setSubs(sRes.data || []);
                setInvoices(iRes.data || []);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Spinner size="lg" />;

    const subColumns = [
        { header: 'Subscription #', accessor: 'number', cell: (row) => <span className="font-bold text-gray-900">{row.number}</span> },
        { header: 'Plan', accessor: 'plan', cell: (row) => row.plan?.name || '—' },
        { header: 'Status', accessor: 'status', cell: (row) => <StatusBadge status={row.status} /> },
        { header: 'Amount', accessor: 'subtotal', cell: (row) => <span className="font-bold">{formatCurrency(row.subtotal)}</span> },
    ];

    const invColumns = [
        { header: 'Invoice #', accessor: 'number', cell: (row) => <span className="font-bold text-gray-900">{row.number}</span> },
        { header: 'Status', accessor: 'status', cell: (row) => <StatusBadge status={row.status} /> },
        { header: 'Total', accessor: 'total', cell: (row) => formatCurrency(row.total) },
        {
            header: 'Balance',
            cell: (row) => (
                <span className={row.total - (row.amountPaid || 0) > 0 ? 'text-[#e04f2d] font-bold' : 'text-emerald-600'}>
                    {formatCurrency(row.total - (row.amountPaid || 0))}
                </span>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-500 to-[#e04f2d] text-white flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black tracking-tight">Welcome, {user?.name}!</h1>
                    <p className="text-xs text-orange-100 mt-1">Manage your active software subscriptions and invoices directly from this portal.</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <ShieldCheck className="h-6 w-6 text-white" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card
                    title="My Subscriptions"
                    subtitle="Software licenses and add-on plans"
                    action={
                        <Link to="/portal/subscriptions" className="text-xs font-semibold text-[#e04f2d] hover:underline flex items-center gap-1">
                            <span>View All</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    }
                >
                    {subs.length === 0 ? (
                        <p className="text-xs text-gray-400 py-4 text-center">No subscriptions active.</p>
                    ) : (
                        <Table columns={subColumns} data={subs} />
                    )}
                </Card>

                <Card
                    title="My Invoices"
                    subtitle="Billing statements and payments"
                    action={
                        <Link to="/portal/invoices" className="text-xs font-semibold text-[#e04f2d] hover:underline flex items-center gap-1">
                            <span>View All</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    }
                >
                    {invoices.length === 0 ? (
                        <p className="text-xs text-gray-400 py-4 text-center">No invoices generated yet.</p>
                    ) : (
                        <Table columns={invColumns} data={invoices} />
                    )}
                </Card>
            </div>
        </div>
    );
}

