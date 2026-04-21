import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const DispatchTable = ({ transactions, onViewDetails }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'invoiceDate', direction: 'desc' });

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedTransactions = [...transactions]?.sort((a, b) => {
    if (sortConfig?.key === 'invoiceDate') {
      return sortConfig?.direction === 'asc'
        ? new Date(a.invoiceDate) - new Date(b.invoiceDate)
        : new Date(b.invoiceDate) - new Date(a.invoiceDate);
    }
    return 0;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr)?.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-warm-sm overflow-hidden">

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto scrollbar-custom">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th
                className="text-left p-4 font-heading font-semibold text-sm text-foreground cursor-pointer hover:bg-muted/70 transition-smooth"
                onClick={() => handleSort('invoiceDate')}
              >
                <div className="flex items-center gap-2">
                  Invoice Date
                  <Icon
                    name={sortConfig?.key === 'invoiceDate' && sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown'}
                    size={16}
                  />
                </div>
              </th>
              <th className="text-left p-4 font-heading font-semibold text-sm text-foreground">
                Invoice No
              </th>
              <th className="text-left p-4 font-heading font-semibold text-sm text-foreground">
                Transporter Name
              </th>
              <th className="text-left p-4 font-heading font-semibold text-sm text-foreground">
                LR No / Tracking No
              </th>
              <th className="text-left p-4 font-heading font-semibold text-sm text-foreground">
                Dispatch Date
              </th>
              <th className="text-left p-4 font-heading font-semibold text-sm text-foreground">
                Driver Contact
              </th>
              <th className="text-center p-4 font-heading font-semibold text-sm text-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions?.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center font-body text-sm text-muted-foreground">
                  No dispatch records found.
                </td>
              </tr>
            ) : (
              sortedTransactions?.map((transaction) => (
                <tr
                  key={transaction?.id}
                  className="border-b border-border hover:bg-muted/30 transition-smooth"
                >
                  <td className="p-4">
                    <span className="font-body text-sm text-foreground">
                      {formatDate(transaction?.invoiceDate)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-caption text-sm text-foreground data-text">
                      {transaction?.invoiceNo || '-'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-body text-sm text-foreground">
                      {transaction?.transporterName || '-'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-caption text-sm text-foreground data-text">
                      {transaction?.lrNo || '-'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-body text-sm text-foreground">
                      {formatDate(transaction?.dispatchDate)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-body text-sm text-foreground">
                      {transaction?.driverContact || '-'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => onViewDetails(transaction)}
                        className="p-2 rounded-lg hover:bg-muted transition-smooth"
                        aria-label="View details"
                      >
                        <Icon name="Eye" size={18} color="var(--color-muted-foreground)" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-border">
        {sortedTransactions?.length === 0 ? (
          <div className="p-8 text-center font-body text-sm text-muted-foreground">
            No dispatch records found.
          </div>
        ) : (
          sortedTransactions?.map((transaction) => (
            <div key={transaction?.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-body text-sm font-medium text-foreground data-text">
                    {transaction?.invoiceNo || '-'}
                  </p>
                  <p className="font-caption text-xs text-muted-foreground">
                    {formatDate(transaction?.invoiceDate)}
                  </p>
                </div>
                <button
                  onClick={() => onViewDetails(transaction)}
                  className="p-2 rounded-lg hover:bg-muted transition-smooth"
                  aria-label="View details"
                >
                  <Icon name="Eye" size={18} color="var(--color-muted-foreground)" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="font-caption text-xs text-muted-foreground">Transporter</p>
                  <p className="font-body text-sm text-foreground">{transaction?.transporterName || '-'}</p>
                </div>
                <div>
                  <p className="font-caption text-xs text-muted-foreground">LR No</p>
                  <p className="font-caption text-sm text-foreground data-text">{transaction?.lrNo || '-'}</p>
                </div>
                <div>
                  <p className="font-caption text-xs text-muted-foreground">Dispatch Date</p>
                  <p className="font-body text-sm text-foreground">{formatDate(transaction?.dispatchDate)}</p>
                </div>
                <div>
                  <p className="font-caption text-xs text-muted-foreground">Driver Contact</p>
                  <p className="font-body text-sm text-foreground">{transaction?.driverContact || '-'}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default DispatchTable;