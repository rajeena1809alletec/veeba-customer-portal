import React from 'react';
import Icon from '../../../components/AppIcon';

const ComplaintStats = ({ stats }) => {
  const statCards = [
    {
      label: 'Total Complaints',
      value: stats?.total,
      icon: 'MessageSquare',
      color: 'var(--color-primary)',
      bg: 'bg-primary/10'
    },
    {
      label: 'Open',
      value: stats?.open,
      icon: 'AlertCircle',
      color: 'var(--color-warning)',
      bg: 'bg-warning/10'
    },
    {
      label: 'Under Investigation',
      value: stats?.investigating,
      icon: 'Search',
      color: 'var(--color-accent)',
      bg: 'bg-accent/10'
    },
    {
      label: 'Resolved',
      value: stats?.resolved,
      icon: 'CheckCircle',
      color: 'var(--color-success)',
      bg: 'bg-success/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {statCards?.map((stat, index) => (
        <div
          key={index}
          className="
            bg-card rounded-xl p-4 md:p-6
            border border-border
            shadow-warm-sm hover:shadow-warm-md
            transition-smooth
          "
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`
              ${stat?.bg} rounded-lg p-2 md:p-3
              transition-smooth
            `}>
              <Icon name={stat?.icon} size={20} color={stat?.color} />
            </div>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-1">
              {stat?.value}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground">
              {stat?.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ComplaintStats;