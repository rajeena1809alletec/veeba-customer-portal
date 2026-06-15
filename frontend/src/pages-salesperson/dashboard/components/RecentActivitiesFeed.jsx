import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import ActivityItem from './ActivityItem';

const RecentActivitiesFeed = ({ activities }) => {
  const [filter, setFilter] = useState('all');

  const filterOptions = [
    { value: 'all', label: 'All Activities', icon: 'Activity' },
    { value: 'order', label: 'Orders', icon: 'ShoppingCart' },
    { value: 'dispatch', label: 'Dispatches', icon: 'Truck' },
    { value: 'payment', label: 'Payments', icon: 'DollarSign' },
    { value: 'invoice', label: 'Invoices', icon: 'FileText' },
  ];

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities?.filter(activity => activity?.type === filter);

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-warm-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="font-heading font-semibold text-xl text-foreground">
          Recent Activities
        </h2>
        
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-custom pb-2 sm:pb-0">
          {filterOptions?.map((option) => (
            <button
              key={option?.value}
              onClick={() => setFilter(option?.value)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-md
                font-caption text-sm font-medium whitespace-nowrap
                transition-smooth flex-shrink-0
                ${filter === option?.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }
              `}
            >
              <Icon name={option?.icon} size={16} />
              <span className="hidden sm:inline">{option?.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-custom">
        {filteredActivities?.length > 0 ? (
          filteredActivities?.map((activity) => (
            <ActivityItem key={activity?.id} activity={activity} />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
              <Icon name="Inbox" size={32} color="var(--color-muted-foreground)" />
            </div>
            <p className="font-caption text-muted-foreground">
              No activities found for this filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivitiesFeed;