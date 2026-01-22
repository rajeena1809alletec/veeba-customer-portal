import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const AddressInformationSection = ({ formData, errors, handleInputChange, sameAsBilling, setSameAsBilling }) => {
  const stateOptions = [
    { value: 'AN', label: 'Andaman and Nicobar Islands' },
    { value: 'AP', label: 'Andhra Pradesh' },
    { value: 'AR', label: 'Arunachal Pradesh' },
    { value: 'AS', label: 'Assam' },
    { value: 'BR', label: 'Bihar' },
    { value: 'CH', label: 'Chandigarh' },
    { value: 'CT', label: 'Chhattisgarh' },
    { value: 'DN', label: 'Dadra and Nagar Haveli' },
    { value: 'DD', label: 'Daman and Diu' },
    { value: 'DL', label: 'Delhi' },
    { value: 'GA', label: 'Goa' },
    { value: 'GJ', label: 'Gujarat' },
    { value: 'HR', label: 'Haryana' },
    { value: 'HP', label: 'Himachal Pradesh' },
    { value: 'JK', label: 'Jammu and Kashmir' },
    { value: 'JH', label: 'Jharkhand' },
    { value: 'KA', label: 'Karnataka' },
    { value: 'KL', label: 'Kerala' },
    { value: 'LA', label: 'Ladakh' },
    { value: 'LD', label: 'Lakshadweep' },
    { value: 'MP', label: 'Madhya Pradesh' },
    { value: 'MH', label: 'Maharashtra' },
    { value: 'MN', label: 'Manipur' },
    { value: 'ML', label: 'Meghalaya' },
    { value: 'MZ', label: 'Mizoram' },
    { value: 'NL', label: 'Nagaland' },
    { value: 'OR', label: 'Odisha' },
    { value: 'PY', label: 'Puducherry' },
    { value: 'PB', label: 'Punjab' },
    { value: 'RJ', label: 'Rajasthan' },
    { value: 'SK', label: 'Sikkim' },
    { value: 'TN', label: 'Tamil Nadu' },
    { value: 'TG', label: 'Telangana' },
    { value: 'TR', label: 'Tripura' },
    { value: 'UP', label: 'Uttar Pradesh' },
    { value: 'UT', label: 'Uttarakhand' },
    { value: 'WB', label: 'West Bengal' },
  ];

  return (
    <div className="bg-card rounded-xl p-6 md:p-8 border border-border shadow-warm-sm">
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <span className="font-heading font-bold text-lg md:text-xl text-primary">3</span>
        </div>
        <div>
          <h2 className="font-heading font-semibold text-xl md:text-2xl text-foreground">
            Address Information
          </h2>
          <p className="font-caption text-sm text-muted-foreground mt-1">
            Billing and shipping address details
          </p>
        </div>
      </div>
      {/* Billing Address */}
      <div className="mb-8">
        <h3 className="font-heading font-semibold text-lg text-foreground mb-4 md:mb-6">
          Billing Address
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <Input
            label="Address Line 1"
            type="text"
            name="billingAddress1"
            placeholder="Building/House number, Street name"
            value={formData?.billingAddress1}
            onChange={handleInputChange}
            error={errors?.billingAddress1}
            required
            className="md:col-span-2"
          />

          <Input
            label="Address Line 2"
            type="text"
            name="billingAddress2"
            placeholder="Area, Locality"
            value={formData?.billingAddress2}
            onChange={handleInputChange}
            className="md:col-span-2"
          />

          <Input
            label="City"
            type="text"
            name="billingCity"
            placeholder="Enter city"
            value={formData?.billingCity}
            onChange={handleInputChange}
            error={errors?.billingCity}
            required
          />

          <Select
            label="State"
            name="billingState"
            options={stateOptions}
            value={formData?.billingState}
            onChange={(value) => handleInputChange({ target: { name: 'billingState', value } })}
            error={errors?.billingState}
            required
            searchable
            placeholder="Select state"
          />

          <Input
            label="PIN Code"
            type="text"
            name="billingPincode"
            placeholder="XXXXXX"
            value={formData?.billingPincode}
            onChange={handleInputChange}
            error={errors?.billingPincode}
            required
            pattern="[0-9]{6}"
            maxLength={6}
          />
        </div>
      </div>
      {/* Shipping Address */}
      <div>
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h3 className="font-heading font-semibold text-lg text-foreground">
            Shipping Address
          </h3>
          <Checkbox
            label="Same as billing address"
            checked={sameAsBilling}
            onChange={(e) => setSameAsBilling(e?.target?.checked)}
          />
        </div>

        {!sameAsBilling && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Input
              label="Address Line 1"
              type="text"
              name="shippingAddress1"
              placeholder="Building/House number, Street name"
              value={formData?.shippingAddress1}
              onChange={handleInputChange}
              error={errors?.shippingAddress1}
              required
              className="md:col-span-2"
            />

            <Input
              label="Address Line 2"
              type="text"
              name="shippingAddress2"
              placeholder="Area, Locality"
              value={formData?.shippingAddress2}
              onChange={handleInputChange}
              className="md:col-span-2"
            />

            <Input
              label="City"
              type="text"
              name="shippingCity"
              placeholder="Enter city"
              value={formData?.shippingCity}
              onChange={handleInputChange}
              error={errors?.shippingCity}
              required
            />

            <Select
              label="State"
              name="shippingState"
              options={stateOptions}
              value={formData?.shippingState}
              onChange={(value) => handleInputChange({ target: { name: 'shippingState', value } })}
              error={errors?.shippingState}
              required
              searchable
              placeholder="Select state"
            />

            <Input
              label="PIN Code"
              type="text"
              name="shippingPincode"
              placeholder="XXXXXX"
              value={formData?.shippingPincode}
              onChange={handleInputChange}
              error={errors?.shippingPincode}
              required
              pattern="[0-9]{6}"
              maxLength={6}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressInformationSection;