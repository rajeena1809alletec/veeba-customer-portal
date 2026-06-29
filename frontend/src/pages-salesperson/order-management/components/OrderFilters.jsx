import React from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const OrderFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
  resultsCount,
  customDateRange
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'order in process', label: 'Order In Process' },
    { value: 'blocked', label: 'Blocked' },
    // { value: 'open', label: 'Open' },
    // { value: 'released', label: 'Released' },
    // { value: 'pending approval', label: 'Pending Approval' },
    // { value: 'dispatched', label: 'Dispatched' },
    // { value: 'invoiced', label: 'Invoiced' },
    // { value: 'cancelled', label: 'Cancelled' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },    // ← add this
    // { value: 'custom', label: 'Custom Range' }
  ];

  return (
    <div className="bg-card rounded-xl p-4 md:p-6 shadow-warm-md border border-border">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Filter" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h2 className="font-heading font-semibold text-lg text-foreground">
              Filter Orders
            </h2>
            <p className="font-caption text-sm text-muted-foreground">
              {resultsCount} orders found
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          iconName="RotateCcw"
          iconPosition="left"
          onClick={onClearFilters}
        >
          Clear Filters
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          type="search"
          placeholder="Search by order number..."
          value={filters?.search}
          onChange={(e) => onFilterChange('search', e?.target?.value)}
          className="w-full"
        />

        <Select
          placeholder="Select status"
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => onFilterChange('status', value)}
        />

        <Select
          placeholder="Select date range"
          options={dateRangeOptions}
          value={filters?.dateRange}
          onChange={(value) => onFilterChange('dateRange', value)}
        />

        {filters?.dateRange === 'custom' && customDateRange?.start && customDateRange?.end && (
          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
              <Icon name="CalendarDays" size={14} color="var(--color-primary)" />
              <span className="font-caption text-xs text-primary font-medium">
                {customDateRange.start} → {customDateRange.end}
              </span>
              <button
                onClick={() => onFilterChange('dateRange', 'all')}
                className="ml-1 hover:opacity-70 transition-smooth"
                aria-label="Clear custom date range"
              >
                <Icon name="X" size={12} color="var(--color-primary)" />
              </button>
            </div>
          </div>
        )}

        {/* {filters?.dateRange === 'custom' && (
          <div className="flex gap-2">
            <Input
              type="date"
              value={filters?.startDate}
              onChange={(e) => onFilterChange('startDate', e?.target?.value)}
              className="flex-1"
            />
            <Input
              type="date"
              value={filters?.endDate}
              onChange={(e) => onFilterChange('endDate', e?.target?.value)}
              className="flex-1"
            />
          </div>
        )} */}
      </div>
    </div>
  );
};

export default OrderFilters;