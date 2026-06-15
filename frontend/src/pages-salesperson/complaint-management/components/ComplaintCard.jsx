import React from 'react';
import Icon from '../../../components/AppIcon';
import ComplaintStatusBadge from './ComplaintStatusBadge';
import ComplaintTypeIcon from './ComplaintTypeIcon';
import ComplaintPriorityBadge from './ComplaintPriorityBadge';

const ComplaintCard = ({ complaint, onViewDetails }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div className="
      bg-card rounded-xl p-4 md:p-6
      border border-border
      shadow-warm-sm hover:shadow-warm-md
      transition-smooth
      hover:scale-[1.01]
    ">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <ComplaintTypeIcon type={complaint?.issueType} />
            <div className="flex-1 min-w-0">
              <h3 className="font-heading font-semibold text-base md:text-lg text-foreground mb-1 truncate">
                {complaint?.complaintNumber}
              </h3>
              <p className="text-sm text-muted-foreground">
                Raised on {formatDate(complaint?.dateRaised)}
              </p>
            </div>
          </div>
          <ComplaintStatusBadge status={complaint?.status} />
        </div>

        {/* Issue Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Icon name="Package" size={16} color="var(--color-muted-foreground)" />
            <span className="text-muted-foreground">Product:</span>
            <span className="text-foreground font-medium truncate">{complaint?.productName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Icon name="FileText" size={16} color="var(--color-muted-foreground)" />
            <span className="text-muted-foreground">Order:</span>
            <span className="text-foreground font-medium">{complaint?.orderReference}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Icon name="Tag" size={16} color="var(--color-muted-foreground)" />
            <span className="text-muted-foreground">Issue:</span>
            <span className="text-foreground font-medium">{complaint?.issueType}</span>
          </div>
        </div>

        {/* Priority & Resolution */}
        <div className="flex flex-wrap items-center gap-3">
          <ComplaintPriorityBadge priority={complaint?.priority} />
          {complaint?.expectedResolution && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Icon name="Target" size={14} />
              <span>Expected: {complaint?.expectedResolution}</span>
            </div>
          )}
        </div>

        {/* Description Preview */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {complaint?.description}
        </p>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {complaint?.attachmentCount > 0 && (
              <div className="flex items-center gap-1">
                <Icon name="Paperclip" size={14} />
                <span>{complaint?.attachmentCount} files</span>
              </div>
            )}
            {complaint?.resolutionTimeline && (
              <div className="flex items-center gap-1">
                <Icon name="Clock" size={14} />
                <span>{complaint?.resolutionTimeline}</span>
              </div>
            )}
          </div>
          <button
            onClick={() => onViewDetails(complaint)}
            className="
              flex items-center gap-2
              px-4 py-2 rounded-md
              text-sm font-medium
              text-primary bg-primary/10
              hover:bg-primary/20
              transition-smooth
            "
          >
            <span>View Details</span>
            <Icon name="ArrowRight" size={16} color="var(--color-primary)" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintCard;