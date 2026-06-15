import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DocumentsTab = ({ documents }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Business Registration', 'Tax Documents', 'Agreements', 'Certificates'];

  const getDocumentIcon = (type) => {
    switch (type) {
      case 'PDF':
        return 'FileText';
      case 'Image':
        return 'Image';
      case 'Excel':
        return 'FileSpreadsheet';
      default:
        return 'File';
    }
  };

  const getDocumentColor = (type) => {
    switch (type) {
      case 'PDF':
        return 'bg-error/10 text-error';
      case 'Image':
        return 'bg-primary/10 text-primary';
      case 'Excel':
        return 'bg-success/10 text-success';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Verified':
        return 'bg-success/10 text-success';
      case 'Pending':
        return 'bg-warning/10 text-warning';
      case 'Expired':
        return 'bg-error/10 text-error';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const filteredDocuments = selectedCategory === 'All'
    ? documents
    : documents?.filter(doc => doc?.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-heading font-semibold text-foreground">Documents</h3>
          <p className="text-sm font-caption text-muted-foreground mt-1">
            Manage business certificates and agreements
          </p>
        </div>
        <Button
          variant="default"
          size="sm"
          iconName="Upload"
          iconPosition="left"
        >
          Upload Document
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {categories?.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`
              px-4 py-2 rounded-lg text-sm font-caption font-medium transition-smooth
              ${selectedCategory === category
                ? 'bg-primary text-primary-foreground shadow-warm-sm'
                : 'bg-card text-muted-foreground hover:bg-muted border border-border'
              }
            `}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDocuments?.map((document) => (
          <div
            key={document?.id}
            className="bg-card rounded-xl p-6 border border-border shadow-warm-sm hover:shadow-warm-md transition-smooth"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getDocumentColor(document?.type)}`}>
                  <Icon name={getDocumentIcon(document?.type)} size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-heading font-semibold text-foreground truncate">
                    {document?.name}
                  </h4>
                  <p className="text-sm font-caption text-muted-foreground mt-1">
                    {document?.category}
                  </p>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-caption font-medium flex-shrink-0 ml-2 ${getStatusColor(document?.status)}`}>
                <Icon name={document?.status === 'Verified' ? 'CheckCircle' : document?.status === 'Pending' ? 'Clock' : 'AlertCircle'} size={12} />
                {document?.status}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2">
                <Icon name="Calendar" size={16} color="var(--color-muted-foreground)" />
                <div className="flex-1">
                  <p className="text-xs font-caption text-muted-foreground">Upload Date</p>
                  <p className="text-sm font-body text-foreground">{document?.uploadDate}</p>
                </div>
              </div>

              {document?.expiryDate && (
                <div className="flex items-center gap-2">
                  <Icon name="CalendarX" size={16} color="var(--color-muted-foreground)" />
                  <div className="flex-1">
                    <p className="text-xs font-caption text-muted-foreground">Expiry Date</p>
                    <p className="text-sm font-body text-foreground">{document?.expiryDate}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Icon name="HardDrive" size={16} color="var(--color-muted-foreground)" />
                <div className="flex-1">
                  <p className="text-xs font-caption text-muted-foreground">File Size</p>
                  <p className="text-sm font-body text-foreground data-text">{document?.size}</p>
                </div>
              </div>

              {document?.documentNumber && (
                <div className="flex items-center gap-2">
                  <Icon name="Hash" size={16} color="var(--color-muted-foreground)" />
                  <div className="flex-1">
                    <p className="text-xs font-caption text-muted-foreground">Document Number</p>
                    <p className="text-sm font-body text-foreground font-medium data-text">{document?.documentNumber}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                iconPosition="left"
                className="flex-1"
              >
                Download
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconName="Eye"
                iconPosition="left"
                className="flex-1"
              >
                View
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconName="Trash2"
              >
              </Button>
            </div>
          </div>
        ))}
      </div>
      {filteredDocuments?.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="FileX" size={32} color="var(--color-muted-foreground)" />
          </div>
          <h4 className="text-base font-heading font-semibold text-foreground mb-2">No Documents Found</h4>
          <p className="text-sm font-caption text-muted-foreground">
            No documents available in this category
          </p>
        </div>
      )}
      <div className="bg-muted/50 rounded-xl p-6 border border-border">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="Info" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h4 className="text-sm font-heading font-semibold text-foreground mb-2">Document Guidelines</h4>
            <ul className="text-sm font-caption text-muted-foreground space-y-1">
              <li>• Supported formats: PDF, JPG, PNG, Excel (max 10MB per file)</li>
              <li>• Business registration documents must be verified by admin</li>
              <li>• Tax documents should be updated annually</li>
              <li>• Expired documents will be flagged and require renewal</li>
              <li>• All documents are securely stored and encrypted</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsTab;