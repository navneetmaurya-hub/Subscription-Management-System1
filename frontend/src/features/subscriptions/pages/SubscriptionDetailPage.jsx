import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Receipt, AlertCircle, CheckCircle } from 'lucide-react';
import { subscriptionsApi } from '../../../api/subscriptions.api';
import { invoicesApi } from '../../../api/invoices.api';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/ui/Spinner';
import StatusBadge from '../../../components/common/StatusBadge';

export default function SubscriptionDetailPage() {
    const { id } = useParams();
    const [sub, setSub] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [notice, setNotice] = useState('');
    const [error, setError] = useState('');

    const loadSub = async () => {
        setLoading(true);
        try {
            const res = await subscriptionsApi.getById(id);
            setSub(res.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSub();
    }, [id]);

    const handleStatusTransition = async (nextStatus) => {
        setActionLoading(true);
        setError('');
        setNotice('');
        try {
            await subscriptionsApi.changeStatus(id, nextStatus);
            setNotice(`Status moved to ${nextStatus}`);
            await loadSub();
        } catch (err) {
            setError(err.message || 'Status change failed');
        } finally {
            setActionLoading(false);
        }
    };

    const handleGenerateInvoice = async () => {
        setActionLoading(true);
        setError('');
        setNotice('');
        try {
            const res = await invoicesApi.generate(id);
            setNotice(`Invoice ${res.data?.number} successfully generated!`);
            await loadSub();
        } catch (err) {
            setError(err.message || 'Invoice generation failed');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <Spinner size="lg" />;
    if (!sub) return <div className="text-center p-8">Subscription not found</div>;

    const steps = ['draft', 'quotation', 'confirmed', 'active', 'closed'];
    const currentStepIndex = steps.indexOf(sub.status);

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link to="/subscriptions" className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">{sub.number}</h1>
                            <StatusBadge status={sub.status} />
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Customer: <strong>{sub.customer?.name || sub.customer?.email}</strong> • Plan: <strong>{sub.plan?.name}</strong>
                        </p>
                    </div>
                </div>

                {/* Status Advancement Actions */}
                <div className="flex flex-wrap items-center gap-2">
                    {sub.status === 'draft' && (
                        <Button
                            variant="primary"
                            size="sm"
                            loading={actionLoading}
                            onClick={() => handleStatusTransition('quotation')}
                        >
                            Mark as Quotation →
                        </Button>
                    )}
                    {sub.status === 'quotation' && (
                        <Button
                            variant="primary"
                            size="sm"
                            loading={actionLoading}
                            onClick={() => handleStatusTransition('confirmed')}
                        >
                            Confirm Quotation →
                        </Button>
                    )}
                    {sub.status === 'confirmed' && (
                        <Button
                            variant="primary"
                            size="sm"
                            loading={actionLoading}
                            onClick={() => handleStatusTransition('active')}
                        >
                            Activate Subscription →
                        </Button>
                    )}
                    {sub.status === 'active' && (
                        <>
                            <Button
                                variant="secondary"
                                size="sm"
                                loading={actionLoading}
                                onClick={handleGenerateInvoice}
                                className="gap-1.5"
                            >
                                <Receipt className="h-4 w-4 text-[#e04f2d]" />
                                <span>Generate Invoice</span>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                loading={actionLoading}
                                onClick={() => handleStatusTransition('closed')}
                            >
                                Close Subscription
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {notice && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span>{notice}</span>
                </div>
            )}
            {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span>{error}</span>
                </div>
            )}

            {/* Stepper */}
            <Card title="Subscription Lifecycle Flow">
                <div className="flex items-center justify-between relative px-2">
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
                    {steps.map((st, i) => {
                        const isDone = i <= currentStepIndex;
                        const isCurrent = i === currentStepIndex;
                        return (
                            <div key={st} className="relative z-10 flex flex-col items-center">
                                <div
                                    className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                        isCurrent
                                            ? 'bg-[#e04f2d] text-white ring-4 ring-orange-100'
                                            : isDone
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-white border-2 border-gray-300 text-gray-400'
                                    }`}
                                >
                                    {i + 1}
                                </div>
                                <span
                                    className={`text-[11px] font-semibold mt-2 capitalize ${
                                        isCurrent ? 'text-[#e04f2d]' : isDone ? 'text-gray-900' : 'text-gray-400'
                                    }`}
                                >
                                    {st}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </Card>

            {/* Details & Lines */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="Contract Details" className="md:col-span-1">
                    <div className="space-y-3 text-xs">
                        <div>
                            <span className="text-gray-400 block font-medium">Customer</span>
                            <span className="font-bold text-gray-900">{sub.customer?.name}</span>
                            <span className="text-gray-500 block">{sub.customer?.email}</span>
                        </div>
                        <div>
                            <span className="text-gray-400 block font-medium">Plan</span>
                            <span className="font-bold text-gray-900">{sub.plan?.name}</span>
                        </div>
                        <div>
                            <span className="text-gray-400 block font-medium">Start Date</span>
                            <span className="font-semibold text-gray-900">{formatDate(sub.startDate)}</span>
                        </div>
                        <div>
                            <span className="text-gray-400 block font-medium">Expiry Date</span>
                            <span className="font-semibold text-gray-900">{sub.expiryDate ? formatDate(sub.expiryDate) : 'Ongoing'}</span>
                        </div>
                        <div>
                            <span className="text-gray-400 block font-medium">Payment Terms</span>
                            <span className="font-semibold text-gray-900">{sub.paymentTerms || 'Immediate'}</span>
                        </div>
                        <div>
                            <span className="text-gray-400 block font-medium">Next Billing Date</span>
                            <span className="font-semibold text-orange-600">{sub.nextBillingDate ? formatDate(sub.nextBillingDate) : 'Not scheduled'}</span>
                        </div>
                    </div>
                </Card>

                <Card title="Order Lines & Items" className="md:col-span-2">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider pb-2">
                                    <th className="py-2">Item / Product</th>
                                    <th className="py-2">Variant</th>
                                    <th className="py-2 text-right">Qty</th>
                                    <th className="py-2 text-right">Unit Price</th>
                                    <th className="py-2 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {sub.lines?.map((line, i) => (
                                    <tr key={i} className="py-2.5">
                                        <td className="py-2.5 font-medium text-gray-900">
                                            {line.product?.name || 'Line Item'}
                                        </td>
                                        <td className="py-2.5 text-gray-500">
                                            {line.variant?.attribute ? `${line.variant.attribute}: ${line.variant.value}` : '—'}
                                        </td>
                                        <td className="py-2.5 text-right font-medium">{line.quantity}</td>
                                        <td className="py-2.5 text-right">{formatCurrency(line.unitPrice)}</td>
                                        <td className="py-2.5 text-right font-bold text-gray-900">{formatCurrency(line.amount)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                        <div className="text-right space-y-1">
                            <span className="text-xs text-gray-500">Subtotal</span>
                            <div className="text-xl font-extrabold text-gray-900">{formatCurrency(sub.subtotal)}</div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

