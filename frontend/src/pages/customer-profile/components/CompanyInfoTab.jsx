import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CompanyInfoTab = ({ companyData, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(companyData);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData?.tradeName?.trim()) {
      newErrors.tradeName = 'Trade name is required';
    }
    if (!formData?.website?.trim()) {
      newErrors.website = 'Website is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onUpdate(formData);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData(companyData);
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-heading font-semibold text-foreground">Company Information</h3>
        {!isEditing ? (
          <Button
            variant="outline"
            size="sm"
            iconName="Edit"
            iconPosition="left"
            onClick={() => setIsEditing(true)}
          >
            Edit Details
          </Button>
        ) : (
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              iconName="Save"
              iconPosition="left"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-caption font-medium text-muted-foreground">Legal Business Name</label>
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md border border-border">
            <Icon name="Building2" size={18} color="var(--color-muted-foreground)" />
            <span className="text-sm font-body text-foreground">{formData?.legalName}</span>
          </div>
          <p className="text-xs font-caption text-muted-foreground">Synced from ERP - Cannot be edited</p>
        </div>

        <div className="space-y-2">
          {isEditing ? (
            <Input
              label="Trade Name"
              type="text"
              value={formData?.tradeName}
              onChange={(e) => handleInputChange('tradeName', e?.target?.value)}
              error={errors?.tradeName}
              placeholder="Enter trade name"
            />
          ) : (
            <>
              <label className="text-sm font-caption font-medium text-muted-foreground">Trade Name</label>
              <div className="flex items-center gap-2 p-3 bg-card rounded-md border border-border">
                <Icon name="Store" size={18} color="var(--color-muted-foreground)" />
                <span className="text-sm font-body text-foreground">{formData?.tradeName}</span>
              </div>
            </>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-caption font-medium text-muted-foreground">Customer Code</label>
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md border border-border">
            <Icon name="Hash" size={18} color="var(--color-muted-foreground)" />
            <span className="text-sm font-body font-semibold text-primary">{formData?.customerCode}</span>
          </div>
          <p className="text-xs font-caption text-muted-foreground">Unique identifier in ERP system</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-caption font-medium text-muted-foreground">Business Type</label>
          <div className="flex items-center gap-2 p-3 bg-card rounded-md border border-border">
            <Icon name="Briefcase" size={18} color="var(--color-muted-foreground)" />
            <span className="text-sm font-body text-foreground">{formData?.businessType}</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-caption font-medium text-muted-foreground">GST Number</label>
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md border border-border">
            <Icon name="FileText" size={18} color="var(--color-muted-foreground)" />
            <span className="text-sm font-body font-semibold text-foreground data-text">{formData?.gstNumber}</span>
          </div>
          <p className="text-xs font-caption text-muted-foreground">Verified GST registration</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-caption font-medium text-muted-foreground">PAN Number</label>
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md border border-border">
            <Icon name="CreditCard" size={18} color="var(--color-muted-foreground)" />
            <span className="text-sm font-body font-semibold text-foreground data-text">{formData?.panNumber}</span>
          </div>
          <p className="text-xs font-caption text-muted-foreground">Permanent Account Number</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-caption font-medium text-muted-foreground">Registration Date</label>
          <div className="flex items-center gap-2 p-3 bg-card rounded-md border border-border">
            <Icon name="Calendar" size={18} color="var(--color-muted-foreground)" />
            <span className="text-sm font-body text-foreground">{formData?.registrationDate}</span>
          </div>
        </div>

        <div className="space-y-2">
          {isEditing ? (
            <Input
              label="Website"
              type="url"
              value={formData?.website}
              onChange={(e) => handleInputChange('website', e?.target?.value)}
              error={errors?.website}
              placeholder="https://example.com"
            />
          ) : (
            <>
              <label className="text-sm font-caption font-medium text-muted-foreground">Website</label>
              <div className="flex items-center gap-2 p-3 bg-card rounded-md border border-border">
                <Icon name="Globe" size={18} color="var(--color-muted-foreground)" />
                <a href={formData?.website} target="_blank" rel="noopener noreferrer" className="text-sm font-body text-primary hover:underline">
                  {formData?.website}
                </a>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="pt-6 border-t border-border">
        <h4 className="text-base font-heading font-semibold text-foreground mb-4">Business Categories</h4>
        <div className="flex flex-wrap gap-2">
          {formData?.categories?.map((category, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-md text-sm font-caption font-medium"
            >
              <Icon name="Tag" size={14} />
              {category}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoTab;