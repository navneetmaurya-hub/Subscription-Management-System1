import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileSpreadsheet, Trash2 } from 'lucide-react';
import { templatesApi } from '../../../api/templates.api';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/ui/Spinner';
import Table from '../../../components/ui/Table';
import EmptyState from '../../../components/ui/EmptyState';
import Badge from '../../../components/ui/Badge';
import { useAuth } from '../../../hooks/useAuth';

export default function TemplateListPage() {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadTemplates = async () => {
        setLoading(true);
        try {
            const res = await templatesApi.getAll();
            setTemplates(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTemplates();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete quotation template?')) return;
        try {
            await templatesApi.delete(id);
            setTemplates(templates.filter((t) => t._id !== id));
        } catch (err) {
            alert(err.message);
        }
    };

    const columns = [
        { header: 'Template Name', accessor: 'name', cell: (row) => <span className="font-semibold text-gray-900">{row.name}</span> },
        { header: 'Associated Plan', accessor: 'plan', cell: (row) => <Badge variant="orange">{row.plan?.name || '—'}</Badge> },
        { header: 'Validity Days', accessor: 'validityDays', cell: (row) => <span>{row.validityDays} days</span> },
        {
            header: 'Product Lines',
            cell: (row) => (
                <span className="text-xs text-gray-500">
                    {row.lines?.length || 0} product line(s) pre-configured
                </span>
            ),
        },
        ...(isAdmin ? [
            {
                header: 'Actions',
                cell: (row) => (
                    <button onClick={() => handleDelete(row._id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg">
                        <Trash2 className="h-4 w-4" />
                    </button>
                ),
            },
        ] : []),
    ];

    if (loading) return <Spinner size="lg" />;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Quotation Templates</h1>
                    <p className="text-xs text-gray-500 mt-1">Pre-configured bundles used by sales reps to quickly dispatch valid customer offers.</p>
                </div>
                {isAdmin && (
                    <Link to="/templates/new">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            <span>Create Template</span>
                        </Button>
                    </Link>
                )}
            </div>

            <Card>
                {templates.length === 0 ? (
                    <EmptyState
                        icon={FileSpreadsheet}
                        title="No quotation templates"
                        description="Create standardized product & plan quotes for your sales team."
                        actionLabel={isAdmin ? 'Create Template' : undefined}
                        onAction={() => (window.location.href = '/templates/new')}
                    />
                ) : (
                    <Table columns={columns} data={templates} />
                )}
            </Card>
        </div>
    );
}

