import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const MetricCard = ({ title, value, subtitle, icon, iconColor, bgColor, trend, trendValue, navigateTo }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (navigateTo) {
      navigate(navigateTo);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={!navigateTo}
      className={`
        group relative
        bg-card rounded-xl p-6
        border border-border
        shadow-warm-sm hover:shadow-warm-md
        transition-smooth
        ${navigateTo ? 'hover:scale-[1.02] active:scale-[0.98] cursor-pointer' : 'cursor-default'}
        text-left w-full
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`${bgColor} rounded-lg p-3 transition-smooth ${navigateTo ? 'group-hover:scale-110' : ''}`}>
          <Icon name={icon} size={24} color={iconColor} />
        </div>
        {navigateTo && (
          <div className="opacity-0 group-hover:opacity-100 transition-smooth">
            <Icon name="ArrowUpRight" size={18} color="var(--color-muted-foreground)" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <p className="font-caption text-sm text-muted-foreground">{title}</p>
        <h3 className="font-heading font-semibold text-2xl md:text-3xl text-foreground data-text">
          {value}
        </h3>
        {subtitle && (
          <p className="font-caption text-xs text-muted-foreground">{subtitle}</p>
        )}
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trend === 'up' ? 'text-success' : trend === 'down' ? 'text-error' : 'text-muted-foreground'}`}>
            <Icon name={trend === 'up' ? 'TrendingUp' : trend === 'down' ? 'TrendingDown' : 'Minus'} size={14} />
            <span>{trendValue}</span>
          </div>
        )}
      </div>
    </button>
  );
};

export default MetricCard;