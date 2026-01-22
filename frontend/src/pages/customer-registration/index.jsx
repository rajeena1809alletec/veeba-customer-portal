import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import ProgressIndicator from './components/ProgressIndicator';
import CompanyInformationSection from './components/CompanyInformationSection';
import ContactDetailsSection from './components/ContactDetailsSection';
import AddressInformationSection from './components/AddressInformationSection';
import GSTFinancialSection from './components/GSTFinancialSection';
import TermsAndSubmit from './components/TermsAndSubmit';
import { createCustomer, createCustomerCredentials } from 'services/BusinessCentralAPI';

const CustomerRegistration = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [sameAsBilling, setSameAsBilling] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = ['Company Info', 'Contact Details', 'Address', 'GST & Finance'];

  const [formData, setFormData] = useState({
    // Company Information
    businessName: '',
    tradeName: '',
    businessType: '',
    industryType: '',
    yearEstablished: '',
    registrationNumber: '',
    annualTurnover: '',

    // Contact Details
    contactName: '',
    designation: '',
    mobile: '',
    alternateMobile: '',
    email: '',
    landline: '',
    website: '',
    password: '',
    confirmPassword: '',

    // Billing Address
    billingAddress1: '',
    billingAddress2: '',
    billingCity: '',
    billingState: '',
    billingPincode: '',

    // Shipping Address
    shippingAddress1: '',
    shippingAddress2: '',
    shippingCity: '',
    shippingState: '',
    shippingPincode: '',

    // GST & Financial
    gstNumber: '',
    panNumber: '',
    gstCertificate: null,
    bankName: '',
    branchName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    accountType: '',
    bankDocument: null,
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e?.target;
    if (files && files?.[0]) {
      const file = files?.[0];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (file?.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          [name]: 'File size must be less than 5MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        [name]: file
      }));

      if (errors?.[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData?.businessName?.trim()) newErrors.businessName = 'Business name is required';
      if (!formData?.businessType) newErrors.businessType = 'Business type is required';
      if (!formData?.industryType) newErrors.industryType = 'Industry type is required';
    }

    if (step === 2) {
      if (!formData?.contactName?.trim()) newErrors.contactName = 'Contact name is required';
      if (!formData?.designation?.trim()) newErrors.designation = 'Designation is required';
      if (!formData?.mobile?.trim()) {
        newErrors.mobile = 'Mobile number is required';
      } else if (!/^[0-9]{10}$/?.test(formData?.mobile)) {
        newErrors.mobile = 'Invalid mobile number format';
      }
      if (!formData?.email?.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
        newErrors.email = 'Invalid email format';
      }

      if (!formData?.password?.trim()) {
        newErrors.password = 'Password is required';
      } else if (formData?.password?.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }

      if (!formData?.confirmPassword?.trim()) {
        newErrors.confirmPassword = 'Please confirm password';
      } else if (formData?.password !== formData?.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    if (step === 3) {
      if (!formData?.billingAddress1?.trim()) newErrors.billingAddress1 = 'Address is required';
      if (!formData?.billingCity?.trim()) newErrors.billingCity = 'City is required';
      if (!formData?.billingState) newErrors.billingState = 'State is required';
      if (!formData?.billingPincode?.trim()) {
        newErrors.billingPincode = 'PIN code is required';
      } else if (!/^[0-9]{6}$/?.test(formData?.billingPincode)) {
        newErrors.billingPincode = 'Invalid PIN code format';
      }

      if (!sameAsBilling) {
        if (!formData?.shippingAddress1?.trim()) newErrors.shippingAddress1 = 'Address is required';
        if (!formData?.shippingCity?.trim()) newErrors.shippingCity = 'City is required';
        if (!formData?.shippingState) newErrors.shippingState = 'State is required';
        if (!formData?.shippingPincode?.trim()) {
          newErrors.shippingPincode = 'PIN code is required';
        } else if (!/^[0-9]{6}$/?.test(formData?.shippingPincode)) {
          newErrors.shippingPincode = 'Invalid PIN code format';
        }
      }
    }

    if (step === 4) {
      if (!formData?.gstNumber?.trim()) {
        newErrors.gstNumber = 'GST number is required';
      } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/?.test(formData?.gstNumber)) {
        newErrors.gstNumber = 'Invalid GST number format';
      }

      if (!formData?.panNumber?.trim()) {
        newErrors.panNumber = 'PAN number is required';
      } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/?.test(formData?.panNumber)) {
        newErrors.panNumber = 'Invalid PAN number format';
      }

      if (!formData?.gstCertificate) newErrors.gstCertificate = 'GST certificate is required';
      if (!formData?.bankName?.trim()) newErrors.bankName = 'Bank name is required';
      if (!formData?.branchName?.trim()) newErrors.branchName = 'Branch name is required';
      if (!formData?.accountNumber?.trim()) newErrors.accountNumber = 'Account number is required';
      if (!formData?.confirmAccountNumber?.trim()) {
        newErrors.confirmAccountNumber = 'Please confirm account number';
      } else if (formData?.accountNumber !== formData?.confirmAccountNumber) {
        newErrors.confirmAccountNumber = 'Account numbers do not match';
      }
      if (!formData?.ifscCode?.trim()) {
        newErrors.ifscCode = 'IFSC code is required';
      } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/?.test(formData?.ifscCode)) {
        newErrors.ifscCode = 'Invalid IFSC code format';
      }
      if (!formData?.accountType) newErrors.accountType = 'Account type is required';
      if (!formData?.bankDocument) newErrors.bankDocument = 'Bank document is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      return;
    }

    if (!termsAccepted) {
      setErrors(prev => ({
        ...prev,
        termsAccepted: 'You must accept the terms and conditions'
      }));
      return;
    }

    setIsSubmitting(true);

    try {
      const customerPayload = {
        // Basic fields from your API
        name: formData.businessName,
        mobilePhoneNo: formData.mobile,
        email: formData.email,
        contactName: formData.contactName,

        // Billing Address fields
        billingAddress1: formData.billingAddress1,
        billingAddress2: formData.billingAddress2,
        billingCity: formData.billingCity,
        billingState: formData.billingState,
        billingPincode: formData.billingPincode,

        // GST Number
        gstNumber: formData.gstNumber,
        panNo: formData.panNumber,
        businessType: formData.businessType,
        homePage: formData.website,

        // Ship-to addresses - UPDATED to match your API fields
        shipToAddresses: !sameAsBilling ? [
          {
            name: formData.businessName + ' - Shipping Address',
            address: formData.shippingAddress1,
            address2: formData.shippingAddress2,
            city: formData.shippingCity,
            state: formData.shippingState,
            pincode: formData.shippingPincode,
          }
        ] : []
      };

      // console.log('Sending customer data from index.js:', customerPayload);

      // Call the API
      const customerResult = await createCustomer(customerPayload);

      if (!customerResult.success) {
        alert(`Customer creation failed: ${customerResult.error}`);
        setIsSubmitting(false);
        return;
      }
      console.log('Customer created successfully:', customerResult.data);

      // Extract customer number from response
      const customerNo = customerResult.data.no;
      console.log('Customer No:', customerNo);


      const credentialsPayload = {
        customerId: customerNo,  // Use the 'no' field from customer response
        username: formData.contactName, // Use email username part or formData.email
        emailId: formData.email,
        password: formData.password
      };

      const credentialsResult = await createCustomerCredentials(credentialsPayload);

      if (!credentialsResult.success) {
        alert(`Credentials creation failed: ${credentialsResult.error}. However, customer account was created.`);
        setIsSubmitting(false);
        return;
      }

      console.log('Credentials created successfully:', credentialsResult.data);

      // Both APIs successful
      alert('Registration submitted successfully! You will receive an email notification within 2-3 business days regarding your account approval status.');
      navigate('/login');


    } catch (error) {
      console.error('Error during submission:', error);
      alert('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };


  // const handleSubmit = async () => {
  //   if (!validateStep(4)) {
  //     return;
  //   }

  //   if (!termsAccepted) {
  //     setErrors(prev => ({
  //       ...prev,
  //       termsAccepted: 'You must accept the terms and conditions'
  //     }));
  //     return;
  //   }

  //   setIsSubmitting(true);

  //   // Copy billing to shipping if same
  //   const finalFormData = { ...formData };
  //   if (sameAsBilling) {
  //     finalFormData.shippingAddress1 = formData?.billingAddress1;
  //     finalFormData.shippingAddress2 = formData?.billingAddress2;
  //     finalFormData.shippingCity = formData?.billingCity;
  //     finalFormData.shippingState = formData?.billingState;
  //     finalFormData.shippingPincode = formData?.billingPincode;
  //   }

  //   // Simulate API call
  //   setTimeout(() => {
  //     setIsSubmitting(false);
  //     // Show success message and redirect
  //     alert('Registration submitted successfully! You will receive an email notification within 2-3 business days regarding your account approval status.');
  //     navigate('/login');
  //   }, 2000);
  // };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All entered data will be lost.')) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
          <Breadcrumb />

          {/* Page Header */}
          <div className="mb-8 md:mb-10 lg:mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                <Icon name="UserPlus" size={28} color="var(--color-primary)" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground">
                  Customer Registration
                </h1>
                <p className="font-caption text-base md:text-lg text-muted-foreground mt-1">
                  Create your B2B account to start ordering from Veeba Foods
                </p>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <ProgressIndicator
            currentStep={currentStep}
            totalSteps={4}
            steps={steps}
          />

          {/* Form Sections */}
          <div className="space-y-6 md:space-y-8">
            {currentStep === 1 && (
              <CompanyInformationSection
                formData={formData}
                errors={errors}
                handleInputChange={handleInputChange}
              />
            )}

            {currentStep === 2 && (
              <ContactDetailsSection
                formData={formData}
                errors={errors}
                handleInputChange={handleInputChange}
              />
            )}

            {currentStep === 3 && (
              <AddressInformationSection
                formData={formData}
                errors={errors}
                handleInputChange={handleInputChange}
                sameAsBilling={sameAsBilling}
                setSameAsBilling={setSameAsBilling}
              />
            )}

            {currentStep === 4 && (
              <>
                <GSTFinancialSection
                  formData={formData}
                  errors={errors}
                  handleInputChange={handleInputChange}
                  handleFileChange={handleFileChange}
                />
                <TermsAndSubmit
                  termsAccepted={termsAccepted}
                  setTermsAccepted={setTermsAccepted}
                  errors={errors}
                  isSubmitting={isSubmitting}
                  handleSubmit={handleSubmit}
                  handleCancel={handleCancel}
                />
              </>
            )}
          </div>

          {/* Navigation Buttons (for steps 1-3) */}
          {currentStep < 4 && (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 md:mt-10">
              {currentStep > 1 && (
                <button
                  onClick={handlePrevious}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 border-border bg-card text-foreground font-caption font-medium hover:bg-muted transition-smooth sm:w-auto"
                >
                  <Icon name="ChevronLeft" size={20} />
                  <span>Previous</span>
                </button>
              )}
              <button
                onClick={handleNext}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-caption font-medium hover:bg-primary/90 transition-smooth flex-1 sm:flex-initial sm:ml-auto"
              >
                <span>Next Step</span>
                <Icon name="ChevronRight" size={20} />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomerRegistration;