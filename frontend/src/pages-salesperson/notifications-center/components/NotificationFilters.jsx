import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const NotificationFilters = ({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  notificationCounts 
}) => {
  const typeOptions = [
    { value: 'all', label: `All Notifications (${notificationCounts?.all})` },
    { value: 'order', label: `Orders (${notificationCounts?.order})` },
    { value: 'payment', label: `Payments (${notificationCounts?.payment})` },
    { value: 'scheme', label: `Schemes (${notificationCounts?.scheme})` },
    { value: 'announcement', label: `Announcements (${notificationCounts?.announcement})` },
    { value: 'dispatch', label: `Dispatch (${notificationCounts?.dispatch})` },
    { value: 'invoice', label: `Invoices (${notificationCounts?.invoice})` },
    { value: 'system', label: `System (${notificationCounts?.system})` }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'unread', label: 'Unread Only' },
    { value: 'read', label: 'Read Only' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const hasActiveFilters = 
    filters?.type !== 'all' || 
    filters?.status !== 'all' || 
    filters?.priority !== 'all' || 
    filters?.dateRange !== 'all' ||
    filters?.searchQuery !== '';

  return (
    <div className="bg-card rounded-xl border border-border p-4 md:p-6 shadow-warm-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-semibold text-lg text-foreground">
          Filter Notifications
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClearFilters}
          >
            Clear All
          </Button>
        )}
      </div>
      <div className="space-y-4">
        <Input
          type="search"
          placeholder="Search notifications..."
          value={filters?.searchQuery}
          onChange={(e) => onFilterChange('searchQuery', e?.target?.value)}
          className="w-full"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select
            label="Type"
            options={typeOptions}
            value={filters?.type}
            onChange={(value) => onFilterChange('type', value)}
          />

          <Select
            label="Status"
            options={statusOptions}
            value={filters?.status}
            onChange={(value) => onFilterChange('status', value)}
          />

          <Select
            label="Priority"
            options={priorityOptions}
            value={filters?.priority}
            onChange={(value) => onFilterChange('priority', value)}
          />

          <Select
            label="Date Range"
            options={dateRangeOptions}
            value={filters?.dateRange}
            onChange={(value) => onFilterChange('dateRange', value)}
          />
        </div>

        {filters?.dateRange === 'custom' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <Input
              type="date"
              label="From Date"
              value={filters?.customStartDate}
              onChange={(e) => onFilterChange('customStartDate', e?.target?.value)}
            />
            <Input
              type="date"
              label="To Date"
              value={filters?.customEndDate}
              onChange={(e) => onFilterChange('customEndDate', e?.target?.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationFilters;