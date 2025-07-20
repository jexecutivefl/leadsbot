import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Card from '../../../components/ui/Card';
import { useAuth } from '../../../contexts/AuthContext';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface RegisterPageProps {
  onRegister?: (data: RegisterFormData) => void;
  className?: string;
}

const Register: React.FC<RegisterPageProps> = ({
  onRegister,
  className = '',
  ...props
}) => {
  const navigate = useNavigate();
  const { signUpUser, confirmSignUpUser } = useAuth();
  
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterFormData> = {};

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, number, and special character';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions' as any;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof RegisterFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
    
    // Clear auth error when user starts typing
    if (authError) {
      setAuthError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setAuthError('');

    try {
      const result = await signUpUser({
        username: formData.email,
        password: formData.password,
        options: {
          userAttributes: {
            email: formData.email,
            name: `${formData.firstName} ${formData.lastName}`,
          },
        },
      });
      
      if (result && typeof result === 'object' && 'nextStep' in result && result.nextStep?.signUpStep === 'CONFIRM_SIGN_UP') {
        setShowConfirmation(true);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle specific Amplify auth errors
      if (error.name === 'UsernameExistsException') {
        setAuthError('An account with this email already exists.');
      } else if (error.name === 'InvalidPasswordException') {
        setAuthError('Password does not meet requirements.');
      } else {
        setAuthError('An error occurred during registration. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSignUp = async () => {
    if (!confirmationCode.trim()) {
      setAuthError('Please enter the confirmation code.');
      return;
    }

    setIsLoading(true);
    setAuthError('');

    try {
      await confirmSignUpUser(formData.email, confirmationCode);
      // Redirect to login after successful confirmation
      navigate('/login', { 
        state: { 
          message: 'Account confirmed successfully! Please sign in.' 
        } 
      });
    } catch (error: any) {
      console.error('Confirmation error:', error);
      
      if (error.name === 'CodeMismatchException') {
        setAuthError('Invalid confirmation code. Please check your email and try again.');
      } else {
        setAuthError('An error occurred during confirmation. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  const registerClasses = [
    styles.registerPage,
    className
  ].filter(Boolean).join(' ');

  if (showConfirmation) {
    return (
      <div className={registerClasses} {...props}>
        <div className={styles.registerContainer}>
          <div className={styles.backgroundPattern} />
          
          <Card className={styles.registerCard}>
            <div className={styles.registerHeader}>
              <div className={styles.logo}>
                <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
                  <rect width="32" height="32" rx="8" fill="var(--color-primary-600)" />
                  <path d="M8 12h16M8 8h16M8 16h12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h1 className={styles.title}>Verify your email</h1>
              <p className={styles.subtitle}>
                We've sent a confirmation code to {formData.email}
              </p>
            </div>

            {authError && (
              <div className={styles.errorMessage}>
                {authError}
              </div>
            )}

            <div className={styles.formGroup}>
              <Input
                type="text"
                label="Confirmation Code"
                placeholder="Enter the 6-digit code"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                maxLength={6}
                required
              />
            </div>

            <Button
              type="button"
              variant="primary"
              size="large"
              loading={isLoading}
              onClick={handleConfirmSignUp}
              className={styles.registerButton}
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </Button>

            <div className={styles.divider}>
              <span className={styles.dividerText}>or</span>
            </div>

            <Button
              type="button"
              variant="outline"
              size="large"
              onClick={handleSignIn}
              className={styles.signInButton}
            >
              Back to Sign In
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={registerClasses} {...props}>
      <div className={styles.registerContainer}>
        {/* Background Pattern */}
        <div className={styles.backgroundPattern} />
        
        {/* Register Form */}
        <Card className={styles.registerCard}>
          <div className={styles.registerHeader}>
            <div className={styles.logo}>
              <svg
                width="48"
                height="48"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="32"
                  height="32"
                  rx="8"
                  fill="var(--color-primary-600)"
                />
                <path
                  d="M8 12h16M8 8h16M8 16h12"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h1 className={styles.title}>Create your account</h1>
            <p className={styles.subtitle}>
              Join Leadsbot to start managing your leads with AI-powered automation
            </p>
          </div>

          {authError && (
            <div className={styles.errorMessage}>
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.registerForm}>
            <div className={styles.nameRow}>
              <div className={styles.formGroup}>
                <Input
                  type="text"
                  label="First name"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={handleInputChange('firstName')}
                  error={errors.firstName}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <Input
                  type="text"
                  label="Last name"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={handleInputChange('lastName')}
                  error={errors.lastName}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <Input
                type="email"
                label="Email address"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange('email')}
                error={errors.email}
                required
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M22 6l-10 7L2 6"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                }
                iconPosition="leading"
              />
            </div>

            <div className={styles.formGroup}>
              <Input
                type="password"
                label="Password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleInputChange('password')}
                error={errors.password}
                required
                helperText="Must be at least 8 characters with uppercase, lowercase, number, and special character"
              />
            </div>

            <div className={styles.formGroup}>
              <Input
                type="password"
                label="Confirm password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                error={errors.confirmPassword}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                  className={styles.checkbox}
                />
                <span className={styles.checkboxText}>
                  I agree to the{' '}
                  <a href="#" className={styles.link}>Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className={styles.link}>Privacy Policy</a>
                </span>
              </label>
              {errors.agreeToTerms && (
                <span className={styles.errorText}>{errors.agreeToTerms}</span>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="large"
              loading={isLoading}
              className={styles.registerButton}
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>

            <div className={styles.divider}>
              <span className={styles.dividerText}>or</span>
            </div>

            <Button
              type="button"
              variant="outline"
              size="large"
              onClick={handleSignIn}
              className={styles.signInButton}
            >
              Sign in to existing account
            </Button>
          </form>

          <div className={styles.registerFooter}>
            <p className={styles.footerText}>
              Already have an account?{' '}
              <a href="/login" className={styles.footerLink}>Sign in here</a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register; 