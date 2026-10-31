import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Repeat, CreditCard, Receipt, AlertTriangle, Filter } from 'lucide-react';
import { reportsApi } from '../../../api/reports.api';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Spinner from '../../../components/ui/Spinner';
import Table from '../../../components/ui/Table';
import StatCard from '../../../components/common/StatCard';

export default function ReportsPage() {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadReport = async () => {
        setLoading(true);
        try {
            const params = {};
            if (from) params.from = from;
            if (to) params.to = to;
            const res = await reportsApi.getSummary(params);
            setSummary(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReport();
    }, []);

    const handleFilter = (e) => {
        e.preventDefault();
        loadReport();
    };

    const overdueColumns = [
        { header: 'Invoice #', accessor: 'number', cell: (row) => <span className="font-bold text-gray-900">{row.number}</span> },
        { header: 'Customer', accessor: 'customer', cell: (row) => row.customer?.name || row.customer?.email || '—' },
        { header: 'Due Date', accessor: 'dueDate', cell: (row) => <span className="text-red-600 font-semibold">{formatDate(row.dueDate)}</span> },
        { header: 'Total', accessor: 'total', cell: (row) => formatCurrency(row.total) },
        { header: 'Balance Due', cell: (row) => <span className="font-bold text-red-600">{formatCurrency(row.total - (row.amountPaid || 0))}</span> },
        {
            header: 'Action',
            cell: (row) => (
                <Link to={`/invoices/${row._id}`} className="text-xs text-[#e04f2d] hover:underline font-semibold">
                    Open Invoice →
                </Link>
            ),
        },
    ];

    if (loading) return <Spinner size="lg" />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Finance Lead Summary</h1>
                    <p className="text-xs text-gray-500 mt-1">End-of-month review: active subscriptions, collected revenue, receivables & aging.</p>
                </div>

                <form onSubmit={handleFilter} className="flex items-center gap-2">
                    <Input
                        type="date"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="py-1.5 text-xs"
                    />
                    <span className="text-xs text-gray-400">to</span>
                    <Input
                        type="date"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="py-1.5 text-xs"
                    />
                    <Button type="submit" size="sm" variant="secondary" className="gap-1">
                        <Filter className="h-3.5 w-3.5" />
                        <span>Filter</span>
                    </Button>
                </form>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Active Subscriptions"
                    value={summary?.activeSubscriptions || 0}
                    subtitle="Generating cashflow"
                    icon={Repeat}
                />
                <StatCard
                    title="Revenue Collected"
                    value={formatCurrency(summary?.revenueCollected || 0)}
                    subtitle={`${summary?.paymentsCount || 0} payments received`}
                    icon={CreditCard}
                />
                <StatCard
                    title="Outstanding Receivables"
                    value={formatCurrency(summary?.outstandingAmount || 0)}
                    subtitle={`${summary?.outstandingInvoices || 0} unpaid invoices`}
                    icon={Receipt}
                />
                <StatCard
                    title="Overdue Invoices"
                    value={summary?.overdueInvoices?.length || 0}
                    subtitle="Past payment deadline"
                    icon={AlertTriangle}
                />
            </div>

            {/* Overdue table */}
            <Card
                title="Overdue Invoices Requiring Follow-up"
                subtitle="Chased before turning into lost revenue."
            >
                {summary?.overdueInvoices?.length === 0 ? (
                    <p className="text-xs text-emerald-600 font-semibold text-center py-6">
                        🎉 Excellent! There are no overdue invoices at this time.
                    </p>
                ) : (
                    <Table columns={overdueColumns} data={summary.overdueInvoices} />
                )}
            </Card>
        </div>
    );
}

