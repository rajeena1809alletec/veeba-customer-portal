import React from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const InvoiceFilters = ({ filters, onFilterChange, onReset, onApply }) => {
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'paid', label: 'Paid' },
    { value: 'pending', label: 'Pending' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'partially_paid', label: 'Partially Paid' }
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'invoice', label: 'Invoice' },
    { value: 'credit_note', label: 'Credit Note' }
  ];

  return (
    <div className="bg-card rounded-xl border border-border shadow-warm-sm p-4 md:p-6">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Filter" size={18} color="var(--color-primary)" />
          </div>
          <h3 className="font-heading font-semibold text-base md:text-lg text-foreground">
            Filter Invoices
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          iconName="RotateCcw"
          iconPosition="left"
          onClick={onReset}
        >
          Reset
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Input
          type="text"
          label="Search"
          placeholder="Invoice number, order ref..."
          value={filters?.search}
          onChange={(e) => onFilterChange('search', e?.target?.value)}
        />

        <Select
          label="Status"
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => onFilterChange('status', value)}
        />

        <Select
          label="Type"
          options={typeOptions}
          value={filters?.type}
          onChange={(value) => onFilterChange('type', value)}
        />

        <Input
          type="date"
          label="From Date"
          value={filters?.fromDate}
          onChange={(e) => onFilterChange('fromDate', e?.target?.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          type="date"
          label="To Date"
          value={filters?.toDate}
          onChange={(e) => onFilterChange('toDate', e?.target?.value)}
        />

        <Input
          type="number"
          label="Min Amount (₹)"
          placeholder="0"
          value={filters?.minAmount}
          onChange={(e) => onFilterChange('minAmount', e?.target?.value)}
        />

        <Input
          type="number"
          label="Max Amount (₹)"
          placeholder="100000"
          value={filters?.maxAmount}
          onChange={(e) => onFilterChange('maxAmount', e?.target?.value)}
        />

        <div className="flex items-end">
          <Button
            variant="default"
            fullWidth
            iconName="Search"
            iconPosition="left"
            onClick={onApply}
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceFilters;