import React from 'react';
import Icon from '../../../components/AppIcon';

const FinancialInfoTab = ({ financialData }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    })?.format(amount);
  };

  const getUtilizationPercentage = () => {
    return ((financialData?.creditUsed / financialData?.creditLimit) * 100)?.toFixed(1);
  };

  const getUtilizationColor = () => {
    const percentage = getUtilizationPercentage();
    if (percentage >= 90) return 'bg-error';
    if (percentage >= 70) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-heading font-semibold text-foreground mb-6">Financial Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20 shadow-warm-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <Icon name="CreditCard" size={24} color="var(--color-primary)" />
            </div>
            <div>
              <p className="text-sm font-caption text-muted-foreground">Credit Limit</p>
              <p className="text-2xl font-heading font-bold text-primary data-text">
                {formatCurrency(financialData?.creditLimit)}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs font-caption">
            <span className="text-muted-foreground">Available</span>
            <span className="text-foreground font-semibold data-text">
              {formatCurrency(financialData?.creditLimit - financialData?.creditUsed)}
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-6 border border-accent/20 shadow-warm-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" size={24} color="var(--color-accent)" />
            </div>
            <div>
              <p className="text-sm font-caption text-muted-foreground">Credit Used</p>
              <p className="text-2xl font-heading font-bold text-accent data-text">
                {formatCurrency(financialData?.creditUsed)}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-caption">
              <span className="text-muted-foreground">Utilization</span>
              <span className="text-foreground font-semibold">{getUtilizationPercentage()}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${getUtilizationColor()} transition-smooth`}
                style={{ width: `${getUtilizationPercentage()}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-warning/10 to-warning/5 rounded-xl p-6 border border-warning/20 shadow-warm-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-warning/20 rounded-lg flex items-center justify-center">
              <Icon name="Clock" size={24} color="var(--color-warning)" />
            </div>
            <div>
              <p className="text-sm font-caption text-muted-foreground">Payment Terms</p>
              <p className="text-2xl font-heading font-bold text-warning">
                {financialData?.paymentTerms}
              </p>
            </div>
          </div>
          <p className="text-xs font-caption text-muted-foreground">
            Standard credit period from invoice date
          </p>
        </div>
      </div>
      <div className="bg-card rounded-xl p-6 border border-border shadow-warm-sm">
        <h4 className="text-base font-heading font-semibold text-foreground mb-4">Pricing Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
              <div className="flex items-center gap-2">
                <Icon name="Tag" size={18} color="var(--color-muted-foreground)" />
                <span className="text-sm font-caption text-muted-foreground">Price List</span>
              </div>
              <span className="text-sm font-body font-semibold text-foreground">{financialData?.priceList}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
              <div className="flex items-center gap-2">
                <Icon name="Percent" size={18} color="var(--color-muted-foreground)" />
                <span className="text-sm font-caption text-muted-foreground">Discount Tier</span>
              </div>
              <span className="text-sm font-body font-semibold text-foreground">{financialData?.discountTier}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
              <div className="flex items-center gap-2">
                <Icon name="Award" size={18} color="var(--color-muted-foreground)" />
                <span className="text-sm font-caption text-muted-foreground">Customer Category</span>
              </div>
              <span className="text-sm font-body font-semibold text-foreground">{financialData?.customerCategory}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
              <div className="flex items-center gap-2">
                <Icon name="DollarSign" size={18} color="var(--color-muted-foreground)" />
                <span className="text-sm font-caption text-muted-foreground">Currency</span>
              </div>
              <span className="text-sm font-body font-semibold text-foreground">{financialData?.currency}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
              <div className="flex items-center gap-2">
                <Icon name="TrendingDown" size={18} color="var(--color-muted-foreground)" />
                <span className="text-sm font-caption text-muted-foreground">Trade Discount</span>
              </div>
              <span className="text-sm font-body font-semibold text-success">{financialData?.tradeDiscount}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
              <div className="flex items-center gap-2">
                <Icon name="Gift" size={18} color="var(--color-muted-foreground)" />
                <span className="text-sm font-caption text-muted-foreground">Scheme Eligible</span>
              </div>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-caption font-medium ${
                financialData?.schemeEligible ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
              }`}>
                <Icon name={financialData?.schemeEligible ? 'CheckCircle' : 'XCircle'} size={12} />
                {financialData?.schemeEligible ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-card rounded-xl p-6 border border-border shadow-warm-sm">
        <h4 className="text-base font-heading font-semibold text-foreground mb-4">Account Status</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="CheckCircle" size={20} color="var(--color-success)" />
            </div>
            <div>
              <p className="text-xs font-caption text-muted-foreground">Account Status</p>
              <p className="text-sm font-body font-semibold text-success">Active</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Calendar" size={20} color="var(--color-primary)" />
            </div>
            <div>
              <p className="text-xs font-caption text-muted-foreground">Last Review</p>
              <p className="text-sm font-body font-semibold text-foreground">{financialData?.lastReviewDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name="Calendar" size={20} color="var(--color-accent)" />
            </div>
            <div>
              <p className="text-xs font-caption text-muted-foreground">Next Review</p>
              <p className="text-sm font-body font-semibold text-foreground">{financialData?.nextReviewDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="Star" size={20} color="var(--color-warning)" />
            </div>
            <div>
              <p className="text-xs font-caption text-muted-foreground">Credit Rating</p>
              <p className="text-sm font-body font-semibold text-foreground">{financialData?.creditRating}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="Info" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h4 className="text-sm font-heading font-semibold text-foreground mb-2">Important Notes</h4>
            <ul className="text-sm font-caption text-muted-foreground space-y-1">
              <li>• All financial data is synced from Business Central ERP system</li>
              <li>• Credit limit changes require approval from finance team</li>
              <li>• Payment terms are based on your credit rating and payment history</li>
              <li>• Pricing tiers are reviewed quarterly based on purchase volume</li>
              <li>• Contact your account manager for credit limit increase requests</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialInfoTab;