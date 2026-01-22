import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const GSTFinancialSection = ({ formData, errors, handleInputChange, handleFileChange }) => {
  const bankAccountTypeOptions = [
    { value: 'current', label: 'Current Account' },
    { value: 'savings', label: 'Savings Account' },
  ];

  return (
    <div className="bg-card rounded-xl p-6 md:p-8 border border-border shadow-warm-sm">
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <span className="font-heading font-bold text-lg md:text-xl text-primary">4</span>
        </div>
        <div>
          <h2 className="font-heading font-semibold text-xl md:text-2xl text-foreground">
            GST &amp; Financial Details
          </h2>
          <p className="font-caption text-sm text-muted-foreground mt-1">
            Tax registration and banking information
          </p>
        </div>
      </div>
      {/* GST Details */}
      <div className="mb-8">
        <h3 className="font-heading font-semibold text-lg text-foreground mb-4 md:mb-6">
          GST Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <Input
            label="GST Number"
            type="text"
            name="gstNumber"
            placeholder="22AAAAA0000A1Z5"
            value={formData?.gstNumber}
            onChange={handleInputChange}
            error={errors?.gstNumber}
            required
            pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}"
            maxLength={15}
            description="15-character GST identification number"
          />

          <Input
            label="PAN Number"
            type="text"
            name="panNumber"
            placeholder="AAAAA0000A"
            value={formData?.panNumber}
            onChange={handleInputChange}
            error={errors?.panNumber}
            required
            pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
            maxLength={10}
            description="10-character PAN card number"
          />

          <div className="md:col-span-2">
            <label className="block font-caption font-medium text-sm text-foreground mb-2">
              GST Certificate <span className="text-error">*</span>
            </label>
            <div className="relative">
              <input
                type="file"
                name="gstCertificate"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                id="gstCertificate"
              />
              <label
                htmlFor="gstCertificate"
                className="flex items-center gap-3 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-smooth bg-muted/30"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="Upload" size={20} color="var(--color-primary)" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-caption font-medium text-sm text-foreground">
                    {formData?.gstCertificate ? formData?.gstCertificate?.name : 'Upload GST Certificate'}
                  </p>
                  <p className="font-caption text-xs text-muted-foreground mt-1">
                    PDF, JPG, PNG (Max 5MB)
                  </p>
                </div>
              </label>
              {errors?.gstCertificate && (
                <p className="font-caption text-xs text-error mt-1">{errors?.gstCertificate}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Banking Details */}
      <div>
        <h3 className="font-heading font-semibold text-lg text-foreground mb-4 md:mb-6">
          Banking Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <Input
            label="Bank Name"
            type="text"
            name="bankName"
            placeholder="Enter bank name"
            value={formData?.bankName}
            onChange={handleInputChange}
            error={errors?.bankName}
            required
          />

          <Input
            label="Branch Name"
            type="text"
            name="branchName"
            placeholder="Enter branch name"
            value={formData?.branchName}
            onChange={handleInputChange}
            error={errors?.branchName}
            required
          />

          <Input
            label="Account Number"
            type="text"
            name="accountNumber"
            placeholder="Enter account number"
            value={formData?.accountNumber}
            onChange={handleInputChange}
            error={errors?.accountNumber}
            required
          />

          <Input
            label="Confirm Account Number"
            type="text"
            name="confirmAccountNumber"
            placeholder="Re-enter account number"
            value={formData?.confirmAccountNumber}
            onChange={handleInputChange}
            error={errors?.confirmAccountNumber}
            required
          />

          <Input
            label="IFSC Code"
            type="text"
            name="ifscCode"
            placeholder="AAAA0000000"
            value={formData?.ifscCode}
            onChange={handleInputChange}
            error={errors?.ifscCode}
            required
            pattern="[A-Z]{4}0[A-Z0-9]{6}"
            maxLength={11}
          />

          <Select
            label="Account Type"
            name="accountType"
            options={bankAccountTypeOptions}
            value={formData?.accountType}
            onChange={(value) => handleInputChange({ target: { name: 'accountType', value } })}
            error={errors?.accountType}
            required
            placeholder="Select account type"
          />

          <div className="md:col-span-2">
            <label className="block font-caption font-medium text-sm text-foreground mb-2">
              Cancelled Cheque / Bank Statement <span className="text-error">*</span>
            </label>
            <div className="relative">
              <input
                type="file"
                name="bankDocument"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                id="bankDocument"
              />
              <label
                htmlFor="bankDocument"
                className="flex items-center gap-3 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-smooth bg-muted/30"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="Upload" size={20} color="var(--color-primary)" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-caption font-medium text-sm text-foreground">
                    {formData?.bankDocument ? formData?.bankDocument?.name : 'Upload Bank Document'}
                  </p>
                  <p className="font-caption text-xs text-muted-foreground mt-1">
                    PDF, JPG, PNG (Max 5MB)
                  </p>
                </div>
              </label>
              {errors?.bankDocument && (
                <p className="font-caption text-xs text-error mt-1">{errors?.bankDocument}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GSTFinancialSection;