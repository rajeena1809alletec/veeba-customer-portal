import React from 'react';
import Icon from '../../../components/AppIcon';

import Button from '../../../components/ui/Button';

const NotificationCard = ({ 
  notification, 
  onMarkAsRead, 
  onArchive, 
  onDelete, 
  onExpand 
}) => {
  const getTypeIcon = (type) => {
    const icons = {
      order: 'ShoppingCart',
      payment: 'DollarSign',
      scheme: 'Gift',
      announcement: 'Megaphone',
      dispatch: 'Truck',
      invoice: 'FileText',
      system: 'Bell'
    };
    return icons?.[type] || 'Bell';
  };

  const getTypeColor = (type) => {
    const colors = {
      order: 'var(--color-primary)',
      payment: 'var(--color-warning)',
      scheme: 'var(--color-accent)',
      announcement: 'var(--color-success)',
      dispatch: 'var(--color-primary)',
      invoice: 'var(--color-secondary)',
      system: 'var(--color-muted-foreground)'
    };
    return colors?.[type] || 'var(--color-muted-foreground)';
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      high: { text: 'High Priority', bg: 'bg-error/10', color: 'text-error' },
      medium: { text: 'Medium', bg: 'bg-warning/10', color: 'text-warning' },
      low: { text: 'Low', bg: 'bg-muted', color: 'text-muted-foreground' }
    };
    return badges?.[priority] || badges?.low;
  };

  const formatTimestamp = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return notifDate?.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const priorityBadge = getPriorityBadge(notification?.priority);

  return (
    <div 
      className={`
        relative bg-card rounded-xl border transition-smooth
        ${notification?.isRead ? 'border-border' : 'border-primary/30 shadow-warm-md'}
        hover:shadow-warm-lg
      `}
    >
      {!notification?.isRead && (
        <div className="absolute top-4 left-4 w-2 h-2 bg-primary rounded-full animate-pulse-subtle"></div>
      )}
      <div className="p-4 md:p-6">
        <div className="flex items-start gap-3 md:gap-4">
          <div className={`
            flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-lg
            flex items-center justify-center
            ${notification?.type === 'order' ? 'bg-primary/10' : 
              notification?.type === 'payment' ? 'bg-warning/10' :
              notification?.type === 'scheme' ? 'bg-accent/10' :
              notification?.type === 'announcement'? 'bg-success/10' : 'bg-muted'}
          `}>
            <Icon 
              name={getTypeIcon(notification?.type)} 
              size={20} 
              color={getTypeColor(notification?.type)} 
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <h3 className={`
                  font-heading font-semibold text-base md:text-lg mb-1
                  ${notification?.isRead ? 'text-foreground' : 'text-primary'}
                `}>
                  {notification?.subject}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-caption text-xs text-muted-foreground">
                    {notification?.sender}
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="font-caption text-xs text-muted-foreground">
                    {formatTimestamp(notification?.timestamp)}
                  </span>
                </div>
              </div>

              {notification?.priority !== 'low' && (
                <span className={`
                  ${priorityBadge?.bg} ${priorityBadge?.color}
                  px-2 py-1 rounded-md text-xs font-caption font-medium
                  whitespace-nowrap
                `}>
                  {priorityBadge?.text}
                </span>
              )}
            </div>

            <p className="text-sm md:text-base text-muted-foreground mb-3 line-clamp-2">
              {notification?.preview}
            </p>

            {notification?.attachments && notification?.attachments?.length > 0 && (
              <div className="flex items-center gap-2 mb-3">
                <Icon name="Paperclip" size={14} color="var(--color-muted-foreground)" />
                <span className="text-xs text-muted-foreground">
                  {notification?.attachments?.length} attachment{notification?.attachments?.length > 1 ? 's' : ''}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="ghost"
                size="sm"
                iconName="Eye"
                iconPosition="left"
                onClick={() => onExpand(notification?.id)}
              >
                View Details
              </Button>

              {!notification?.isRead && (
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Check"
                  onClick={() => onMarkAsRead(notification?.id)}
                >
                  Mark Read
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                iconName="Archive"
                onClick={() => onArchive(notification?.id)}
              >
                Archive
              </Button>

              <Button
                variant="ghost"
                size="sm"
                iconName="Trash2"
                onClick={() => onDelete(notification?.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;