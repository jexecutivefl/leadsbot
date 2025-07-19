import React, { forwardRef, useState } from 'react';
import styles from './Input.module.css';
import { InputProps } from '../../../types';

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({
    type = 'text',
    label,
    placeholder,
    value,
    onChange,
    error,
    helperText,
    disabled = false,
    required = false,
    icon,
    iconPosition = 'leading',
    className = '',
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputClasses = [
      styles.input,
      error && styles.inputError,
      disabled && styles.inputDisabled,
      icon && styles.inputWithIcon,
      icon && iconPosition === 'leading' && styles.inputWithLeadingIcon,
      icon && iconPosition === 'trailing' && styles.inputWithTrailingIcon,
      className
    ].filter(Boolean).join(' ');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (onChange) {
        onChange(e);
      }
    };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

    const renderInput = () => {
      if (type === 'textarea') {
        return (
          <textarea
            ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
            className={inputClasses}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            disabled={disabled}
            required={required}
            rows={4}
            {...props}
          />
        );
      }

      if (type === 'select') {
        const selectProps = props as any;
        return (
          <select
            ref={ref as React.ForwardedRef<HTMLSelectElement>}
            className={inputClasses}
            value={value}
            onChange={handleChange}
            disabled={disabled}
            required={required}
            {...selectProps}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {selectProps.options?.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      }

      return (
        <input
          ref={ref as React.ForwardedRef<HTMLInputElement>}
          type={inputType}
          className={inputClasses}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          {...props}
        />
      );
    };

    return (
      <div className={styles.inputWrapper}>
        {label && (
          <label className={styles.label}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </label>
        )}
        
        <div className={styles.inputContainer}>
          {icon && iconPosition === 'leading' && (
            <span className={styles.iconLeading} aria-hidden="true">
              {icon}
            </span>
          )}
          
          {renderInput()}
          
          {type === 'password' && (
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 3l18 18M10.584 10.587a2 2 0 002.828 2.829M9.363 5.365A9.466 9.466 0 0112 5c4.418 0 8.418 2.982 9.448 7a9.65 9.65 0 01-1.707 3.312m-2.709 2.709A9.465 9.465 0 0112 19c-4.418 0-8.418-2.982-9.448-7a9.65 9.65 0 013.006-5.202"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          )}
          
          {icon && iconPosition === 'trailing' && type !== 'password' && (
            <span className={styles.iconTrailing} aria-hidden="true">
              {icon}
            </span>
          )}
        </div>
        
        {(error || helperText) && (
          <div className={styles.helperText}>
            {error ? (
              <span className={styles.errorText} role="alert">
                {error}
              </span>
            ) : (
              <span className={styles.helperTextNormal}>
                {helperText}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;