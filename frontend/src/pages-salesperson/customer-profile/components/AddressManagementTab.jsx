import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AddressManagementTab = ({ addresses }) => {
  const [selectedAddress, setSelectedAddress] = useState(null);

  const getAddressTypeIcon = (type) => {
    switch (type) {
      case 'Billing':
        return 'FileText';
      case 'Shipping':
        return 'Truck';
      case 'Warehouse':
        return 'Warehouse';
      default:
        return 'MapPin';
    }
  };

  const getAddressTypeColor = (type) => {
    switch (type) {
      case 'Billing':
        return 'bg-primary/10 text-primary';
      case 'Shipping':
        return 'bg-accent/10 text-accent';
      case 'Warehouse':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-heading font-semibold text-foreground">Address Management</h3>
          <p className="text-sm font-caption text-muted-foreground mt-1">
            Manage billing and shipping locations
          </p>
        </div>
        <Button
          variant="default"
          size="sm"
          iconName="Plus"
          iconPosition="left"
        >
          Add New Address
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {addresses?.map((address) => (
          <div
            key={address?.id}
            className={`
              bg-card rounded-xl p-6 border-2 transition-smooth cursor-pointer
              ${selectedAddress === address?.id 
                ? 'border-primary shadow-warm-md' 
                : 'border-border shadow-warm-sm hover:border-primary/50'
              }
            `}
            onClick={() => setSelectedAddress(address?.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getAddressTypeColor(address?.type)}`}>
                  <Icon name={getAddressTypeIcon(address?.type)} size={20} />
                </div>
                <div>
                  <h4 className="text-base font-heading font-semibold text-foreground">{address?.label}</h4>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-caption font-medium mt-1 ${getAddressTypeColor(address?.type)}`}>
                    {address?.type}
                  </span>
                </div>
              </div>
              {address?.isDefault && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-success/10 text-success rounded text-xs font-caption font-medium">
                  <Icon name="CheckCircle" size={12} />
                  Default
                </span>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Icon name="MapPin" size={16} color="var(--color-muted-foreground)" className="mt-0.5 flex-shrink-0" />
                <p className="text-sm font-body text-foreground leading-relaxed">
                  {address?.street}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Icon name="Building2" size={16} color="var(--color-muted-foreground)" />
                <p className="text-sm font-body text-foreground">
                  {address?.city}, {address?.state}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Icon name="Hash" size={16} color="var(--color-muted-foreground)" />
                <p className="text-sm font-body text-foreground data-text">
                  PIN: {address?.pinCode}
                </p>
              </div>

              {address?.gstNumber && (
                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <Icon name="FileText" size={16} color="var(--color-muted-foreground)" />
                  <div>
                    <p className="text-xs font-caption text-muted-foreground">GST Number</p>
                    <p className="text-sm font-body text-foreground font-medium data-text">{address?.gstNumber}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                iconName="Edit"
                iconPosition="left"
                className="flex-1"
              >
                Edit
              </Button>
              {!address?.isDefault && (
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Star"
                  iconPosition="left"
                  className="flex-1"
                >
                  Set Default
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-muted/50 rounded-xl p-6 border border-border">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="Info" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h4 className="text-sm font-heading font-semibold text-foreground mb-1">Address Guidelines</h4>
            <ul className="text-sm font-caption text-muted-foreground space-y-1">
              <li>• Billing address must match GST registration details</li>
              <li>• Multiple shipping addresses can be added for different locations</li>
              <li>• Default address will be used for new orders automatically</li>
              <li>• Address changes require ERP synchronization (may take 24-48 hours)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressManagementTab;