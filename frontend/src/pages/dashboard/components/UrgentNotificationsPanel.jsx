import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import NotificationBadge from '../../../components/ui/NotificationBadge';

const UrgentNotificationsPanel = ({ notifications }) => {
  const navigate = useNavigate();

  const getPriorityConfig = (priority) => {
    const configs = {
      high: {
        color: 'text-error',
        bgColor: 'bg-error/10',
        icon: 'AlertCircle',
      },
      medium: {
        color: 'text-warning',
        bgColor: 'bg-warning/10',
        icon: 'AlertTriangle',
      },
      low: {
        color: 'text-primary',
        bgColor: 'bg-primary/10',
        icon: 'Info',
      },
    };
    return configs?.[priority] || configs?.low;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-warm-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="font-heading font-semibold text-xl text-foreground">
            Urgent Notifications
          </h2>
          <NotificationBadge count={notifications?.length} variant="error" />
        </div>
        <button
          onClick={() => navigate('/notifications-center')}
          className="text-sm font-medium text-primary hover:text-primary/80 transition-smooth"
        >
          View All
        </button>
      </div>
      <div className="space-y-3">
        {notifications?.length > 0 ? (
          notifications?.map((notification) => {
            const config = getPriorityConfig(notification?.priority);
            return (
              <div
                key={notification?.id}
                className="group relative bg-background rounded-lg p-4 border border-border hover:shadow-warm-sm transition-smooth"
              >
                <div className="flex items-start gap-3">
                  <div className={`${config?.bgColor} rounded-lg p-2 flex-shrink-0`}>
                    <Icon name={config?.icon} size={20} color={`var(--color-${notification?.priority === 'high' ? 'error' : notification?.priority === 'medium' ? 'warning' : 'primary'})`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-body font-medium text-sm text-foreground">
                        {notification?.title}
                      </h4>
                      {notification?.dueDate && (
                        <span className="font-caption text-xs text-muted-foreground whitespace-nowrap">
                          Due: {formatDate(notification?.dueDate)}
                        </span>
                      )}
                    </div>

                    <p className="font-caption text-sm text-muted-foreground mb-2">
                      {notification?.message}
                    </p>

                    {notification?.actionLabel && (
                      <button
                        onClick={() => notification?.actionPath && navigate(notification?.actionPath)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-smooth"
                      >
                        <span>{notification?.actionLabel}</span>
                        <Icon name="ArrowRight" size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-muted rounded-full mb-3">
              <Icon name="CheckCircle" size={24} color="var(--color-success)" />
            </div>
            <p className="font-caption text-sm text-muted-foreground">
              No urgent notifications at the moment
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UrgentNotificationsPanel;