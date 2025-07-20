import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Login.module.css';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Card from '../../../components/ui/Card';
import { useAuth } from '../../../contexts/AuthContext';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginPageProps {
  onLogin?: (data: LoginFormData) => void;
  className?: string;
}

const Login: React.FC<LoginPageProps> = ({
  onLogin,
  className = '',
  ...props
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInUser } = useAuth();
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof LoginFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      await signInUser({
        username: formData.email,
        password: formData.password,
      });
      
      // Redirect to the page they were trying to access or dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle specific Amplify auth errors
      if (error.name === 'UserNotConfirmedException') {
        setAuthError('Please confirm your email address before signing in.');
      } else if (error.name === 'NotAuthorizedException') {
        setAuthError('Invalid email or password.');
      } else if (error.name === 'UserNotFoundException') {
        setAuthError('No account found with this email address.');
      } else {
        setAuthError('An error occurred during sign in. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const handleSignUp = () => {
    navigate('/register');
  };

  const loginClasses = [
    styles.loginPage,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={loginClasses} {...props}>
      <div className={styles.loginContainer}>
        {/* Background Pattern */}
        <div className={styles.backgroundPattern} />
        
        {/* Login Form */}
        <Card className={styles.loginCard}>
          <div className={styles.loginHeader}>
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
            <h1 className={styles.title}>Welcome back</h1>
            <p className={styles.subtitle}>
              Sign in to your Leadsbot account to continue managing your leads
            </p>
          </div>

          {authError && (
            <div className={styles.errorMessage}>
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.loginForm}>
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
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange('password')}
                error={errors.password}
                required
              />
            </div>

            <div className={styles.formOptions}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
                  className={styles.checkbox}
                />
                <span className={styles.checkboxText}>Remember me</span>
              </label>

              <button
                type="button"
                onClick={handleForgotPassword}
                className={styles.forgotPassword}
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="large"
              loading={isLoading}
              className={styles.loginButton}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>

            <div className={styles.divider}>
              <span className={styles.dividerText}>or</span>
            </div>

            <Button
              type="button"
              variant="outline"
              size="large"
              onClick={handleSignUp}
              className={styles.signUpButton}
            >
              Create new account
            </Button>
          </form>

          <div className={styles.loginFooter}>
            <p className={styles.footerText}>
              By signing in, you agree to our{' '}
              <a href="#" className={styles.footerLink}>Terms of Service</a>
              {' '}and{' '}
              <a href="#" className={styles.footerLink}>Privacy Policy</a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;