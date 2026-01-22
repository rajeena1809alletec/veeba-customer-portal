import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TransactionsTable = ({ transactions, onDownloadPDF, onViewDetails }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  console.log("transactionssss: ", transactions)
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedTransactions = [...transactions]?.sort((a, b) => {
    if (sortConfig?.key === 'date') {
      return sortConfig?.direction === 'asc'
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    }
    if (sortConfig?.key === 'amount') {
      return sortConfig?.direction === 'asc'
        ? a?.amount - b?.amount
        : b?.amount - a?.amount;
    }
    if (sortConfig?.key === 'remainingAmt') {
      return sortConfig?.direction === 'asc'
        ? (a?.remainingAmt || 0) - (b?.remainingAmt || 0)
        : (b?.remainingAmt || 0) - (a?.remainingAmt || 0);
    }
    return 0;
  });

  const getStatusColor = (status) => {
    const colors = {
      'paid': 'text-success bg-success/10',
      'pending': 'text-warning bg-warning/10',
      'overdue': 'text-error bg-error/10',
      'processed': 'text-primary bg-primary/10'
    };
    return colors?.[status] || 'text-muted-foreground bg-muted';
  };

  const getTypeIcon = (type) => {
    const icons = {
      'invoice': 'FileText',
      'credit_note': 'FileMinus',
      'payment': 'CreditCard',
      'debit_note': 'FilePlus'
    };
    return icons?.[type] || 'File';
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-warm-sm overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto scrollbar-custom">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left p-4 font-heading font-semibold text-sm text-foreground">
                Type
              </th>
              <th
                className="text-left p-4 font-heading font-semibold text-sm text-foreground cursor-pointer hover:bg-muted/70 transition-smooth"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center gap-2">
                  Date
                  <Icon
                    name={sortConfig?.key === 'date' && sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown'}
                    size={16}
                  />
                </div>
              </th>
              <th className="text-left p-4 font-heading font-semibold text-sm text-foreground">
                Reference
              </th>
              <th
                className="text-right p-4 font-heading font-semibold text-sm text-foreground cursor-pointer hover:bg-muted/70 transition-smooth"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center justify-end gap-2">
                  Amount
                  <Icon
                    name={sortConfig?.key === 'amount' && sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown'}
                    size={16}
                  />
                </div>
              </th>
              {/* ✅ ADD NEW COLUMN HEADER */}
              <th
                className="text-right p-4 font-heading font-semibold text-sm text-foreground cursor-pointer hover:bg-muted/70 transition-smooth"
                onClick={() => handleSort('remainingAmt')}
              >
                <div className="flex items-center justify-end gap-2">
                  Remaining Amount
                  <Icon
                    name={sortConfig?.key === 'remainingAmt' && sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown'}
                    size={16}
                  />
                </div>
              </th>
              <th className="text-center p-4 font-heading font-semibold text-sm text-foreground">
                Status
              </th>
              <th className="text-center p-4 font-heading font-semibold text-sm text-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions?.map((transaction) => (
              <tr
                key={transaction?.id}
                className="border-b border-border hover:bg-muted/30 transition-smooth"
              >
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 rounded-lg p-2">
                      <Icon name={getTypeIcon(transaction?.type)} size={18} color="var(--color-primary)" />
                    </div>
                    <span className="font-body text-sm text-foreground capitalize">
                      {transaction?.type?.replace('_', ' ')}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="font-body text-sm text-foreground">
                    {new Date(transaction.date)?.toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </td>
                <td className="p-4">
                  <span className="font-caption text-sm text-foreground data-text">
                    {transaction?.reference}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <span className="font-body text-sm font-semibold text-foreground data-text">
                    ₹{transaction?.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </td>
                {/* ✅ ADD NEW COLUMN DATA */}
                <td className="p-4 text-right">
                  <span className={`font-body text-sm font-semibold data-text ${transaction?.remainingAmt > 0 ? 'text-error' : 'text-success'
                    }`}>
                    {transaction?.remainingAmt !== null && transaction?.remainingAmt !== undefined
                      ? `₹${Math.abs(transaction.remainingAmt).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      : '-'
                    }
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-center">
                    <span className={`px-3 py-1 rounded-full font-caption text-xs font-medium capitalize ${getStatusColor(transaction?.status)}`}>
                      {transaction?.status}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onViewDetails(transaction)}
                      className="p-2 rounded-lg hover:bg-muted transition-smooth"
                      aria-label="View details"
                    >
                      <Icon name="Eye" size={18} color="var(--color-muted-foreground)" />
                    </button>
                    {(transaction?.type === 'invoice' || transaction?.type === 'credit_note') && (
                      <button
                        onClick={() => onDownloadPDF(transaction)}
                        className="p-2 rounded-lg hover:bg-muted transition-smooth"
                        aria-label="Download PDF"
                      >
                        <Icon name="Download" size={18} color="var(--color-muted-foreground)" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-border">
        {sortedTransactions?.map((transaction) => (
          <div key={transaction?.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-lg p-2">
                  <Icon name={getTypeIcon(transaction?.type)} size={20} color="var(--color-primary)" />
                </div>
                <div>
                  <p className="font-body text-sm font-medium text-foreground capitalize">
                    {transaction?.type?.replace('_', ' ')}
                  </p>
                  <p className="font-caption text-xs text-muted-foreground data-text">
                    {transaction?.reference}
                  </p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full font-caption text-xs font-medium capitalize ${getStatusColor(transaction?.status)}`}>
                {transaction?.status}
              </span>
            </div>

            <div className="flex items-center justify-between mb-3">
              <span className="font-caption text-xs text-muted-foreground">
                {new Date(transaction.date)?.toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
              <span className="font-body text-base font-semibold text-foreground data-text">
                ₹{transaction?.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            {/* ✅ ADD REMAINING AMOUNT IN MOBILE VIEW */}
            {transaction?.remainingAmt !== null && transaction?.remainingAmt !== undefined && (
              <div className="flex items-center justify-between">
                <span className="font-caption text-xs text-muted-foreground">Remaining</span>
                <span className={`font-body text-sm font-semibold data-text ${transaction?.remainingAmt > 0 ? 'text-error' : 'text-success'
                  }`}>
                  ₹{Math.abs(transaction.remainingAmt).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Eye"
                iconPosition="left"
                onClick={() => onViewDetails(transaction)}
                className="flex-1"
              >
                View
              </Button>
              {(transaction?.type === 'invoice' || transaction?.type === 'credit_note') && (
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Download"
                  onClick={() => onDownloadPDF(transaction)}
                >
                  PDF
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionsTable;