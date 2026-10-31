import React, { useEffect, useState } from 'react';
import { CreditCard } from 'lucide-react';
import { paymentsApi } from '../../../api/payments.api';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';
import Card from '../../../components/ui/Card';
import Spinner from '../../../components/ui/Spinner';
import Table from '../../../components/ui/Table';
import EmptyState from '../../../components/ui/EmptyState';
import Badge from '../../../components/ui/Badge';

export default function PaymentListPage() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadPayments = async () => {
        setLoading(true);
        try {
            const res = await paymentsApi.getAll();
            setPayments(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPayments();
    }, []);

    const columns = [
        {
            header: 'Date',
            accessor: 'date',
            cell: (row) => formatDate(row.date),
        },
        {
            header: 'Invoice #',
            accessor: 'invoice',
            cell: (row) => <span className="font-bold text-gray-900">{row.invoice?.number || '—'}</span>,
        },
        {
            header: 'Customer',
            accessor: 'customer',
            cell: (row) => row.customer?.name || row.customer?.email || '—',
        },
        {
            header: 'Method',
            accessor: 'method',
            cell: (row) => <Badge variant="orange">{row.method?.replace('_', ' ')}</Badge>,
        },
        {
            header: 'Amount Received',
            accessor: 'amount',
            cell: (row) => <span className="font-extrabold text-emerald-600">{formatCurrency(row.amount)}</span>,
        },
        {
            header: 'Note',
            accessor: 'note',
            cell: (row) => <span className="text-xs text-gray-500">{row.note || '—'}</span>,
        },
    ];

    if (loading) return <Spinner size="lg" />;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Payment Transactions</h1>
                <p className="text-xs text-gray-500 mt-1">Audit log of all incoming customer payments against invoices.</p>
            </div>

            <Card>
                {payments.length === 0 ? (
                    <EmptyState
                        icon={CreditCard}
                        title="No payments recorded"
                        description="Payments will appear here when recorded against confirmed invoices."
                    />
                ) : (
                    <Table columns={columns} data={payments} />
                )}
            </Card>
        </div>
    );
}

