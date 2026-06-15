import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PaymentModal = ({ invoice, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [amount, setAmount] = useState(invoice?.amount?.toString());
  const [processing, setProcessing] = useState(false);

  const paymentMethods = [
    { value: 'upi', label: 'UPI Payment' },
    { value: 'netbanking', label: 'Net Banking' },
    { value: 'card', label: 'Credit/Debit Card' },
    { value: 'neft', label: 'NEFT/RTGS' }
  ];

  const handlePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      alert('Payment processed successfully!');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card rounded-xl shadow-warm-xl w-full max-w-lg animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="CreditCard" size={20} color="var(--color-success)" />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-lg md:text-xl text-foreground">
                Make Payment
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
        <div className="p-4 md:p-6 space-y-6">
          {/* Invoice Summary */}
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-caption text-sm text-muted-foreground">Invoice Amount:</span>
                <span className="font-data font-semibold text-base text-foreground">
                  ₹{invoice?.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              {invoice?.status === 'partially_paid' && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="font-caption text-sm text-muted-foreground">Paid Amount:</span>
                    <span className="font-data text-sm text-success">
                      ₹{(invoice?.amount * 0.4)?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="border-t border-border pt-2 flex items-center justify-between">
                    <span className="font-caption font-semibold text-sm text-foreground">Balance Due:</span>
                    <span className="font-data font-bold text-lg text-error">
                      ₹{(invoice?.amount * 0.6)?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Payment Form */}
          <div className="space-y-4">
            <Select
              label="Payment Method"
              placeholder="Select payment method"
              options={paymentMethods}
              value={paymentMethod}
              onChange={setPaymentMethod}
              required
            />

            <Input
              type="number"
              label="Payment Amount (₹)"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e?.target?.value)}
              required
            />

            {paymentMethod === 'upi' && (
              <Input
                type="text"
                label="UPI ID"
                placeholder="yourname@upi"
                required
              />
            )}

            {paymentMethod === 'card' && (
              <>
                <Input
                  type="text"
                  label="Card Number"
                  placeholder="1234 5678 9012 3456"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="text"
                    label="Expiry Date"
                    placeholder="MM/YY"
                    required
                  />
                  <Input
                    type="text"
                    label="CVV"
                    placeholder="123"
                    required
                  />
                </div>
              </>
            )}

            {paymentMethod === 'netbanking' && (
              <Select
                label="Select Bank"
                placeholder="Choose your bank"
                options={[
                  { value: 'hdfc', label: 'HDFC Bank' },
                  { value: 'icici', label: 'ICICI Bank' },
                  { value: 'sbi', label: 'State Bank of India' },
                  { value: 'axis', label: 'Axis Bank' }
                ]}
                required
              />
            )}
          </div>

          {/* Security Notice */}
          <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
            <Icon name="Shield" size={20} color="var(--color-primary)" />
            <div>
              <p className="font-caption text-xs text-foreground">
                <strong>Secure Payment:</strong> Your payment information is encrypted and secure. We never store your card details.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 md:p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={processing}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            iconName="CreditCard"
            iconPosition="left"
            onClick={handlePayment}
            loading={processing}
            disabled={!paymentMethod || !amount}
          >
            {processing ? 'Processing...' : 'Pay Now'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;