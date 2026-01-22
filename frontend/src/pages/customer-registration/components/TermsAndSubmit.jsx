import React from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const TermsAndSubmit = ({ 
  termsAccepted, 
  setTermsAccepted, 
  errors, 
  isSubmitting, 
  handleSubmit,
  handleCancel 
}) => {
  return (
    <div className="bg-card rounded-xl p-6 md:p-8 border border-border shadow-warm-sm">
      <div className="space-y-6">
        {/* Terms and Conditions */}
        <div className="bg-muted/30 rounded-lg p-4 md:p-6">
          <h3 className="font-heading font-semibold text-base md:text-lg text-foreground mb-4">
            Terms &amp; Conditions
          </h3>
          <div className="space-y-3 font-caption text-sm text-muted-foreground max-h-48 overflow-y-auto scrollbar-custom">
            <p>
              By registering as a B2B customer with Veeba Foods, you agree to the following terms and conditions:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>All information provided must be accurate and up-to-date</li>
              <li>Registration is subject to verification and approval by Veeba Foods</li>
              <li>Approval process typically takes 2-3 business days</li>
              <li>You will receive email notification once your account is approved</li>
              <li>Credit terms and limits will be determined based on business evaluation</li>
              <li>All transactions are subject to GST and applicable taxes</li>
              <li>Payment terms must be adhered to as per agreed credit policy</li>
              <li>Veeba Foods reserves the right to modify terms and conditions</li>
              <li>Customer data will be used in accordance with our privacy policy</li>
              <li>Business documents provided will be kept confidential</li>
            </ul>
          </div>
        </div>

        {/* Acceptance Checkbox */}
        <Checkbox
          label="I accept the terms and conditions"
          description="You must accept the terms to proceed with registration"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e?.target?.checked)}
          error={errors?.termsAccepted}
          required
        />

        {/* Information Notice */}
        <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <Icon name="Info" size={20} color="var(--color-primary)" className="flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-caption text-sm text-foreground">
              <span className="font-medium">What happens next?</span>
            </p>
            <p className="font-caption text-sm text-muted-foreground mt-1">
              After submission, our team will verify your documents and business details. You'll receive an email notification within 2-3 business days regarding your account approval status. Once approved, you can log in and start placing orders.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
            iconName="X"
            iconPosition="left"
            className="sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleSubmit}
            disabled={!termsAccepted || isSubmitting}
            loading={isSubmitting}
            iconName="Send"
            iconPosition="right"
            fullWidth
            className="sm:flex-1"
          >
            {isSubmitting ? 'Submitting Registration...' : 'Submit Registration'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndSubmit;