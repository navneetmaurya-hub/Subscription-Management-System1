import React from 'react';
import Badge from '../ui/Badge';

export default function StatusBadge({ status = '' }) {
    const s = String(status).toLowerCase();

    const config = {
        // Subscriptions
        draft: { variant: 'gray', label: 'Draft' },
        quotation: { variant: 'blue', label: 'Quotation' },
        confirmed: { variant: 'amber', label: 'Confirmed' },
        active: { variant: 'green', label: 'Active' },
        closed: { variant: 'gray', label: 'Closed' },
        paused: { variant: 'purple', label: 'Paused' },

        // Invoices
        paid: { variant: 'green', label: 'Paid' },
        cancelled: { variant: 'red', label: 'Cancelled' },
        overdue: { variant: 'red', label: 'Overdue' },

        // Users
        admin: { variant: 'purple', label: 'Admin' },
        staff: { variant: 'orange', label: 'Staff' },
        customer: { variant: 'blue', label: 'Customer' },
    };

    const current = config[s] || { variant: 'gray', label: status };

    return (
        <Badge variant={current.variant} dot>
            {current.label}
        </Badge>
    );
}

