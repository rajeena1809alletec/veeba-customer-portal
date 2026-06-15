import React from 'react';
import Icon from '../../../components/AppIcon';
import OrderTableRow from './OrderTableRow';

const OrderTable = ({ orders, onRepeatOrder, onSort, sortConfig }) => {
  const handleSort = (field) => {
    const direction = sortConfig?.field === field && sortConfig?.direction === 'asc' ? 'desc' : 'asc';
    onSort(field, direction);
  };

  const SortIcon = ({ field }) => {
    if (sortConfig?.field !== field) {
      return <Icon name="ChevronsUpDown" size={16} color="var(--color-muted-foreground)" />;
    }
    return (
      <Icon
        name={sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown'}
        size={16}
        color="var(--color-primary)"
      />
    );
  };

  return (
    <div className="bg-card rounded-xl shadow-warm-md border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="w-12 px-4 py-4"></th>
              <th className="px-4 py-4 text-left">
                <button
                  onClick={() => handleSort('orderNumber')}
                  className="flex items-center gap-2 font-caption text-xs font-medium text-muted-foreground uppercase hover:text-foreground transition-smooth"
                >
                  Order Number
                  <SortIcon field="orderNumber" />
                </button>
              </th>
              <th className="px-4 py-4 text-left">
                <button
                  onClick={() => handleSort('orderDate')}
                  className="flex items-center gap-2 font-caption text-xs font-medium text-muted-foreground uppercase hover:text-foreground transition-smooth"
                >
                  Order Date
                  <SortIcon field="orderDate" />
                </button>
              </th>
              <th className="px-4 py-4 text-left">
                <button
                  onClick={() => handleSort('totalAmount')}
                  className="flex items-center gap-2 font-caption text-xs font-medium text-muted-foreground uppercase hover:text-foreground transition-smooth"
                >
                  Total Amount
                  <SortIcon field="totalAmount" />
                </button>
              </th>
              <th className="px-4 py-4 text-left">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center gap-2 font-caption text-xs font-medium text-muted-foreground uppercase hover:text-foreground transition-smooth"
                >
                  Status
                  <SortIcon field="status" />
                </button>
              </th>
              <th className="px-4 py-4 text-left">
                <button
                  onClick={() => handleSort('deliveryDate')}
                  className="flex items-center gap-2 font-caption text-xs font-medium text-muted-foreground uppercase hover:text-foreground transition-smooth"
                >
                  Delivery Date
                  <SortIcon field="deliveryDate" />
                </button>
              </th>
              <th className="px-4 py-4 text-left font-caption text-xs font-medium text-muted-foreground uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orders?.length > 0 ? (
              orders?.map((order) => (
                <OrderTableRow
                  key={order?.id}
                  order={order}
                  onRepeatOrder={onRepeatOrder}
                />
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                      <Icon name="ShoppingCart" size={32} color="var(--color-muted-foreground)" />
                    </div>
                    <p className="font-body text-base text-muted-foreground">
                      No orders found
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;