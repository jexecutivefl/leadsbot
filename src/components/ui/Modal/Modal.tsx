import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';
import { ModalProps } from '../../../types';

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'medium',
  className = '',
  ...props
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Focus the modal
      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
      
      // Restore focus to the previously focused element
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      // Basic focus trap - get all focusable elements within modal
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements && focusableElements.length > 0) {
        const firstFocusable = focusableElements[0] as HTMLElement;
        const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;
        
        if (event.shiftKey) {
          if (document.activeElement === firstFocusable) {
            event.preventDefault();
            lastFocusable.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            event.preventDefault();
            firstFocusable.focus();
          }
        }
      }
    }
  };

  if (!isOpen) return null;

  const modalClasses = [
    styles.modal,
    styles[`modal${size.charAt(0).toUpperCase() + size.slice(1)}`],
    className
  ].filter(Boolean).join(' ');

  const modalContent = (
    <div
      className={styles.modalBackdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        ref={modalRef}
        className={modalClasses}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
        {...props}
      >
        {title && (
          <div className={styles.modalHeader}>
            <h2 id="modal-title" className={styles.modalTitle}>
              {title}
            </h2>
            <button
              type="button"
              className={styles.modalCloseButton}
              onClick={onClose}
              aria-label="Close modal"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}
        
        <div className={styles.modalBody}>
          {children}
        </div>
        
        {footer && (
          <div className={styles.modalFooter}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;