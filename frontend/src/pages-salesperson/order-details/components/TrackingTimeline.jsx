import React from 'react';
import Icon from '../../../components/AppIcon';

const TrackingTimeline = ({ trackingData }) => {
  const getStatusIcon = (status) => {
    const icons = {
      'Confirmed': 'CheckCircle2',
      'Processing': 'Package',
      'Dispatched': 'Truck',
      'In Transit': 'Navigation',
      'Out for Delivery': 'MapPin',
      'Delivered': 'CheckCircle'
    };
    return icons?.[status] || 'Circle';
  };

  const getStatusColor = (isCompleted, isCurrent) => {
    if (isCompleted) return 'var(--color-success)';
    if (isCurrent) return 'var(--color-primary)';
    return 'var(--color-muted-foreground)';
  };

  return (
    <div className="bg-card rounded-xl p-4 md:p-6 lg:p-8 shadow-warm-md border border-border">
      <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground mb-6 flex items-center gap-2">
        <Icon name="TrendingUp" size={24} color="var(--color-primary)" />
        Order Tracking
      </h2>
      {trackingData?.trackingNumber && (
        <div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground font-caption mb-1">Tracking Number</p>
              <p className="font-mono text-base md:text-lg text-foreground font-semibold">
                {trackingData?.trackingNumber}
              </p>
            </div>
            {trackingData?.challanNumber && (
              <div>
                <p className="text-sm text-muted-foreground font-caption mb-1">Delivery Challan</p>
                <p className="font-mono text-base md:text-lg text-foreground font-semibold">
                  {trackingData?.challanNumber}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="relative">
        {trackingData?.timeline?.map((event, index) => {
          const isLast = index === trackingData?.timeline?.length - 1;
          const isCompleted = event?.completed;
          const isCurrent = event?.current;

          return (
            <div key={index} className="relative pb-8 last:pb-0">
              {!isLast && (
                <div
                  className="absolute left-4 md:left-5 top-10 bottom-0 w-0.5 transition-smooth"
                  style={{
                    backgroundColor: isCompleted
                      ? 'var(--color-success)'
                      : 'var(--color-border)'
                  }}
                />
              )}
              <div className="flex gap-4 md:gap-6">
                <div
                  className={`
                    flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full
                    flex items-center justify-center
                    transition-smooth
                    ${isCompleted ? 'bg-success/10' : isCurrent ? 'bg-primary/10' : 'bg-muted'}
                  `}
                >
                  <Icon
                    name={getStatusIcon(event?.status)}
                    size={18}
                    color={getStatusColor(isCompleted, isCurrent)}
                  />
                </div>

                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                    <h3
                      className={`
                        font-body font-semibold text-base md:text-lg
                        ${isCompleted || isCurrent ? 'text-foreground' : 'text-muted-foreground'}
                      `}
                    >
                      {event?.status}
                    </h3>
                    <span className="text-sm text-muted-foreground font-caption whitespace-nowrap">
                      {event?.timestamp}
                    </span>
                  </div>

                  {event?.description && (
                    <p className="text-sm md:text-base text-muted-foreground font-body mb-2">
                      {event?.description}
                    </p>
                  )}

                  {event?.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="MapPin" size={14} />
                      <span className="font-caption">{event?.location}</span>
                    </div>
                  )}

                  {event?.remarks && (
                    <div className="mt-2 p-3 bg-muted/50 rounded-md">
                      <p className="text-sm text-foreground font-body">{event?.remarks}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {trackingData?.estimatedDelivery && (
        <div className="mt-6 p-4 bg-accent/5 rounded-lg border border-accent/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name="Clock" size={20} color="var(--color-accent)" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-caption mb-1">Estimated Delivery</p>
              <p className="text-base md:text-lg text-foreground font-body font-semibold">
                {trackingData?.estimatedDelivery}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackingTimeline;