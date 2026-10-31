import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Receipt, Eye, Play } from 'lucide-react';
import { invoicesApi } from '../../../api/invoices.api';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/ui/Spinner';
import Table from '../../../components/ui/Table';
import EmptyState from '../../../components/ui/EmptyState';
import StatusBadge from '../../../components/common/StatusBadge';

export default function InvoiceListPage() {
    const [searchParams] = useSearchParams();
    const statusFilter = searchParams.get('status') || '';

    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [billingLoading, setBillingLoading] = useState(false);
    const [notice, setNotice] = useState('');

    const loadInvoices = async () => {
        setLoading(true);
        try {
            const params = statusFilter ? { status: statusFilter } : {};
            const res = await invoicesApi.getAll(params);
            setInvoices(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInvoices();
    }, [statusFilter]);

    const handleRunBilling = async () => {
        setBillingLoading(true);
        setNotice('');
        try {
            const res = await invoicesApi.runBilling();
            setNotice(`Billing run completed: Checked ${res.data.checked} subscriptions, generated ${res.data.created} invoices.`);
            await loadInvoices();
        } catch (err) {
            setNotice(`Error: ${err.message}`);
        } finally {
            setBillingLoading(false);
        }
    };

    const columns = [
        {
            header: 'Invoice #',
            accessor: 'number',
            cell: (row) => (
                <Link to={`/invoices/${row._id}`} className="font-bold text-gray-900 hover:text-[#e04f2d]">
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
            header: 'Status',
            accessor: 'status',
            cell: (row) => <StatusBadge status={row.status} />,
        },
        {
            header: 'Billing Period',
            cell: (row) => (
                <span className="text-xs text-gray-500">
                    {formatDate(row.periodStart)} → {formatDate(row.periodEnd)}
                </span>
            ),
        },
        {
            header: 'Due Date',
            accessor: 'dueDate',
            cell: (row) => formatDate(row.dueDate),
        },
        {
            header: 'Total',
            accessor: 'total',
            cell: (row) => <span className="font-bold text-gray-900">{formatCurrency(row.total)}</span>,
        },
        {
            header: 'Paid',
            accessor: 'amountPaid',
            cell: (row) => (
                <span className={row.amountPaid >= row.total ? 'text-emerald-600 font-bold' : 'text-gray-500'}>
                    {formatCurrency(row.amountPaid || 0)}
                </span>
            ),
        },
        {
            header: 'Actions',
            cell: (row) => (
                <Link to={`/invoices/${row._id}`}>
                    <Button variant="secondary" size="sm" className="gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        <span>View</span>
                    </Button>
                </Link>
            ),
        },
    ];

    if (loading) return <Spinner size="lg" />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Invoices</h1>
                    <p className="text-xs text-gray-500 mt-1">Automatic recurring invoices, tax calculations, and payment tracking.</p>
                </div>
                <Button
                    variant="primary"
                    loading={billingLoading}
                    onClick={handleRunBilling}
                    className="gap-2"
                >
                    <Play className="h-4 w-4" />
                    <span>Run Billing Cycle</span>
                </Button>
            </div>

            {notice && (
                <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200 text-xs text-[#e04f2d] font-medium flex items-center justify-between">
                    <span>{notice}</span>
                    <button onClick={() => setNotice('')} className="underline">Dismiss</button>
                </div>
            )}

            <Card>
                {invoices.length === 0 ? (
                    <EmptyState
                        icon={Receipt}
                        title="No invoices found"
                        description="Invoices will automatically generate on billing day or when you run a billing cycle."
                        actionLabel="Run Billing Cycle Now"
                        onAction={handleRunBilling}
                    />
                ) : (
                    <Table columns={columns} data={invoices} />
                )}
            </Card>
        </div>
    );
}

