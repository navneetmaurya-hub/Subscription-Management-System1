import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Package, Edit, Trash2 } from 'lucide-react';
import { productsApi } from '../../../api/products.api';
import { formatCurrency } from '../../../utils/formatCurrency';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/ui/Spinner';
import Table from '../../../components/ui/Table';
import EmptyState from '../../../components/ui/EmptyState';
import Badge from '../../../components/ui/Badge';
import { useAuth } from '../../../hooks/useAuth';

export default function ProductListPage() {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const res = await productsApi.getAll();
            setProducts(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this product?')) return;
        try {
            await productsApi.delete(id);
            setProducts(products.filter((p) => p._id !== id));
        } catch (err) {
            alert(err.message);
        }
    };

    const columns = [
        {
            header: 'Product Name',
            accessor: 'name',
            cell: (row) => (
                <div>
                    <div className="font-semibold text-gray-900">{row.name}</div>
                    {row.notes && <div className="text-xs text-gray-400">{row.notes}</div>}
                </div>
            ),
        },
        {
            header: 'Type',
            accessor: 'type',
            cell: (row) => <Badge variant="orange">{row.type}</Badge>,
        },
        {
            header: 'Sales Price',
            accessor: 'salesPrice',
            cell: (row) => <span className="font-bold text-gray-900">{formatCurrency(row.salesPrice)}</span>,
        },
        {
            header: 'Variants',
            cell: (row) => (
                <div className="flex flex-wrap gap-1">
                    {row.variants?.length ? (
                        row.variants.map((v, i) => (
                            <Badge key={i} variant="gray" size="sm">
                                {v.attribute}: {v.value} (+{formatCurrency(v.extraPrice)})
                            </Badge>
                        ))
                    ) : (
                        <span className="text-gray-400 text-xs">None</span>
                    )}
                </div>
            ),
        },
        ...(isAdmin ? [
            {
                header: 'Actions',
                cell: (row) => (
                    <div className="flex items-center gap-2">
                        <Link to={`/products/${row._id}/edit`}>
                            <button className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                                <Edit className="h-4 w-4" />
                            </button>
                        </Link>
                        <button
                            onClick={() => handleDelete(row._id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                ),
            },
        ] : []),
    ];

    if (loading) return <Spinner size="lg" />;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Products & Add-ons</h1>
                    <p className="text-xs text-gray-500 mt-1">Manage catalog software, add-ons, and pricing variants.</p>
                </div>
                {isAdmin && (
                    <Link to="/products/new">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            <span>Add Product</span>
                        </Button>
                    </Link>
                )}
            </div>

            <Card>
                {products.length === 0 ? (
                    <EmptyState
                        icon={Package}
                        title="No products yet"
                        description="Add your first software license or add-on product."
                        actionLabel={isAdmin ? 'Add Product' : undefined}
                        onAction={() => (window.location.href = '/products/new')}
                    />
                ) : (
                    <Table columns={columns} data={products} />
                )}
            </Card>
        </div>
    );
}

