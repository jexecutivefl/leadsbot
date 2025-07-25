import React from 'react';
import styles from './Card.module.css';
import { CardProps } from '../../../types';

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  actions,
  variant = 'default',
  className = '',
  onClick,
  ...props
}) => {
  const cardClasses = [
    styles.card,
    styles[`card${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
    onClick && styles.cardClickable,
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={cardClasses} 
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {(title || subtitle || actions) && (
        <div className={styles.cardHeader}>
          <div className={styles.cardHeaderContent}>
            {title && (
              <h3 className={styles.cardTitle}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p className={styles.cardSubtitle}>
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className={styles.cardActions}>
              {actions}
            </div>
          )}
        </div>
      )}
      
      <div className={styles.cardBody}>
        {children}
      </div>
    </div>
  );
};

export default Card;