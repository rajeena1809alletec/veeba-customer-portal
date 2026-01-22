import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const AgingAnalysisChart = ({ data }) => {
  const COLORS = [
    'var(--color-success)',
    'var(--color-primary)',
    'var(--color-warning)',
    'var(--color-error)'
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-warm-md">
          <p className="font-caption text-xs text-muted-foreground mb-1">
            {payload?.[0]?.payload?.period}
          </p>
          <p className="font-body text-sm font-semibold text-foreground data-text">
            ₹{payload?.[0]?.value?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-xl p-4 md:p-6 border border-border shadow-warm-sm">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h3 className="font-heading font-semibold text-base md:text-lg text-foreground">
          Aging Analysis
        </h3>
        <span className="font-caption text-xs text-muted-foreground">
          Outstanding by Period
        </span>
      </div>
      <div className="w-full h-64 md:h-80" aria-label="Aging Analysis Bar Chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="period" 
              tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--color-border)' }}
            />
            <YAxis 
              tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--color-border)' }}
              tickFormatter={(value) => `₹${(value / 100000)?.toFixed(0)}L`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-muted)' }} />
            <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
              {data?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-4 md:mt-6">
        {data?.map((item, index) => (
          <div key={item?.period} className="text-center">
            <div 
              className="w-3 h-3 rounded-full mx-auto mb-2" 
              style={{ backgroundColor: COLORS?.[index % COLORS?.length] }}
            />
            <p className="font-caption text-xs text-muted-foreground mb-1">
              {item?.period}
            </p>
            <p className="font-body text-sm font-semibold text-foreground data-text">
              ₹{item?.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgingAnalysisChart;