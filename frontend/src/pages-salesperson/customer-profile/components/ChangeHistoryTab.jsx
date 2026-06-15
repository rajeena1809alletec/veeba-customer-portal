import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';

const ChangeHistoryTab = ({ history }) => {
  const [filterType, setFilterType] = useState('All');

  const typeOptions = [
    { value: 'All', label: 'All Changes' },
    { value: 'Profile Update', label: 'Profile Updates' },
    { value: 'Contact Change', label: 'Contact Changes' },
    { value: 'Address Update', label: 'Address Updates' },
    { value: 'Document Upload', label: 'Document Uploads' },
    { value: 'Financial Update', label: 'Financial Updates' },
  ];

  const getChangeIcon = (type) => {
    switch (type) {
      case 'Profile Update':
        return 'User';
      case 'Contact Change':
        return 'Phone';
      case 'Address Update':
        return 'MapPin';
      case 'Document Upload':
        return 'Upload';
      case 'Financial Update':
        return 'DollarSign';
      default:
        return 'Edit';
    }
  };

  const getChangeColor = (type) => {
    switch (type) {
      case 'Profile Update':
        return 'bg-primary/10 text-primary';
      case 'Contact Change':
        return 'bg-accent/10 text-accent';
      case 'Address Update':
        return 'bg-warning/10 text-warning';
      case 'Document Upload':
        return 'bg-success/10 text-success';
      case 'Financial Update':
        return 'bg-error/10 text-error';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const filteredHistory = filterType === 'All'
    ? history
    : history?.filter(item => item?.type === filterType);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-heading font-semibold text-foreground">Change History</h3>
          <p className="text-sm font-caption text-muted-foreground mt-1">
            Track all modifications to your profile
          </p>
        </div>
        <div className="w-full sm:w-64">
          <Select
            options={typeOptions}
            value={filterType}
            onChange={setFilterType}
            placeholder="Filter by type"
          />
        </div>
      </div>
      <div className="space-y-4">
        {filteredHistory?.map((item, index) => (
          <div
            key={item?.id}
            className="bg-card rounded-xl p-6 border border-border shadow-warm-sm hover:shadow-warm-md transition-smooth"
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getChangeColor(item?.type)}`}>
                <Icon name={getChangeIcon(item?.type)} size={24} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-heading font-semibold text-foreground">
                      {item?.title}
                    </h4>
                    <p className="text-sm font-caption text-muted-foreground mt-1">
                      {item?.description}
                    </p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-caption font-medium flex-shrink-0 ${getChangeColor(item?.type)}`}>
                    {item?.type}
                  </span>
                </div>

                {item?.changes && (
                  <div className="bg-muted/50 rounded-lg p-4 mb-3 space-y-2">
                    {item?.changes?.map((change, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <Icon name="ArrowRight" size={16} color="var(--color-muted-foreground)" className="mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="font-caption text-muted-foreground">{change?.field}: </span>
                          <span className="font-body text-foreground line-through opacity-60">{change?.oldValue}</span>
                          <span className="font-body text-muted-foreground mx-2">→</span>
                          <span className="font-body text-foreground font-medium">{change?.newValue}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4 text-xs font-caption text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Icon name="User" size={14} />
                    <span>{item?.modifiedBy}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Icon name="Calendar" size={14} />
                    <span>{item?.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Icon name="Clock" size={14} />
                    <span>{item?.time}</span>
                  </div>
                  {item?.ipAddress && (
                    <div className="flex items-center gap-1.5">
                      <Icon name="Globe" size={14} />
                      <span className="data-text">{item?.ipAddress}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredHistory?.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="History" size={32} color="var(--color-muted-foreground)" />
          </div>
          <h4 className="text-base font-heading font-semibold text-foreground mb-2">No Changes Found</h4>
          <p className="text-sm font-caption text-muted-foreground">
            No change history available for the selected filter
          </p>
        </div>
      )}
      <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="Shield" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h4 className="text-sm font-heading font-semibold text-foreground mb-2">Audit Trail Information</h4>
            <ul className="text-sm font-caption text-muted-foreground space-y-1">
              <li>• All profile changes are automatically logged for security and compliance</li>
              <li>• Change history is retained for 2 years as per company policy</li>
              <li>• Critical changes require admin approval and are highlighted</li>
              <li>• IP addresses and timestamps are recorded for audit purposes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeHistoryTab;