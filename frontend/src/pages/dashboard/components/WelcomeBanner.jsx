import React from 'react';
import Icon from '../../../components/AppIcon';

const WelcomeBanner = ({ customerName, lastLogin }) => {
  const getCurrentGreeting = () => {
    const hour = new Date()?.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatLastLogin = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffHours < 24) {
      return `Last login: Today at ${date?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
    }
    return `Last login: ${date?.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} at ${date?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="relative bg-gradient-to-r from-primary to-primary/80 rounded-xl p-6 md:p-8 overflow-hidden shadow-warm-lg">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="font-heading font-semibold text-2xl md:text-3xl text-primary-foreground mb-2">
              {getCurrentGreeting()}, {customerName}!
            </h1>
            <p className="font-caption text-sm text-primary-foreground/80">
              Welcome back to your Veeba Foods customer portal
            </p>
          </div>
          <div className="hidden md:flex items-center justify-center w-16 h-16 bg-white/10 rounded-full flex-shrink-0">
            <Icon name="User" size={32} color="var(--color-primary-foreground)" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4 border-t border-white/20">
          <div className="flex items-center gap-2 text-primary-foreground/90">
            <Icon name="Clock" size={16} />
            <span className="font-caption text-sm">{formatLastLogin(lastLogin)}</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/20"></div>
          <div className="flex items-center gap-2 text-primary-foreground/90">
            <Icon name="Calendar" size={16} />
            <span className="font-caption text-sm">
              {new Date()?.toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;