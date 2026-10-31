import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { subscriptionsApi } from '../../../api/subscriptions.api';
import { templatesApi } from '../../../api/templates.api';
import { usersApi } from '../../../api/users.api';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Spinner from '../../../components/ui/Spinner';

export default function SubscriptionFormPage() {
    const navigate = useNavigate();

    const [templates, setTemplates] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [customer, setCustomer] = useState('');
    const [paymentTerms, setPaymentTerms] = useState('Net 15');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        Promise.all([
            templatesApi.getAll(),
            usersApi.getAll({ role: 'customer' }),
        ])
            .then(([tplRes, usersRes]) => {
                setTemplates(tplRes.data || []);
                setCustomers(usersRes.data || []);
                if (tplRes.data?.[0]) setSelectedTemplate(tplRes.data[0]._id);
                if (usersRes.data?.[0]) setCustomer(usersRes.data[0]._id);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!selectedTemplate) {
            setError('Please choose a quotation template');
            return;
        }
        if (!customer) {
            setError('Please select a customer');
            return;
        }

        setSubmitting(true);
        try {
            const res = await subscriptionsApi.createFromTemplate(selectedTemplate, {
                customer,
                startDate,
                paymentTerms,
            });
            navigate(`/subscriptions/${res.data?._id}`);
        } catch (err) {
            setError(err.message || 'Failed to create subscription');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Spinner size="lg" />;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
                <Link to="/subscriptions" className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Create Subscription</h1>
                    <p className="text-xs text-gray-500 mt-0.5">Start an offer from a pre-configured Quotation Template.</p>
                </div>
            </div>

            {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card
                    title="Quotation Template Selection"
                    subtitle="Templates automatically include pre-selected plans, product lines, and validity periods."
                >
                    <div className="space-y-4">
                        <Select
                            label="Choose Quotation Template"
                            value={selectedTemplate}
                            onChange={(e) => setSelectedTemplate(e.target.value)}
                            options={templates.map((t) => ({ label: `${t.name} (${t.validityDays} days validity)`, value: t._id }))}
                            required
                        />

                        <Select
                            label="Assign Customer"
                            value={customer}
                            onChange={(e) => setCustomer(e.target.value)}
                            options={customers.map((c) => ({ label: `${c.name} (${c.email})`, value: c._id }))}
                            required
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                label="Start Date"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                            />
                            <Select
                                label="Payment Terms"
                                value={paymentTerms}
                                onChange={(e) => setPaymentTerms(e.target.value)}
                                options={[
                                    { label: 'Immediate Payment', value: 'Immediate' },
                                    { label: 'Net 15 Days', value: 'Net 15' },
                                    { label: 'Net 30 Days', value: 'Net 30' },
                                    { label: 'End of Month', value: 'EOM' },
                                ]}
                            />
                        </div>
                    </div>
                </Card>

                <div className="flex items-center justify-end gap-3">
                    <Link to="/subscriptions">
                        <Button type="button" variant="secondary">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" loading={submitting} className="gap-2">
                        <Sparkles className="h-4 w-4" />
                        <span>Generate Subscription</span>
                    </Button>
                </div>
            </form>
        </div>
    );
}

