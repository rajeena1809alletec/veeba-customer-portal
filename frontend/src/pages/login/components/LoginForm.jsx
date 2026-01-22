import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import { loginCustomer } from 'services/BusinessCentralAPI';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
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
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email) && formData?.email?.length < 3) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    // if (!formData?.password) {
    //   newErrors.password = 'Password is required';
    // } else if (formData?.password?.length < 6) {
    //   newErrors.password = 'Password must be at least 6 characters';
    // }

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
      // Call login API
      const result = await loginCustomer(formData.email, formData.password);

      if (result.success) {
        // Store user data in localStorage
        localStorage.setItem('customerId', result.data.customerId);
        localStorage.setItem('username', result.data.username);
        localStorage.setItem('email', result.data.emailId);
        localStorage.setItem('isLoggedIn', 'true');

        console.log('Login successful, user data stored:', result.data);

        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        // Show error message
        setErrors({
          submit: result.error || 'Invalid credentials. Please try again.'
        });
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
          label="Email"
          type="email"
          name="email"
          placeholder="Enter your username or email"
          value={formData?.email}
          onChange={handleInputChange}
          error={errors?.email}
          required
          disabled={isLoading}
          className="w-full"
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Enter your password"
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
          <Checkbox
            label="Remember me"
            checked={formData?.rememberMe}
            onChange={handleCheckboxChange}
            disabled={isLoading}
          />

          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm font-medium text-primary hover:text-primary/80 transition-smooth"
          >
            Forgot Password?
          </button>
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