import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustBadges = () => {
  const badges = [
    {
      icon: 'Shield',
      title: 'Secure Login',
      description: 'SSL encrypted connection'
    },
    {
      icon: 'FileCheck',
      title: 'GST Compliant',
      description: 'Verified business portal'
    },
    {
      icon: 'Award',
      title: 'ISO Certified',
      description: 'Quality assured services'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
      {badges?.map((badge, index) => (
        <div
          key={index}
          className="flex flex-col items-center text-center p-4 bg-card/50 rounded-lg border border-border/50 transition-smooth hover:bg-card hover:border-border"
        >
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
            <Icon name={badge?.icon} size={24} color="var(--color-primary)" />
          </div>
          <h3 className="font-heading font-semibold text-sm text-foreground mb-1">
            {badge?.title}
          </h3>
          <p className="font-caption text-xs text-muted-foreground">
            {badge?.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TrustBadges;