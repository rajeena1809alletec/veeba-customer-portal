import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DocumentsSection = ({ documents, onDownload, onView }) => {
  const getDocumentIcon = (type) => {
    const icons = {
      'Invoice': 'FileText',
      'Delivery Challan': 'Truck',
      'Tax Invoice': 'Receipt',
      'Packing List': 'Package',
      'Credit Note': 'FileCheck'
    };
    return icons?.[type] || 'File';
  };

  const getDocumentColor = (type) => {
    const colors = {
      'Invoice': 'var(--color-primary)',
      'Delivery Challan': 'var(--color-accent)',
      'Tax Invoice': 'var(--color-success)',
      'Packing List': 'var(--color-warning)',
      'Credit Note': 'var(--color-error)'
    };
    return colors?.[type] || 'var(--color-muted-foreground)';
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024)?.toFixed(1) + ' KB';
    return (bytes / (1024 * 1024))?.toFixed(1) + ' MB';
  };

  return (
    <div className="bg-card rounded-xl p-4 md:p-6 lg:p-8 shadow-warm-md border border-border">
      <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground mb-6 flex items-center gap-2">
        <Icon name="FolderOpen" size={24} color="var(--color-primary)" />
        Documents & Invoices
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents?.map((doc) => (
          <div
            key={doc?.id}
            className="group relative bg-muted/30 rounded-lg p-4 border border-border hover:border-primary/30 hover:shadow-warm-sm transition-smooth"
          >
            <div className="flex gap-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-smooth group-hover:scale-110"
                style={{ backgroundColor: `${getDocumentColor(doc?.type)}15` }}
              >
                <Icon
                  name={getDocumentIcon(doc?.type)}
                  size={24}
                  color={getDocumentColor(doc?.type)}
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-body font-semibold text-foreground text-sm md:text-base mb-1 line-clamp-1">
                  {doc?.type}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground font-caption mb-2">
                  {doc?.documentNumber}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground font-caption">
                  <span className="flex items-center gap-1">
                    <Icon name="Calendar" size={12} />
                    {doc?.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="HardDrive" size={12} />
                    {formatFileSize(doc?.fileSize)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                iconName="Eye"
                onClick={() => onView(doc)}
                fullWidth
              >
                View
              </Button>
              <Button
                variant="default"
                size="sm"
                iconName="Download"
                onClick={() => onDownload(doc)}
                fullWidth
              >
                Download
              </Button>
            </div>

            {doc?.isNew && (
              <div className="absolute top-2 right-2">
                <span className="px-2 py-1 bg-accent text-accent-foreground text-xs font-caption font-medium rounded-md">
                  New
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} color="var(--color-primary)" className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm md:text-base text-foreground font-body mb-1">
              Document Access Information
            </p>
            <p className="text-xs md:text-sm text-muted-foreground font-caption">
              All documents are available in PDF format. Documents are retained for 7 years as per GST compliance requirements. For any discrepancies, please contact support within 7 days of document generation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsSection;