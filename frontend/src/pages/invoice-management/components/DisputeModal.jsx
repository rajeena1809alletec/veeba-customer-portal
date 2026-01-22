import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

import Select from '../../../components/ui/Select';

const DisputeModal = ({ invoice, onClose }) => {
  const [disputeType, setDisputeType] = useState('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const disputeTypes = [
    { value: 'incorrect_amount', label: 'Incorrect Amount' },
    { value: 'wrong_items', label: 'Wrong Items Billed' },
    { value: 'quality_issue', label: 'Quality Issue' },
    { value: 'duplicate_invoice', label: 'Duplicate Invoice' },
    { value: 'pricing_error', label: 'Pricing Error' },
    { value: 'other', label: 'Other' }
  ];

  const handleFileChange = (e) => {
    const files = Array.from(e?.target?.files);
    setAttachments([...attachments, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments(attachments?.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      alert('Dispute raised successfully! Our team will review and contact you within 24 hours.');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card rounded-xl shadow-warm-xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="AlertTriangle" size={20} color="var(--color-warning)" />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-lg md:text-xl text-foreground">
                Raise Dispute
              </h2>
              <p className="font-caption text-sm text-muted-foreground">
                {invoice?.invoiceNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-smooth"
          >
            <Icon name="X" size={20} color="var(--color-foreground)" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 overflow-y-auto scrollbar-custom max-h-[calc(90vh-180px)] space-y-6">
          {/* Invoice Details */}
          <div className="bg-muted/30 rounded-lg p-4">
            <h3 className="font-caption font-semibold text-sm text-foreground mb-3">
              Invoice Details
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Invoice No:</span>
                <p className="font-data font-semibold text-foreground">{invoice?.invoiceNumber}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Date:</span>
                <p className="font-caption text-foreground">{invoice?.date}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Amount:</span>
                <p className="font-data font-semibold text-foreground">
                  ₹{invoice?.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Order Ref:</span>
                <p className="font-caption text-foreground">{invoice?.orderRef}</p>
              </div>
            </div>
          </div>

          {/* Dispute Form */}
          <div className="space-y-4">
            <Select
              label="Dispute Type"
              placeholder="Select dispute reason"
              description="Choose the primary reason for raising this dispute"
              options={disputeTypes}
              value={disputeType}
              onChange={setDisputeType}
              required
            />

            <div>
              <label className="block font-caption font-medium text-sm text-foreground mb-2">
                Description <span className="text-error">*</span>
              </label>
              <textarea
                className="w-full px-4 py-3 bg-background border border-input rounded-lg font-caption text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth resize-none"
                rows="4"
                placeholder="Please provide detailed information about the dispute..."
                value={description}
                onChange={(e) => setDescription(e?.target?.value)}
                required
              />
              <p className="mt-1 font-caption text-xs text-muted-foreground">
                Minimum 20 characters required
              </p>
            </div>

            {/* File Upload */}
            <div>
              <label className="block font-caption font-medium text-sm text-foreground mb-2">
                Attachments
              </label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-smooth">
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="Upload" size={24} color="var(--color-primary)" />
                  </div>
                  <div>
                    <p className="font-caption font-medium text-sm text-foreground">
                      Click to upload files
                    </p>
                    <p className="font-caption text-xs text-muted-foreground mt-1">
                      PNG, JPG, PDF up to 10MB each
                    </p>
                  </div>
                </label>
              </div>

              {/* Attachment List */}
              {attachments?.length > 0 && (
                <div className="mt-4 space-y-2">
                  {attachments?.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center flex-shrink-0">
                          <Icon name="File" size={16} color="var(--color-primary)" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-caption text-sm text-foreground truncate">
                            {file?.name}
                          </p>
                          <p className="font-caption text-xs text-muted-foreground">
                            {(file?.size / 1024)?.toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeAttachment(index)}
                        className="p-1.5 rounded hover:bg-error/10 transition-smooth"
                      >
                        <Icon name="X" size={16} color="var(--color-error)" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Important Notice */}
          <div className="flex items-start gap-3 p-4 bg-warning/5 rounded-lg border border-warning/20">
            <Icon name="Info" size={20} color="var(--color-warning)" />
            <div>
              <p className="font-caption text-xs text-foreground">
                <strong>Important:</strong> Our team will review your dispute within 24-48 hours. You will receive updates via email and notifications. Please ensure all information provided is accurate.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 md:p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            iconName="Send"
            iconPosition="left"
            onClick={handleSubmit}
            loading={submitting}
            disabled={!disputeType || description?.length < 20}
          >
            {submitting ? 'Submitting...' : 'Submit Dispute'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DisputeModal;