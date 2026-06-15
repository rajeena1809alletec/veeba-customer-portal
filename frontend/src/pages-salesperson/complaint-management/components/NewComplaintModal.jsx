import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const NewComplaintModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    orderReference: '',
    productName: '',
    issueType: '',
    description: '',
    quantityAffected: '',
    expectedResolution: '',
    priority: 'Medium',
    attachments: []
  });

  const [errors, setErrors] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const orderOptions = [
    { value: 'ORD-2026-001', label: 'ORD-2026-001 - 05/01/2026' },
    { value: 'ORD-2026-002', label: 'ORD-2026-002 - 03/01/2026' },
    { value: 'ORD-2025-156', label: 'ORD-2025-156 - 28/12/2025' },
    { value: 'ORD-2025-145', label: 'ORD-2025-145 - 20/12/2025' }
  ];

  const issueTypeOptions = [
    { value: 'Shortage', label: 'Shortage - Missing items in delivery' },
    { value: 'Leakage', label: 'Leakage - Product leaking from packaging' },
    { value: 'Damage', label: 'Damage - Physical damage to product' },
    { value: 'Expiry', label: 'Expiry - Product near or past expiry date' },
    { value: 'Quality Issue', label: 'Quality Issue - Product quality concerns' },
    { value: 'Wrong Product', label: 'Wrong Product - Incorrect item delivered' }
  ];

  const resolutionOptions = [
    { value: 'Credit Note', label: 'Credit Note - Refund to account' },
    { value: 'Replacement', label: 'Replacement - Send replacement product' },
    { value: 'Both', label: 'Both - Credit note and replacement' }
  ];

  const priorityOptions = [
    { value: 'High', label: 'High - Urgent attention required' },
    { value: 'Medium', label: 'Medium - Normal processing' },
    { value: 'Low', label: 'Low - Can wait for resolution' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e?.target?.files);
    const newFiles = files?.map(file => ({
      id: Date.now() + Math.random(),
      name: file?.name,
      size: (file?.size / 1024)?.toFixed(2) + ' KB',
      type: file?.type?.split('/')?.[0]
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev?.filter(f => f?.id !== fileId));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData?.orderReference) newErrors.orderReference = 'Order reference is required';
    if (!formData?.productName) newErrors.productName = 'Product name is required';
    if (!formData?.issueType) newErrors.issueType = 'Issue type is required';
    if (!formData?.description) newErrors.description = 'Description is required';
    if (!formData?.quantityAffected) newErrors.quantityAffected = 'Quantity is required';
    if (!formData?.expectedResolution) newErrors.expectedResolution = 'Expected resolution is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSubmit({ ...formData, attachments: uploadedFiles });
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      orderReference: '',
      productName: '',
      issueType: '',
      description: '',
      quantityAffected: '',
      expectedResolution: '',
      priority: 'Medium',
      attachments: []
    });
    setUploadedFiles([]);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="
        bg-card rounded-xl
        w-full max-w-3xl max-h-[90vh]
        shadow-warm-xl
        overflow-hidden
        animate-slide-in
      ">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
              <Icon name="MessageSquare" size={20} color="var(--color-error)" />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-xl text-foreground">
                Raise New Complaint
              </h2>
              <p className="text-sm text-muted-foreground">
                Report product issues with detailed information
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-md hover:bg-muted transition-smooth"
          >
            <Icon name="X" size={20} color="var(--color-muted-foreground)" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-180px)] scrollbar-custom">
          <div className="p-6 space-y-6">
            {/* Order & Product Information */}
            <div className="space-y-4">
              <h3 className="font-heading font-semibold text-base text-foreground">
                Order & Product Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Order Reference"
                  required
                  options={orderOptions}
                  value={formData?.orderReference}
                  onChange={(value) => handleInputChange('orderReference', value)}
                  error={errors?.orderReference}
                  placeholder="Select order"
                />
                <Input
                  label="Product Name"
                  required
                  type="text"
                  placeholder="Enter product name"
                  value={formData?.productName}
                  onChange={(e) => handleInputChange('productName', e?.target?.value)}
                  error={errors?.productName}
                />
              </div>
            </div>

            {/* Issue Information */}
            <div className="space-y-4">
              <h3 className="font-heading font-semibold text-base text-foreground">
                Issue Information
              </h3>
              <Select
                label="Issue Type"
                required
                options={issueTypeOptions}
                value={formData?.issueType}
                onChange={(value) => handleInputChange('issueType', value)}
                error={errors?.issueType}
                placeholder="Select issue type"
              />
              <Input
                label="Quantity Affected"
                required
                type="number"
                placeholder="Enter quantity"
                value={formData?.quantityAffected}
                onChange={(e) => handleInputChange('quantityAffected', e?.target?.value)}
                error={errors?.quantityAffected}
              />
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Detailed Description <span className="text-error">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Provide detailed description of the issue..."
                  value={formData?.description}
                  onChange={(e) => handleInputChange('description', e?.target?.value)}
                  className={`
                    w-full px-4 py-3 rounded-md
                    bg-background border
                    ${errors?.description ? 'border-error' : 'border-input'}
                    text-foreground placeholder:text-muted-foreground
                    focus:outline-none focus:ring-2 focus:ring-ring
                    transition-smooth
                  `}
                />
                {errors?.description && (
                  <p className="mt-1 text-xs text-error">{errors?.description}</p>
                )}
              </div>
            </div>

            {/* Resolution Preferences */}
            <div className="space-y-4">
              <h3 className="font-heading font-semibold text-base text-foreground">
                Resolution Preferences
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Expected Resolution"
                  required
                  options={resolutionOptions}
                  value={formData?.expectedResolution}
                  onChange={(value) => handleInputChange('expectedResolution', value)}
                  error={errors?.expectedResolution}
                  placeholder="Select resolution type"
                />
                <Select
                  label="Priority Level"
                  required
                  options={priorityOptions}
                  value={formData?.priority}
                  onChange={(value) => handleInputChange('priority', value)}
                  placeholder="Select priority"
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-4">
              <h3 className="font-heading font-semibold text-base text-foreground">
                Supporting Documentation
              </h3>
              <div className="
                border-2 border-dashed border-border rounded-lg
                p-6 text-center
                hover:border-primary hover:bg-primary/5
                transition-smooth
              ">
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Icon name="Upload" size={32} color="var(--color-muted-foreground)" className="mx-auto mb-3" />
                  <p className="text-sm font-medium text-foreground mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Images or PDF files (Max 5MB each)
                  </p>
                </label>
              </div>

              {/* Uploaded Files */}
              {uploadedFiles?.length > 0 && (
                <div className="space-y-2">
                  {uploadedFiles?.map(file => (
                    <div
                      key={file?.id}
                      className="
                        flex items-center justify-between
                        p-3 rounded-md
                        bg-muted
                      "
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Icon
                          name={file?.type === 'image' ? 'Image' : 'FileText'}
                          size={20}
                          color="var(--color-primary)"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {file?.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {file?.size}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(file?.id)}
                        className="p-1 rounded hover:bg-error/10 transition-smooth"
                      >
                        <Icon name="X" size={16} color="var(--color-error)" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Terms Checkbox */}
            <Checkbox
              label="I confirm that the information provided is accurate and complete"
              required
            />
          </div>
        </form>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            iconName="Send"
            iconPosition="right"
            onClick={handleSubmit}
          >
            Submit Complaint
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewComplaintModal;