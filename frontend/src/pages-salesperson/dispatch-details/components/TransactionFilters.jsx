import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const TransactionFilters = ({
  searchTerm,
  onSearchChange,
  transactionType,
  onTypeChange,
  dateRange,
  onDateRangeChange,
  onReset
}) => {
  const transactionTypeOptions = [
    { value: 'all', label: 'All Transactions' },
    { value: 'invoice', label: 'Invoices' },
    { value: 'credit_note', label: 'Credit Notes' },
    { value: 'payment', label: 'Payments' },
    { value: 'debit_note', label: 'Debit Notes' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  return (
    <div className="bg-card rounded-xl p-4 md:p-6 border border-border shadow-warm-sm mb-4 md:mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          type="search"
          placeholder="Search by reference, amount..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e?.target?.value)}
          className="w-full"
        />

        <Select
          placeholder="Transaction Type"
          options={transactionTypeOptions}
          value={transactionType}
          onChange={onTypeChange}
        />

        <Select
          placeholder="Date Range"
          options={dateRangeOptions}
          value={dateRange}
          onChange={onDateRangeChange}
        />

        <Button
          variant="outline"
          iconName="RotateCcw"
          iconPosition="left"
          onClick={onReset}
          className="w-full"
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default TransactionFilters;