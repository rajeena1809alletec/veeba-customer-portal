import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ActivityItem = ({ activity }) => {
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = (status) => {
    const statusColors = {
      completed: 'text-success bg-success/10',
      pending: 'text-warning bg-warning/10',
      processing: 'text-primary bg-primary/10',
      failed: 'text-error bg-error/10',
      dispatched: 'text-accent bg-accent/10',
    };
    return statusColors?.[status] || 'text-muted-foreground bg-muted';
  };

  const getActivityIcon = (type) => {
    const iconMap = {
      order: 'ShoppingCart',
      dispatch: 'Truck',
      payment: 'DollarSign',
      invoice: 'FileText',
      notification: 'Bell',
      complaint: 'MessageSquare',
    };
    return iconMap?.[type] || 'Activity';
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const activityDate = new Date(timestamp);
    const diffMs = now - activityDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    return activityDate?.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="group relative bg-card rounded-lg p-4 border border-border hover:shadow-warm-sm transition-smooth">
      <div className="flex items-start gap-4">
        <div className={`${getStatusColor(activity?.status)} rounded-lg p-2 flex-shrink-0`}>
          <Icon name={getActivityIcon(activity?.type)} size={20} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-body font-medium text-sm text-foreground">
              {activity?.title}
            </h4>
            <span className="font-caption text-xs text-muted-foreground whitespace-nowrap">
              {formatTimestamp(activity?.timestamp)}
            </span>
          </div>

          <p className="font-caption text-sm text-muted-foreground mb-2">
            {activity?.description}
          </p>

          {activity?.details && (
            <>
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-smooth"
              >
                <span>{expanded ? 'Show less' : 'Show more'}</span>
                <Icon name={expanded ? 'ChevronUp' : 'ChevronDown'} size={14} />
              </button>

              {expanded && (
                <div className="mt-3 p-3 bg-muted/50 rounded-md space-y-1 animate-fade-in">
                  {Object.entries(activity?.details)?.map(([key, value]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="font-caption text-muted-foreground capitalize">
                        {key?.replace(/([A-Z])/g, ' $1')?.trim()}:
                      </span>
                      <span className="font-caption font-medium text-foreground data-text">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;