import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';


const QuickActionsPanel = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'New Order',
      description: 'Place a new order quickly',
      icon: 'Plus',
      iconColor: 'var(--color-primary)',
      bgColor: 'bg-primary/10',
      action: () => navigate('/order-management'),
    },
    {
      title: 'Repeat Order',
      description: 'Reorder from previous purchases',
      icon: 'RefreshCw',
      iconColor: 'var(--color-accent)',
      bgColor: 'bg-accent/10',
      action: () => navigate('/order-management'),
    },
    {
      title: 'View Invoices',
      description: 'Check pending invoices',
      icon: 'FileText',
      iconColor: 'var(--color-warning)',
      bgColor: 'bg-warning/10',
      action: () => navigate('/invoice-management'),
    },
    {
      title: 'Raise Complaint',
      description: 'Report an issue or concern',
      icon: 'MessageSquare',
      iconColor: 'var(--color-error)',
      bgColor: 'bg-error/10',
      action: () => navigate('/complaint-management'),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {quickActions?.map((action, index) => (
        <button
          key={index}
          onClick={action?.action}
          className="
            group relative
            bg-card rounded-xl p-6
            border border-border
            shadow-warm-sm hover:shadow-warm-md
            transition-smooth
            hover:scale-[1.02] active:scale-[0.98]
            text-left
          "
        >
          <div className="flex items-start gap-4">
            <div className={`
              ${action?.bgColor} 
              rounded-lg p-3
              transition-smooth
              group-hover:scale-110
            `}>
              <Icon name={action?.icon} size={24} color={action?.iconColor} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-heading font-semibold text-base text-foreground mb-1">
                {action?.title}
              </h3>
              <p className="font-caption text-sm text-muted-foreground">
                {action?.description}
              </p>
            </div>
          </div>
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-smooth">
            <Icon name="ArrowRight" size={18} color="var(--color-muted-foreground)" />
          </div>
        </button>
      ))}
    </div>
  );
};

export default QuickActionsPanel;