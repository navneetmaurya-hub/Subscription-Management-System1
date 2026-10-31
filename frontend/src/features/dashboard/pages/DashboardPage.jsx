import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Repeat,
    Receipt,
    CreditCard,
    AlertTriangle,
    Plus,
    Play,
    ArrowRight,
    TrendingUp,
} from 'lucide-react';
import { reportsApi } from '../../../api/reports.api';
import { subscriptionsApi } from '../../../api/subscriptions.api';
import { invoicesApi } from '../../../api/invoices.api';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';
import StatCard from '../../../components/common/StatCard';
import StatusBadge from '../../../components/common/StatusBadge';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/ui/Spinner';
import Table from '../../../components/ui/Table';

export default function DashboardPage() {
    const [summary, setSummary] = useState(null);
    const [recentSubs, setRecentSubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [billingLoading, setBillingLoading] = useState(false);
    const [billingNotice, setBillingNotice] = useState('');

    const loadData = async () => {
        setLoading(true);
        try {
            const [reportRes, subsRes] = await Promise.all([
                reportsApi.getSummary(),
                subscriptionsApi.getAll({ limit: 5 }),
            ]);
            setSummary(reportRes.data);
            setRecentSubs(subsRes.data || []);
        } catch (err) {
            console.error('Failed to load dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleRunBilling = async () => {
        setBillingLoading(true);
        setBillingNotice('');
        try {
            const res = await invoicesApi.runBilling();
            setBillingNotice(`Billing complete: Checked ${res.data.checked} subscriptions, generated ${res.data.created} invoices.`);
            await loadData();
        } catch (err) {
            setBillingNotice(`Billing run error: ${err.message}`);
        } finally {
            setBillingLoading(false);
        }
    };

    if (loading) return <Spinner size="lg" />;

    const overdueColumns = [
        { header: 'Invoice #', accessor: 'number', cell: (row) => <span className="font-semibold text-gray-900">{row.number}</span> },
        { header: 'Customer', accessor: 'customer', cell: (row) => row.customer?.name || row.customer?.email || '—' },
        { header: 'Due Date', accessor: 'dueDate', cell: (row) => <span className="text-rose-600 font-medium">{formatDate(row.dueDate)}</span> },
        { header: 'Amount Due', accessor: 'total', cell: (row) => <span className="font-semibold">{formatCurrency(row.total - (row.amountPaid || 0))}</span> },
        {
            header: 'Action',
            cell: (row) => (
                <Link to={`/invoices/${row._id}`} className="text-xs text-[#e04f2d] hover:underline font-semibold">
                    View & Pay →
                </Link>
            ),
        },
    ];

    const subColumns = [
        { header: 'Sub #', accessor: 'number', cell: (row) => <span className="font-semibold text-gray-900">{row.number}</span> },
        { header: 'Customer', accessor: 'customer', cell: (row) => row.customer?.name || '—' },
        { header: 'Plan', accessor: 'plan', cell: (row) => row.plan?.name || '—' },
        { header: 'Status', accessor: 'status', cell: (row) => <StatusBadge status={row.status} /> },
        { header: 'Start Date', accessor: 'startDate', cell: (row) => formatDate(row.startDate) },
        { header: 'Amount', accessor: 'subtotal', cell: (row) => formatCurrency(row.subtotal) },
    ];

    return (
        <div className="space-y-8">
            {/* Top Banner & Quick Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Operations Overview</h1>
                    <p className="text-xs text-gray-500 mt-1">Real-time recurring revenue, billing jobs, and subscription lifecycle.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    <Button
                        variant="secondary"
                        size="md"
                        loading={billingLoading}
                        onClick={handleRunBilling}
                        className="gap-2"
                    >
                        <Play className="h-4 w-4 text-[#e04f2d]" />
                        <span>Run Billing Cycle</span>
                    </Button>

                    <Link to="/subscriptions/new">
                        <Button size="md" className="gap-2">
                            <Plus className="h-4 w-4" />
                            <span>New Subscription</span>
                        </Button>
                    </Link>
                </div>
            </div>

            {billingNotice && (
                <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 text-xs text-[#e04f2d] font-medium flex items-center justify-between">
                    <span>{billingNotice}</span>
                    <button onClick={() => setBillingNotice('')} className="underline text-xs">Dismiss</button>
                </div>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Active Subscriptions"
                    value={summary?.activeSubscriptions || 0}
                    subtitle="Generating recurring billing"
                    icon={Repeat}
                />
                <StatCard
                    title="Revenue Collected"
                    value={formatCurrency(summary?.revenueCollected || 0)}
                    subtitle={`${summary?.paymentsCount || 0} settled transactions`}
                    icon={CreditCard}
                />
                <StatCard
                    title="Outstanding Receivables"
                    value={formatCurrency(summary?.outstandingAmount || 0)}
                    subtitle={`${summary?.outstandingInvoices || 0} unpaid confirmed invoices`}
                    icon={Receipt}
                />
                <StatCard
                    title="Overdue Invoices"
                    value={summary?.overdueInvoices?.length || 0}
                    subtitle="Action required by finance"
                    icon={AlertTriangle}
                />
            </div>

            {/* Overdue Invoices Alert Section */}
            {summary?.overdueInvoices?.length > 0 && (
                <Card
                    title="⚠️ Overdue Invoices Requiring Follow-up"
                    subtitle="These invoices have passed their payment due date."
                    className="border-red-200/80 bg-red-50/10"
                    action={
                        <Link to="/invoices?status=confirmed" className="text-xs font-semibold text-[#e04f2d] hover:underline">
                            View All Invoices →
                        </Link>
                    }
                >
                    <Table columns={overdueColumns} data={summary.overdueInvoices} />
                </Card>
            )}

            {/* Recent Subscriptions */}
            <Card
                title="Recent Subscriptions"
                subtitle="Latest active & quotation records"
                action={
                    <Link to="/subscriptions" className="text-xs font-semibold text-[#e04f2d] hover:underline">
                        View All Subscriptions →
                    </Link>
                }
            >
                <Table columns={subColumns} data={recentSubs} />
            </Card>
        </div>
    );
}
