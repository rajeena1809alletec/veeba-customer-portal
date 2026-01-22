import React from 'react';
import Icon from '../../../components/AppIcon';

const BrandHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center transition-smooth hover:scale-105">
          <Icon name="Utensils" size={40} color="var(--color-primary)" />
        </div>
      </div>
      <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-3">
        Veeba Foods
      </h1>
      <p className="font-body text-base md:text-lg text-muted-foreground mb-2">
        B2B Customer Portal
      </p>
      <p className="font-caption text-sm text-muted-foreground max-w-md mx-auto">
        Access your account to manage orders, invoices, and business operations
      </p>
    </div>
  );
};

export default BrandHeader;