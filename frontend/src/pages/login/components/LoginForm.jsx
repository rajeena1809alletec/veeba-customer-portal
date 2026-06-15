import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import { loginCustomer, loginSalesperson, getCustomersFromSalespersonCode, getAllASOSalespersons, getCustomersForMultipleSalespersons } from 'services/BusinessCentralAPI';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    role: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Mock credentials for authentication
  // const mockCredentials = {
  //   username: 'demo@veeba.com',
  //   password: 'Veeba@2026'
  // };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email?.trim()) {
      // label changes based on role
      newErrors.email = formData.role === 'Salesperson' ? 'Salesperson code is required' : 'Email is required';
    } else if (
      formData.role !== 'Salesperson' &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email) &&
      formData?.email?.length < 3
    ) {
      // only validate email format for Customer role
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password.trim()) {
      newErrors.password = formData.role === 'Salesperson' ? 'Credentials are required' : 'Password is required';
    }

    if (!formData?.role) {
      newErrors.role = 'Please select your role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

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

  const handleCheckboxChange = (e) => {
    setFormData(prev => ({
      ...prev,
      rememberMe: e?.target?.checked
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {

      if (formData.role === 'Customer') {
        // ── Customer Login 
        const result = await loginCustomer(formData.email, formData.password);


        if (result.success) {
          if (!result.data.approved) {
            setErrors({
              submit: `Approval is still pending for email: ${formData.email}`
            });
            setIsLoading(false);
            return;
          }

          localStorage.setItem('customerId', result.data.customerId);
          localStorage.setItem('username', result.data.username);
          localStorage.setItem('email', result.data.emailId);
          localStorage.setItem('role', 'Customer');
          localStorage.setItem('isLoggedIn', 'true');

          console.log('Customer login successful:', result.data);
          navigate('/dashboard');

        } else {
          setErrors({
            submit: result.error || 'Invalid credentials. Please try again.'
          });
        }

      } else if (formData.role === 'Salesperson') {
        // ── Salesperson Login ────────────────────────────────────
        const result = await loginSalesperson(formData.email, formData.password);


        if (result.success) {
          localStorage.setItem('salespersonCode', result.data.code);
          localStorage.setItem('salespersonName', result.data.name);
          // localStorage.setItem('credentials', result.data.credentials);
          localStorage.setItem('level', result.data.level);
          localStorage.setItem('role', 'Salesperson');
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('salespersonEmail', result.data.eMail || '');
          localStorage.setItem('salespersonPhone', result.data.phoneNo || '');
          console.log('Salesperson login successful:', result.data);

          const level = result.data.level;
          const loggedInCode = result.data.code;

          const levelFieldMap = {
            ASO: null,
            ASM: 'asmCode',
            RSM: 'rsmCode',
            NSM: 'nsmCode',
            ZSM: 'zsmCode',
            VP: 'vpCode',
          };
          const higherLevelField = levelFieldMap[level];

          if (!higherLevelField) {
            // Logged-in person IS an ASO — directly fetch their own customers (old flow)
            localStorage.setItem('ASOSalespersons', loggedInCode);

            const customersResult = await getCustomersFromSalespersonCode(loggedInCode);
            if (customersResult.success && customersResult.data.length > 0) {
              const customerNos = customersResult.data
                .map(c => c.no).filter(Boolean).join(' | ');
              localStorage.setItem('customersForSalesperson', customerNos);
              console.log('Customers stored for ASO:', customerNos);
            } else {
              localStorage.setItem('customersForSalesperson', '');
              console.warn('No customers found for ASO:', customersResult.error);
            }

          } else {
            // Logged-in person is ASM/RSM/NSM/ZSM/VP
            // Step 1: Fetch all ASO salespersons where [levelField] = loggedInCode (filtered in BC)
            const asoResult = await getAllASOSalespersons(higherLevelField, loggedInCode);

            if (asoResult.success && asoResult.data.length > 0) {
              const asoCodes = asoResult.data.map(sp => sp.code).filter(Boolean);
              const asoCodesStr = asoCodes.join(' | ');
              localStorage.setItem('ASOSalespersons', asoCodesStr);
              console.log('ASO salespersons stored:', asoCodesStr);

              // Step 2: Fetch customers for all those ASO salesperson codes in one call
              const customersResult = await getCustomersForMultipleSalespersons(asoCodesStr);
              if (customersResult.success && customersResult.data.length > 0) {
                const customerNos = customersResult.data
                  .map(c => c.no).filter(Boolean).join(' | ');
                localStorage.setItem('customersForSalesperson', customerNos);
                console.log('Customers stored for salesperson hierarchy:', customerNos);
              } else {
                localStorage.setItem('customersForSalesperson', '');
                console.warn('No customers found for ASO list:', customersResult.error);
              }

            } else {
              localStorage.setItem('ASOSalespersons', '');
              localStorage.setItem('customersForSalesperson', '');
              console.warn('No ASO salespersons found under this manager:', asoResult.error);
            }
          }

          // const customersResult = await getCustomersFromSalespersonCode(result.data.code);

          // if (customersResult.success && customersResult.data.length > 0) {
          //   const customerNos = customersResult.data
          //     .map(customer => customer.no)           // extract CustomerNo from each record
          //     .filter(no => no)                       // remove any empty/null values
          //     .join(' | ');                           // join as 'CUST001 | CUST002'

          //   localStorage.setItem('customersForSalesperson', customerNos);
          //   console.log('Customers stored for salesperson:', customerNos);
          // } else {
          //   localStorage.setItem('customersForSalesperson', '');
          //   console.warn('No customers found for salesperson or fetch failed:', customersResult.error);
          // }
          navigate('/sp-dashboard');
        } else {
          setErrors({
            submit: result.error || 'Invalid code or credentials. Please try again.'
          });
        }
      }

    } catch (error) {
      console.error('Login error:', error);
      setErrors({
        general: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }

    // Simulate API call
    // setTimeout(() => {
    //   if (
    //     formData?.username === mockCredentials?.username &&
    //     formData?.password === mockCredentials?.password
    //   ) {
    //     navigate('/dashboard');
    //   } else {
    //     setErrors({
    //       submit: `Invalid credentials. Please use:\nEmail: ${mockCredentials?.username}\nPassword: ${mockCredentials?.password}`
    //     });
    //   }
    //   setIsLoading(false);
    // }, 1500);
  };

  const handleForgotPassword = () => {
    alert('Password reset functionality will be available soon. Please contact support at support@veeba.in');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label={formData.role === 'Salesperson' ? 'Salesperson Code' : 'Email'}
          type={formData.role === 'Salesperson' ? 'text' : 'email'}
          name="email"
          placeholder={formData.role === 'Salesperson' ? 'Enter your salesperson code' : 'Enter your email'}
          value={formData?.email}
          onChange={handleInputChange}
          error={errors?.email}
          required
          disabled={isLoading}
          className="w-full"
        />

        <div className="relative">
          <Input
            label={formData.role === 'Salesperson' ? 'Credentials' : 'Password'}
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder={formData.role === 'Salesperson' ? 'Enter your credentials' : 'Enter your password'}
            value={formData?.password}
            onChange={handleInputChange}
            error={errors?.password}
            required
            disabled={isLoading}
            className="w-full"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-muted-foreground hover:text-foreground transition-smooth"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          {/* <Checkbox
            label="Remember me"
            checked={formData?.rememberMe}
            onChange={handleCheckboxChange}
            disabled={isLoading}
          /> */}

          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm font-medium text-primary hover:text-primary/80 transition-smooth"
          >
            Forgot Password?
          </button>
        </div>
        {/* Role Selector */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Select your role <span className="text-error">*</span>
          </label>
          <div className="relative">
            <select
              name="role"
              value={formData?.role}
              onChange={handleInputChange}
              disabled={isLoading}
              className={`w-full appearance-none px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-smooth ${errors?.role ? 'border-error focus:ring-error/30' : 'border-border'} ${!formData?.role ? 'text-muted-foreground' : 'text-foreground'} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <option value="" disabled>Select your role</option>
              <option value="Customer">Customer</option>
              <option value="Salesperson">Salesperson</option>
            </select>
            {/* Dropdown arrow icon */}
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Icon name="ChevronDown" size={18} />
            </div>
          </div>
          {errors?.role && (
            <p className="text-xs text-error mt-1">{errors?.role}</p>
          )}
        </div>

        {errors?.submit && (
          <div className="bg-error/10 border border-error/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Icon name="AlertCircle" size={20} color="var(--color-error)" className="flex-shrink-0 mt-0.5" />
              <p className="text-sm text-error whitespace-pre-line">{errors?.submit}</p>
            </div>
          </div>
        )}

        <Button
          type="submit"
          variant="default"
          fullWidth
          loading={isLoading}
          iconName="LogIn"
          iconPosition="right"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;