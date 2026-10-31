import React, { useEffect, useState } from 'react';
import { Plus, UserCheck, Shield } from 'lucide-react';
import { usersApi } from '../../../api/users.api';
import { formatDate } from '../../../utils/formatDate';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/ui/Spinner';
import Table from '../../../components/ui/Table';
import EmptyState from '../../../components/ui/EmptyState';
import Badge from '../../../components/ui/Badge';
import AddStaffModal from '../components/AddStaffModal';

export default function StaffListPage() {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    const loadStaff = async () => {
        setLoading(true);
        try {
            const res = await usersApi.getAll({ role: 'staff' });
            setStaff(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStaff();
    }, []);

    const columns = [
        {
            header: 'Staff Member',
            accessor: 'name',
            cell: (row) => (
                <div>
                    <div className="font-semibold text-gray-900">{row.name}</div>
                    <div className="text-xs text-gray-400">{row.email}</div>
                </div>
            ),
        },
        {
            header: 'System Role',
            accessor: 'role',
            cell: (row) => <Badge variant="orange">{row.role}</Badge>,
        },
        {
            header: 'Created On',
            accessor: 'createdAt',
            cell: (row) => formatDate(row.createdAt),
        },
        {
            header: 'Status',
            accessor: 'isActive',
            cell: (row) => (
                <Badge variant={row.isActive ? 'green' : 'red'}>
                    {row.isActive ? 'Active' : 'Disabled'}
                </Badge>
            ),
        },
    ];

    if (loading) return <Spinner size="lg" />;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Staff Team</h1>
                    <p className="text-xs text-gray-500 mt-1">Admin access control: add internal staff members for day-to-day operations.</p>
                </div>
                <Button onClick={() => setModalOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    <span>Add Staff Member</span>
                </Button>
            </div>

            <Card>
                {staff.length === 0 ? (
                    <EmptyState
                        icon={UserCheck}
                        title="No staff members registered"
                        description="Only the administrator can invite and authorize internal staff."
                        actionLabel="Add Staff Member"
                        onAction={() => setModalOpen(true)}
                    />
                ) : (
                    <Table columns={columns} data={staff} />
                )}
            </Card>

            <AddStaffModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSuccess={loadStaff}
            />
        </div>
    );
}

