import React from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const NotificationPreferences = ({ preferences, onPreferenceChange, onSave }) => {
  const preferenceCategories = [
    {
      title: 'Order Notifications',
      icon: 'ShoppingCart',
      iconColor: 'var(--color-primary)',
      preferences: [
        { key: 'orderConfirmation', label: 'Order Confirmation', description: 'Get notified when your order is confirmed' },
        { key: 'orderDispatch', label: 'Order Dispatch', description: 'Receive alerts when your order is dispatched' },
        { key: 'orderDelivery', label: 'Order Delivery', description: 'Know when your order is delivered' }
      ]
    },
    {
      title: 'Payment Notifications',
      icon: 'DollarSign',
      iconColor: 'var(--color-warning)',
      preferences: [
        { key: 'paymentDue', label: 'Payment Due Reminders', description: 'Get reminders for upcoming payment due dates' },
        { key: 'paymentReceived', label: 'Payment Received', description: 'Confirmation when payment is processed' },
        { key: 'invoiceGenerated', label: 'Invoice Generated', description: 'Alerts when new invoices are created' }
      ]
    },
    {
      title: 'Scheme & Offers',
      icon: 'Gift',
      iconColor: 'var(--color-accent)',
      preferences: [
        { key: 'newSchemes', label: 'New Schemes', description: 'Be the first to know about new schemes' },
        { key: 'promotionalOffers', label: 'Promotional Offers', description: 'Receive updates on special offers' },
        { key: 'freeGoods', label: 'Free Goods Alerts', description: 'Get notified about free goods availability' }
      ]
    },
    {
      title: 'System Notifications',
      icon: 'Bell',
      iconColor: 'var(--color-muted-foreground)',
      preferences: [
        { key: 'systemUpdates', label: 'System Updates', description: 'Important system maintenance and updates' },
        { key: 'announcements', label: 'Company Announcements', description: 'General announcements from Veeba Foods' },
        { key: 'rateRevisions', label: 'Rate Revisions', description: 'Price and rate change notifications' }
      ]
    }
  ];

  return (
    <div className="bg-card rounded-xl border border-border p-4 md:p-6 shadow-warm-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-heading font-semibold text-lg md:text-xl text-foreground mb-1">
            Notification Preferences
          </h3>
          <p className="text-sm text-muted-foreground">
            Customize which notifications you want to receive
          </p>
        </div>
        <Button
          variant="default"
          iconName="Save"
          onClick={onSave}
        >
          Save Changes
        </Button>
      </div>
      <div className="space-y-6">
        {preferenceCategories?.map((category, categoryIndex) => (
          <div key={categoryIndex} className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                <Icon name={category?.icon} size={18} color={category?.iconColor} />
              </div>
              <h4 className="font-heading font-semibold text-base text-foreground">
                {category?.title}
              </h4>
            </div>

            <div className="space-y-3 pl-0 md:pl-11">
              {category?.preferences?.map((pref) => (
                <Checkbox
                  key={pref?.key}
                  label={pref?.label}
                  description={pref?.description}
                  checked={preferences?.[pref?.key]}
                  onChange={(e) => onPreferenceChange(pref?.key, e?.target?.checked)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} color="var(--color-primary)" className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-foreground font-medium mb-1">
              Email Notifications
            </p>
            <p className="text-sm text-muted-foreground">
              All selected notifications will also be sent to your registered email address. You can manage email preferences separately in your profile settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;