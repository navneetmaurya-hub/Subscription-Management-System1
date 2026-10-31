import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Printer, Send, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';
import { invoicesApi } from '../../../api/invoices.api';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/ui/Spinner';
import StatusBadge from '../../../components/common/StatusBadge';
import RecordPaymentModal from '../../payments/components/RecordPaymentModal';

export default function InvoiceDetailPage() {
    const { id } = useParams();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [notice, setNotice] = useState('');
    const [error, setError] = useState('');

    const loadInvoice = async () => {
        setLoading(true);
        try {
            const res = await invoicesApi.getById(id);
            setInvoice(res.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInvoice();
    }, [id]);

    const handleConfirm = async () => {
        setActionLoading(true);
        setError('');
        try {
            await invoicesApi.changeStatus(id, 'confirmed');
            setNotice('Invoice marked as Confirmed');
            await loadInvoice();
        } catch (err) {
            setError(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleSend = async () => {
        setActionLoading(true);
        setError('');
        try {
            await invoicesApi.send(id);
            setNotice('Invoice sent to customer email');
            await loadInvoice();
        } catch (err) {
            setError(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <Spinner size="lg" />;
    if (!invoice) return <div className="text-center p-8">Invoice not found</div>;

    const remainingDue = +(invoice.total - (invoice.amountPaid || 0)).toFixed(2);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header / Actions bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
                <div className="flex items-center gap-3">
                    <Link to="/invoices" className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">{invoice.number}</h1>
                            <StatusBadge status={invoice.status} />
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Subscription: <Link to={`/subscriptions/${invoice.subscription?._id}`} className="underline font-semibold">{invoice.subscription?.number || 'View'}</Link>
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Button variant="secondary" size="sm" onClick={() => window.print()} className="gap-1.5">
                        <Printer className="h-4 w-4 text-gray-500" />
                        <span>Print</span>
                    </Button>

                    <Button variant="secondary" size="sm" loading={actionLoading} onClick={handleSend} className="gap-1.5">
                        <Send className="h-4 w-4 text-gray-500" />
                        <span>Send</span>
                    </Button>

                    {invoice.status === 'draft' && (
                        <Button size="sm" loading={actionLoading} onClick={handleConfirm}>
                            Confirm Invoice →
                        </Button>
                    )}

                    {invoice.status === 'confirmed' && (
                        <Button
                            size="sm"
                            onClick={() => setPaymentModalOpen(true)}
                            className="gap-1.5"
                        >
                            <CreditCard className="h-4 w-4" />
                            <span>Record Payment</span>
                        </Button>
                    )}
                </div>
            </div>

            {notice && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 print:hidden">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>{notice}</span>
                </div>
            )}
            {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2 print:hidden">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span>{error}</span>
                </div>
            )}

            {/* Printable Invoice Sheet */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-8 sm:p-12 space-y-8">
                {/* Invoice Top Header */}
                <div className="flex justify-between items-start border-b border-gray-100 pb-8">
                    <div>
                        <div className="flex items-center gap-2 font-bold text-xl text-gray-900 tracking-tight">
                            Bright<span className="text-[#e04f2d]">loop</span> ERP
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Subscription Billing & Invoicing Engine</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Invoice</div>
                        <div className="text-2xl font-black text-gray-900 mt-0.5">{invoice.number}</div>
                        <div className="mt-1">
                            <StatusBadge status={invoice.status} />
                        </div>
                    </div>
                </div>

                {/* Bill To & Dates Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
                    <div>
                        <span className="text-gray-400 font-semibold uppercase tracking-wider block mb-1">Billed To</span>
                        <div className="font-bold text-gray-900 text-sm">{invoice.customer?.name}</div>
                        <div className="text-gray-500 mt-0.5">{invoice.customer?.email}</div>
                        {invoice.customer?.company && <div className="text-gray-500">{invoice.customer.company}</div>}
                    </div>

                    <div>
                        <span className="text-gray-400 font-semibold uppercase tracking-wider block mb-1">Invoice Date</span>
                        <div className="font-bold text-gray-900">{formatDate(invoice.invoiceDate)}</div>
                    </div>

                    <div>
                        <span className="text-gray-400 font-semibold uppercase tracking-wider block mb-1">Payment Due Date</span>
                        <div className="font-bold text-gray-900">{formatDate(invoice.dueDate)}</div>
                    </div>

                    <div>
                        <span className="text-gray-400 font-semibold uppercase tracking-wider block mb-1">Billing Period</span>
                        <div className="font-bold text-gray-900">
                            {formatDate(invoice.periodStart)} – {formatDate(invoice.periodEnd)}
                        </div>
                    </div>
                </div>

                {/* Line Items Table */}
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider">
                                <th className="py-3 px-4">Description</th>
                                <th className="py-3 px-4 text-right">Quantity</th>
                                <th className="py-3 px-4 text-right">Unit Price</th>
                                <th className="py-3 px-4 text-right">Tax</th>
                                <th className="py-3 px-4 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {invoice.lines?.map((line, idx) => (
                                <tr key={idx}>
                                    <td className="py-3 px-4 font-semibold text-gray-900">
                                        {line.description || line.product?.name || `Item ${idx + 1}`}
                                    </td>
                                    <td className="py-3 px-4 text-right font-medium">{line.quantity}</td>
                                    <td className="py-3 px-4 text-right">{formatCurrency(line.unitPrice)}</td>
                                    <td className="py-3 px-4 text-right text-gray-500">{formatCurrency(line.taxAmount || 0)}</td>
                                    <td className="py-3 px-4 text-right font-bold text-gray-900">{formatCurrency(line.amount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals Summary */}
                <div className="flex justify-end pt-4">
                    <div className="w-full sm:w-72 space-y-2 text-xs">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span className="font-semibold">{formatCurrency(invoice.subtotal)}</span>
                        </div>

                        {invoice.taxes?.map((t, i) => (
                            <div key={i} className="flex justify-between text-gray-500">
                                <span>{t.name || 'Tax'}</span>
                                <span>+{formatCurrency(t.amount)}</span>
                            </div>
                        ))}

                        {invoice.discounts?.map((d, i) => (
                            <div key={i} className="flex justify-between text-emerald-600 font-medium">
                                <span>Discount ({d.name})</span>
                                <span>-{formatCurrency(d.amount)}</span>
                            </div>
                        ))}

                        <div className="h-px bg-gray-200 my-2" />

                        <div className="flex justify-between text-base font-extrabold text-gray-900">
                            <span>Total</span>
                            <span>{formatCurrency(invoice.total)}</span>
                        </div>

                        <div className="flex justify-between text-gray-600 pt-1">
                            <span>Amount Paid</span>
                            <span className="text-emerald-600 font-bold">{formatCurrency(invoice.amountPaid || 0)}</span>
                        </div>

                        <div className="flex justify-between text-sm font-bold text-gray-900 bg-orange-50/70 p-2 rounded-lg">
                            <span>Balance Due</span>
                            <span className={remainingDue > 0 ? 'text-[#e04f2d]' : 'text-emerald-700'}>
                                {formatCurrency(remainingDue)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Record Payment Modal */}
            <RecordPaymentModal
                isOpen={paymentModalOpen}
                onClose={() => setPaymentModalOpen(false)}
                invoice={invoice}
                onSuccess={loadInvoice}
            />
        </div>
    );
}

