import React from 'react';
import styles from './LeadCard.module.css';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { Lead } from '../../../types';

interface LeadCardProps {
  lead: Lead;
  onView?: (lead: Lead) => void;
  onEdit?: (lead: Lead) => void;
  onContact?: (lead: Lead) => void;
  onDelete?: (lead: Lead) => void;
  className?: string;
}

const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  onView,
  onEdit,
  onContact,
  onDelete,
  className = '',
  ...props
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'var(--color-primary-500)';
      case 'contacted': return 'var(--color-warning-500)';
      case 'qualified': return 'var(--color-success-500)';
      case 'proposal': return 'var(--color-info-500)';
      case 'negotiation': return 'var(--color-primary-700)';
      case 'closed_won': return 'var(--color-success-600)';
      case 'closed_lost': return 'var(--color-error-500)';
      case 'nurture': return 'var(--color-gray-500)';
      default: return 'var(--color-gray-500)';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'website':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      case 'referral':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
            <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      case 'social_media':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      case 'cold_outreach':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/>
            <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      case 'event':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
            <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
            <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
            <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      case 'advertising':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      default:
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/>
            <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getTimeSince = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const cardClasses = [
    styles.leadCard,
    className
  ].filter(Boolean).join(' ');

  return (
    <Card className={cardClasses} {...props}>
      <div className={styles.leadCardContent}>
        {/* Header Section */}
        <div className={styles.leadHeader}>
          <div className={styles.leadAvatar}>
            {lead.firstName[0]}{lead.lastName[0]}
          </div>
          <div className={styles.leadInfo}>
            <h3 className={styles.leadName}>
              {lead.firstName} {lead.lastName}
            </h3>
            <p className={styles.leadEmail}>
              {lead.email}
            </p>
            {lead.phone && (
              <p className={styles.leadPhone}>
                {lead.phone}
              </p>
            )}
          </div>
          <div className={styles.leadStatus}>
            <span 
              className={styles.statusBadge}
              style={{ backgroundColor: getStatusColor(lead.status || 'new') }}
            >
              {(lead.status || 'new').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          </div>
        </div>

        {/* Details Section */}
        <div className={styles.leadDetails}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Source:</span>
            <span className={styles.detailValue}>
              <span className={styles.sourceIcon}>
                {getSourceIcon(lead.source || 'other')}
              </span>
              {(lead.source || 'other').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          </div>
          
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Created:</span>
            <span className={styles.detailValue}>
              {formatDate(lead.createdAt)}
            </span>
          </div>

          {lead.lastContacted && (
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Last Contact:</span>
              <span className={styles.detailValue}>
                {getTimeSince(lead.lastContacted)}
              </span>
            </div>
          )}

          {lead.assignedTo && (
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Assigned to:</span>
              <span className={styles.detailValue}>
                {lead.assignedTo}
              </span>
            </div>
          )}
        </div>

        {/* Notes Section */}
        {lead.notes && (
          <div className={styles.leadNotes}>
            <p className={styles.notesText}>
              {lead.notes.length > 120 
                ? `${lead.notes.substring(0, 120)}...` 
                : lead.notes
              }
            </p>
          </div>
        )}

        {/* Communications Count */}
        {lead.communications && lead.communications.length > 0 && (
          <div className={styles.communicationsCount}>
            <span className={styles.countIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </span>
            <span className={styles.countText}>
              {lead.communications.length} communication{lead.communications.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* Documents Count */}
        {lead.documents && lead.documents.length > 0 && (
          <div className={styles.documentsCount}>
            <span className={styles.countIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
                <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </span>
            <span className={styles.countText}>
              {lead.documents.length} document{lead.documents.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className={styles.leadActions}>
          <Button 
            variant="ghost" 
            size="small"
            onClick={() => onView?.(lead)}
          >
            View
          </Button>
          <Button 
            variant="outline" 
            size="small"
            onClick={() => onContact?.(lead)}
          >
            Contact
          </Button>
          <Button 
            variant="outline" 
            size="small"
            onClick={() => onEdit?.(lead)}
          >
            Edit
          </Button>
          {onDelete && (
            <Button 
              variant="destructive" 
              size="small"
              onClick={() => onDelete(lead)}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default LeadCard;