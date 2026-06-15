import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationDetailModal = ({ notification, onClose, onMarkAsRead, onArchive }) => {
  if (!notification) return null;

  const formatFullDate = (date) => {
    return new Date(date)?.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-card rounded-xl border border-border shadow-warm-xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-fade-in"
        onClick={(e) => e?.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
          <h2 className="font-heading font-semibold text-xl md:text-2xl text-foreground">
            Notification Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-smooth"
            aria-label="Close modal"
          >
            <Icon name="X" size={24} color="var(--color-foreground)" />
          </button>
        </div>

        <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(90vh-180px)] scrollbar-custom">
          <div className="space-y-6">
            <div>
              <h3 className="font-heading font-semibold text-lg md:text-xl text-foreground mb-2">
                {notification?.subject}
              </h3>
              <div className="flex items-center gap-3 flex-wrap text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Icon name="User" size={16} />
                  {notification?.sender}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Icon name="Clock" size={16} />
                  {formatFullDate(notification?.timestamp)}
                </span>
                {notification?.priority !== 'low' && (
                  <>
                    <span>•</span>
                    <span className={`
                      px-2 py-1 rounded-md text-xs font-medium
                      ${notification?.priority === 'high' ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'}
                    `}>
                      {notification?.priority === 'high' ? 'High Priority' : 'Medium Priority'}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="prose prose-sm max-w-none">
              <div className="text-base text-foreground whitespace-pre-wrap">
                {notification?.fullContent}
              </div>
            </div>

            {notification?.attachments && notification?.attachments?.length > 0 && (
              <div>
                <h4 className="font-heading font-semibold text-base text-foreground mb-3">
                  Attachments ({notification?.attachments?.length})
                </h4>
                <div className="space-y-2">
                  {notification?.attachments?.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-smooth"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icon name="FileText" size={20} color="var(--color-primary)" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground truncate">
                            {attachment?.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {attachment?.size}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Download"
                      >
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {notification?.actionLink && (
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  Quick Action Available
                </p>
                <Button
                  variant="default"
                  iconName="ExternalLink"
                  iconPosition="right"
                >
                  {notification?.actionText || 'View Related Item'}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-4 md:p-6 border-t border-border">
          {!notification?.isRead && (
            <Button
              variant="outline"
              iconName="Check"
              onClick={() => {
                onMarkAsRead(notification?.id);
                onClose();
              }}
            >
              Mark as Read
            </Button>
          )}
          <Button
            variant="outline"
            iconName="Archive"
            onClick={() => {
              onArchive(notification?.id);
              onClose();
            }}
          >
            Archive
          </Button>
          <Button
            variant="default"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetailModal;