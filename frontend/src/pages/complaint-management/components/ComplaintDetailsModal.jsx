import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import ComplaintStatusBadge from './ComplaintStatusBadge';
import ComplaintPriorityBadge from './ComplaintPriorityBadge';
import ComplaintTypeIcon from './ComplaintTypeIcon';

const ComplaintDetailsModal = ({ isOpen, onClose, complaint }) => {
  const [activeTab, setActiveTab] = useState('details');

  if (!isOpen || !complaint) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const tabs = [
    { id: 'details', label: 'Details', icon: 'FileText' },
    { id: 'timeline', label: 'Timeline', icon: 'Clock' },
    { id: 'attachments', label: 'Attachments', icon: 'Paperclip' },
    { id: 'resolution', label: 'Resolution', icon: 'CheckCircle' }
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="
        bg-card rounded-xl
        w-full max-w-4xl max-h-[90vh]
        shadow-warm-xl
        overflow-hidden
        animate-slide-in
      ">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <ComplaintTypeIcon type={complaint?.issueType} size={24} />
              <div className="flex-1 min-w-0">
                <h2 className="font-heading font-semibold text-xl md:text-2xl text-foreground mb-2">
                  {complaint?.complaintNumber}
                </h2>
                <div className="flex flex-wrap items-center gap-3">
                  <ComplaintStatusBadge status={complaint?.status} />
                  <ComplaintPriorityBadge priority={complaint?.priority} />
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-muted transition-smooth"
            >
              <Icon name="X" size={20} color="var(--color-muted-foreground)" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto scrollbar-custom">
            {tabs?.map(tab => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-md
                  text-sm font-medium whitespace-nowrap
                  transition-smooth
                  ${activeTab === tab?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted'
                  }
                `}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-240px)] scrollbar-custom">
          {activeTab === 'details' && (
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Date Raised</p>
                  <p className="text-base font-medium text-foreground">
                    {formatDate(complaint?.dateRaised)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Order Reference</p>
                  <p className="text-base font-medium text-foreground">
                    {complaint?.orderReference}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Product Name</p>
                  <p className="text-base font-medium text-foreground">
                    {complaint?.productName}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Issue Type</p>
                  <p className="text-base font-medium text-foreground">
                    {complaint?.issueType}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Quantity Affected</p>
                  <p className="text-base font-medium text-foreground">
                    {complaint?.quantityAffected} units
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Expected Resolution</p>
                  <p className="text-base font-medium text-foreground">
                    {complaint?.expectedResolution}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="font-heading font-semibold text-base text-foreground">
                  Detailed Description
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {complaint?.description}
                </p>
              </div>

              {/* Resolution Timeline */}
              {complaint?.resolutionTimeline && (
                <div className="p-4 rounded-lg bg-muted">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Clock" size={16} color="var(--color-primary)" />
                    <h4 className="font-medium text-sm text-foreground">
                      Expected Resolution Timeline
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {complaint?.resolutionTimeline}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="p-6">
              <div className="space-y-4">
                {complaint?.timeline?.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center
                        ${event?.type === 'success' ? 'bg-success/10' : 'bg-primary/10'}
                      `}>
                        <Icon
                          name={event?.icon}
                          size={18}
                          color={event?.type === 'success' ? 'var(--color-success)' : 'var(--color-primary)'}
                        />
                      </div>
                      {index < complaint?.timeline?.length - 1 && (
                        <div className="w-0.5 h-full bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <h4 className="font-medium text-sm text-foreground">
                          {event?.title}
                        </h4>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(event?.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {event?.description}
                      </p>
                      {event?.user && (
                        <p className="text-xs text-muted-foreground mt-1">
                          By {event?.user}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'attachments' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {complaint?.attachments?.map((file, index) => (
                  <div
                    key={index}
                    className="
                      border border-border rounded-lg p-4
                      hover:shadow-warm-sm transition-smooth
                    "
                  >
                    {file?.type === 'image' ? (
                      <Image
                        src={file?.url}
                        alt={file?.alt}
                        className="w-full h-48 object-cover rounded-md mb-3"
                      />
                    ) : (
                      <div className="w-full h-48 bg-muted rounded-md mb-3 flex items-center justify-center">
                        <Icon name="FileText" size={48} color="var(--color-muted-foreground)" />
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {file?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {file?.size}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Download"
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'resolution' && (
            <div className="p-6 space-y-6">
              {complaint?.resolution ? (
                <>
                  <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="CheckCircle" size={20} color="var(--color-success)" />
                      <h3 className="font-heading font-semibold text-base text-success">
                        Complaint Resolved
                      </h3>
                    </div>
                    <p className="text-sm text-foreground">
                      {complaint?.resolution?.summary}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Resolution Type</p>
                      <p className="text-base font-medium text-foreground">
                        {complaint?.resolution?.type}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Resolution Date</p>
                      <p className="text-base font-medium text-foreground">
                        {formatDate(complaint?.resolution?.date)}
                      </p>
                    </div>
                    {complaint?.resolution?.creditNoteNumber && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Credit Note Number</p>
                        <p className="text-base font-medium text-foreground">
                          {complaint?.resolution?.creditNoteNumber}
                        </p>
                      </div>
                    )}
                    {complaint?.resolution?.replacementOrderNumber && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Replacement Order</p>
                        <p className="text-base font-medium text-foreground">
                          {complaint?.resolution?.replacementOrderNumber}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-foreground">
                      Resolution Details
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {complaint?.resolution?.details}
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Icon name="Clock" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-4" />
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                    Resolution Pending
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Our team is working on resolving your complaint. You will be notified once resolved.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {complaint?.status !== 'Closed' && (
            <Button variant="default" iconName="MessageSquare">
              Add Comment
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailsModal;