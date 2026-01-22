import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const BulkActionsBar = ({ 
  selectedCount, 
  onMarkAllRead, 
  onArchiveSelected, 
  onDeleteSelected, 
  onClearSelection 
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[150] animate-slide-up">
      <div className="bg-card rounded-xl border border-border shadow-warm-xl p-4 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="CheckSquare" size={18} color="var(--color-primary)" />
          </div>
          <span className="font-medium text-sm text-foreground whitespace-nowrap">
            {selectedCount} selected
          </span>
        </div>

        <div className="h-6 w-px bg-border"></div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            iconName="Check"
            onClick={onMarkAllRead}
          >
            Mark Read
          </Button>

          <Button
            variant="ghost"
            size="sm"
            iconName="Archive"
            onClick={onArchiveSelected}
          >
            Archive
          </Button>

          <Button
            variant="ghost"
            size="sm"
            iconName="Trash2"
            onClick={onDeleteSelected}
          >
            Delete
          </Button>

          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClearSelection}
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsBar;