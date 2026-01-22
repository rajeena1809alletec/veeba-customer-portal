import React from 'react';
import Icon from '../../../components/AppIcon';

const FinancialMetricCard = ({ 
  title, 
  amount, 
  icon, 
  iconColor, 
  bgColor, 
  trend, 
  trendValue, 
  subtitle 
}) => {
  return (
    <div className="bg-card rounded-xl p-4 md:p-6 border border-border shadow-warm-sm hover:shadow-warm-md transition-smooth">
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div className="flex-1 min-w-0">
          <p className="font-caption text-xs md:text-sm text-muted-foreground mb-1 md:mb-2">
            {title}
          </p>
          <h3 className="font-heading font-semibold text-xl md:text-2xl lg:text-3xl text-foreground data-text">
            {amount}
          </h3>
          {/* {subtitle && (
            <p className="font-caption text-xs text-muted-foreground mt-1">
              {subtitle}
            </p>
          )} */}
        </div>
        <div className={`${bgColor} rounded-lg p-2 md:p-3 flex-shrink-0`}>
          <Icon name={icon} size={20} color={iconColor} className="md:w-6 md:h-6" />
        </div>
      </div>
      
      {/* {trend && (
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 ${trend === 'up' ? 'text-success' : 'text-error'}`}>
            <Icon name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'} size={16} />
            <span className="font-caption text-xs md:text-sm font-medium">{trendValue}</span>
          </div>
          <span className="font-caption text-xs text-muted-foreground">vs last month</span>
        </div>
      )} */}
    </div>
  );
};

export default FinancialMetricCard;