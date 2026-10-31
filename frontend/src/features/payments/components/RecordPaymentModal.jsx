import React, { useState } from 'react';
import { CreditCard, CheckCircle2 } from 'lucide-react';
import { paymentsApi } from '../../../api/payments.api';
import { PAYMENT_METHODS } from '../../../utils/constants';
import { formatCurrency } from '../../../utils/formatCurrency';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

export default function RecordPaymentModal({ isOpen, onClose, invoice, onSuccess }) {
    if (!invoice) return null;

    const remainingDue = +(invoice.total - (invoice.amountPaid || 0)).toFixed(2);

    const [form, setForm] = useState({
        method: 'bank_transfer',
        amount: remainingDue,
        date: new Date().toISOString().split('T')[0],
        note: 'Customer settlement',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await paymentsApi.record({
                invoice: invoice._id,
                method: form.method,
                amount: Number(form.amount),
                date: form.date,
                note: form.note,
            });
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.message || 'Payment recording failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Record Payment for ${invoice.number}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="p-3.5 rounded-xl bg-orange-50/70 border border-orange-100 flex items-center justify-between text-xs">
                    <span className="text-gray-600 font-medium">Outstanding Balance:</span>
                    <span className="text-base font-extrabold text-[#e04f2d]">{formatCurrency(remainingDue)}</span>
                </div>

                {error && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                    <Select
                        label="Payment Method"
                        value={form.method}
                        onChange={(e) => setForm({ ...form, method: e.target.value })}
                        options={PAYMENT_METHODS}
                        required
                    />
                    <Input
                        label="Amount ($)"
                        type="number"
                        step="0.01"
                        max={remainingDue}
                        value={form.amount}
                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                        required
                    />
                </div>

                <Input
                    label="Payment Date"
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                />

                <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                        Payment Note / Reference
                    </label>
                    <textarea
                        rows={2}
                        className="block w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#e04f2d] focus:ring-2 focus:ring-orange-100"
                        value={form.note}
                        onChange={(e) => setForm({ ...form, note: e.target.value })}
                        placeholder="e.g. Bank transfer ref #12345"
                    />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={loading} className="gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Confirm Payment</span>
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

