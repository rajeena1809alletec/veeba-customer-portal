import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CompanyInformationSection = ({ formData, errors, handleInputChange }) => {
  const businessTypeOptions = [
    { value: 'proprietorship', label: 'Proprietorship' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'private_limited', label: 'Private Limited Company' },
    { value: 'public_limited', label: 'Public Limited Company' },
    { value: 'llp', label: 'Limited Liability Partnership (LLP)' },
    { value: 'trust', label: 'Trust' },
    { value: 'society', label: 'Society' },
  ];

  const industryTypeOptions = [
    { value: 'distributor', label: 'Distributor' },
    { value: 'modern_trade', label: 'Modern Trade / Supermarket Chain' },
    { value: 'qsr', label: 'QSR Chain' },
    { value: 'hotel', label: 'Hotel / Restaurant' },
    { value: 'cloud_kitchen', label: 'Cloud Kitchen' },
    { value: 'kirana', label: 'Kirana Store' },
    { value: 'catering', label: 'Catering Service' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="bg-card rounded-xl p-6 md:p-8 border border-border shadow-warm-sm">
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <span className="font-heading font-bold text-lg md:text-xl text-primary">1</span>
        </div>
        <div>
          <h2 className="font-heading font-semibold text-xl md:text-2xl text-foreground">
            Company Information
          </h2>
          <p className="font-caption text-sm text-muted-foreground mt-1">
            Basic business details and registration information
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Input
          label="Business Name"
          type="text"
          name="businessName"
          placeholder="Enter registered business name"
          value={formData?.businessName}
          onChange={handleInputChange}
          error={errors?.businessName}
          required
          className="md:col-span-2"
        />

        <Input
          label="Trade Name (if different)"
          type="text"
          name="tradeName"
          placeholder="Enter trade name"
          value={formData?.tradeName}
          onChange={handleInputChange}
        />

        <Select
          label="Business Type"
          name="businessType"
          options={businessTypeOptions}
          value={formData?.businessType}
          onChange={(value) => handleInputChange({ target: { name: 'businessType', value } })}
          error={errors?.businessType}
          required
          placeholder="Select business type"
        />

        <Select
          label="Industry Type"
          name="industryType"
          options={industryTypeOptions}
          value={formData?.industryType}
          onChange={(value) => handleInputChange({ target: { name: 'industryType', value } })}
          error={errors?.industryType}
          required
          placeholder="Select industry type"
        />

        <Input
          label="Year of Establishment"
          type="number"
          name="yearEstablished"
          placeholder="YYYY"
          value={formData?.yearEstablished}
          onChange={handleInputChange}
          error={errors?.yearEstablished}
          min="1900"
          max={new Date()?.getFullYear()}
        />

        <Input
          label="CIN / Registration Number"
          type="text"
          name="registrationNumber"
          placeholder="Enter CIN or registration number"
          value={formData?.registrationNumber}
          onChange={handleInputChange}
          description="Company Identification Number or business registration number"
        />

        <Input
          label="Annual Turnover (₹)"
          type="number"
          name="annualTurnover"
          placeholder="Enter annual turnover"
          value={formData?.annualTurnover}
          onChange={handleInputChange}
          description="Approximate annual business turnover"
        />
      </div>
    </div>
  );
};

export default CompanyInformationSection;