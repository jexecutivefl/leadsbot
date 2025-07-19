import React from 'react';
import styles from './Button.module.css';
import { ButtonProps } from '../../../types';

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'leading',
  children,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const sizeMap: { [key: string]: string } = {
    'sm': 'Small',
    'small': 'Small',
    'medium': 'Medium',
    'large': 'Large'
  };

  const buttonClasses = [
    styles.button,
    styles[`button${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
    styles[`button${sizeMap[size] || 'Medium'}`],
    disabled && styles.buttonDisabled,
    loading && styles.buttonLoading,
    className
  ].filter(Boolean).join(' ');

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className={styles.loadingSpinner} aria-hidden="true">
          <svg
            className={styles.spinner}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="31.416"
              strokeDashoffset="31.416"
            />
          </svg>
        </span>
      )}
      
      {!loading && icon && iconPosition === 'leading' && (
        <span className={styles.iconLeading} aria-hidden="true">
          {icon}
        </span>
      )}
      
      <span className={styles.buttonText}>
        {children}
      </span>
      
      {!loading && icon && iconPosition === 'trailing' && (
        <span className={styles.iconTrailing} aria-hidden="true">
          {icon}
        </span>
      )}
    </button>
  );
};

export default Button;