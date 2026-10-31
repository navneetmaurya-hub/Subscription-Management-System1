module.exports = {
  ROLES: { ADMIN: 'admin', STAFF: 'staff', CUSTOMER: 'customer' },
  BILLING_PERIODS: ['daily', 'weekly', 'monthly', 'yearly'],
  SUBSCRIPTION_STATUS: ['draft', 'quotation', 'confirmed', 'active', 'closed'],
  SUBSCRIPTION_FLOW: {
    draft: ['quotation'],
    quotation: ['confirmed', 'draft'],
    confirmed: ['active'],
    active: ['closed'],
    closed: [],
  },
  INVOICE_STATUS: ['draft', 'confirmed', 'paid', 'cancelled'],
  INVOICE_FLOW: {
    draft: ['confirmed', 'cancelled'],
    confirmed: ['paid', 'cancelled'],
    paid: [],
    cancelled: [],
  },
  PAYMENT_METHODS: ['cash', 'bank_transfer', 'card', 'upi', 'cheque', 'other'],
};
