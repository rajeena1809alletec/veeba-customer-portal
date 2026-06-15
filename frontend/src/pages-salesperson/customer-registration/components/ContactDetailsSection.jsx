import React from 'react';
import Input from '../../../components/ui/Input';

const ContactDetailsSection = ({ formData, errors, handleInputChange }) => {
  return (
    <div className="bg-card rounded-xl p-6 md:p-8 border border-border shadow-warm-sm">
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <span className="font-heading font-bold text-lg md:text-xl text-primary">2</span>
        </div>
        <div>
          <h2 className="font-heading font-semibold text-xl md:text-2xl text-foreground">
            Contact Details
          </h2>
          <p className="font-caption text-sm text-muted-foreground mt-1">
            Primary contact person and communication details
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Input
          label="Contact Person Name"
          type="text"
          name="contactName"
          placeholder="Enter full name"
          value={formData?.contactName}
          onChange={handleInputChange}
          error={errors?.contactName}
          required
        />

        <Input
          label="Designation"
          type="text"
          name="designation"
          placeholder="Enter designation"
          value={formData?.designation}
          onChange={handleInputChange}
          error={errors?.designation}
          required
        />

        <Input
          label="Mobile Number"
          type="tel"
          name="mobile"
          placeholder="+91 XXXXX XXXXX"
          value={formData?.mobile}
          onChange={handleInputChange}
          error={errors?.mobile}
          required
          pattern="[0-9]{10}"
          description="10-digit mobile number without country code"
        />

        <Input
          label="Alternate Mobile"
          type="tel"
          name="alternateMobile"
          placeholder="+91 XXXXX XXXXX"
          value={formData?.alternateMobile}
          onChange={handleInputChange}
          pattern="[0-9]{10}"
        />

        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="contact@company.com"
          value={formData?.email}
          onChange={handleInputChange}
          error={errors?.email}
          required
          className="md:col-span-2"
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Minimum 8 characters"
          value={formData?.password}
          onChange={handleInputChange}
          error={errors?.password}
          required
          description="Create a secure password for your account"
        />

        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="Re-enter password"
          value={formData?.confirmPassword}
          onChange={handleInputChange}
          error={errors?.confirmPassword}
          required
        />

        <Input
          label="Landline Number"
          type="tel"
          name="landline"
          placeholder="0XX-XXXXXXXX"
          value={formData?.landline}
          onChange={handleInputChange}
          description="Include STD code"
        />

        <Input
          label="Website"
          type="url"
          name="website"
          placeholder="https://www.company.com"
          value={formData?.website}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default ContactDetailsSection;