import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ContactDetailsTab = ({ contacts, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(contacts);
  const [errors, setErrors] = useState({});

  const handleInputChange = (index, field, value) => {
    const updatedContacts = [...formData];
    updatedContacts[index] = { ...updatedContacts?.[index], [field]: value };
    setFormData(updatedContacts);
    
    if (errors?.[`${index}-${field}`]) {
      setErrors(prev => ({ ...prev, [`${index}-${field}`]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    formData?.forEach((contact, index) => {
      if (!contact?.name?.trim()) {
        newErrors[`${index}-name`] = 'Name is required';
      }
      if (!contact?.email?.trim()) {
        newErrors[`${index}-email`] = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(contact?.email)) {
        newErrors[`${index}-email`] = 'Invalid email format';
      }
      if (!contact?.phone?.trim()) {
        newErrors[`${index}-phone`] = 'Phone is required';
      } else if (!/^\+91[0-9]{10}$/?.test(contact?.phone)) {
        newErrors[`${index}-phone`] = 'Invalid phone format (+91XXXXXXXXXX)';
      }
    });
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
    setFormData(contacts);
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-heading font-semibold text-foreground">Contact Details</h3>
        {!isEditing ? (
          <Button
            variant="outline"
            size="sm"
            iconName="Edit"
            iconPosition="left"
            onClick={() => setIsEditing(true)}
          >
            Edit Contacts
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {formData?.map((contact, index) => (
          <div
            key={index}
            className="bg-card rounded-xl p-6 border border-border shadow-warm-sm space-y-4"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  contact?.isPrimary ? 'bg-primary/10' : 'bg-muted'
                }`}>
                  <Icon
                    name="User"
                    size={24}
                    color={contact?.isPrimary ? 'var(--color-primary)' : 'var(--color-muted-foreground)'}
                  />
                </div>
                <div>
                  <h4 className="text-base font-heading font-semibold text-foreground">{contact?.designation}</h4>
                  {contact?.isPrimary && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-caption font-medium mt-1">
                      <Icon name="Star" size={12} />
                      Primary Contact
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {isEditing ? (
                <>
                  <Input
                    label="Full Name"
                    type="text"
                    value={contact?.name}
                    onChange={(e) => handleInputChange(index, 'name', e?.target?.value)}
                    error={errors?.[`${index}-name`]}
                    placeholder="Enter full name"
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={contact?.email}
                    onChange={(e) => handleInputChange(index, 'email', e?.target?.value)}
                    error={errors?.[`${index}-email`]}
                    placeholder="email@example.com"
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    value={contact?.phone}
                    onChange={(e) => handleInputChange(index, 'phone', e?.target?.value)}
                    error={errors?.[`${index}-phone`]}
                    placeholder="+91XXXXXXXXXX"
                  />
                  <Input
                    label="Department"
                    type="text"
                    value={contact?.department}
                    onChange={(e) => handleInputChange(index, 'department', e?.target?.value)}
                    placeholder="Enter department"
                  />
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <Icon name="User" size={18} color="var(--color-muted-foreground)" />
                    <div>
                      <p className="text-xs font-caption text-muted-foreground">Name</p>
                      <p className="text-sm font-body text-foreground font-medium">{contact?.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Icon name="Mail" size={18} color="var(--color-muted-foreground)" />
                    <div>
                      <p className="text-xs font-caption text-muted-foreground">Email</p>
                      <a href={`mailto:${contact?.email}`} className="text-sm font-body text-primary hover:underline">
                        {contact?.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Icon name="Phone" size={18} color="var(--color-muted-foreground)" />
                    <div>
                      <p className="text-xs font-caption text-muted-foreground">Phone</p>
                      <a href={`tel:${contact?.phone}`} className="text-sm font-body text-primary hover:underline data-text">
                        {contact?.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Icon name="Building" size={18} color="var(--color-muted-foreground)" />
                    <div>
                      <p className="text-xs font-caption text-muted-foreground">Department</p>
                      <p className="text-sm font-body text-foreground">{contact?.department}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactDetailsTab;