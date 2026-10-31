export const ROLES = {
    ADMIN: 'admin',
    STAFF: 'staff',
    CUSTOMER: 'customer',
};

export const SUBSCRIPTION_STATUS = {
    DRAFT: 'draft',
    QUOTATION: 'quotation',
    CONFIRMED: 'confirmed',
    ACTIVE: 'active',
    CLOSED: 'closed',
};

export const INVOICE_STATUS = {
    DRAFT: 'draft',
    CONFIRMED: 'confirmed',
    PAID: 'paid',
    CANCELLED: 'cancelled',
};

export const BILLING_PERIODS = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Yearly', value: 'yearly' },
];

export const PAYMENT_METHODS = [
    { label: 'Bank Transfer', value: 'bank_transfer' },
    { label: 'Credit/Debit Card', value: 'card' },
    { label: 'UPI / Instant', value: 'upi' },
    { label: 'Cash', value: 'cash' },
    { label: 'Cheque', value: 'cheque' },
    { label: 'Other', value: 'other' },
];

export const PRODUCT_TYPES = [
    { label: 'Software License', value: 'software' },
    { label: 'Add-on Feature', value: 'addon' },
    { label: 'Service / Support', value: 'service' },
    { label: 'Physical Goods', value: 'goods' },
];
