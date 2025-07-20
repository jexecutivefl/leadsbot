import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card/Card';
import Button from '../../components/ui/Button/Button';
import Input from '../../components/ui/Input/Input';
import Modal from '../../components/ui/Modal/Modal';
import styles from './LeadDetailPage.module.css';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  assignedTo: string;
  lastContact: string;
  nextFollowUp: string;
  value: number;
  notes: string;
  address?: string;
  propertyType?: string;
  budget?: number;
  timeline?: string;
  communicationHistory: CommunicationEntry[];
}

interface CommunicationEntry {
  id: string;
  date: string;
  type: 'email' | 'call' | 'text' | 'meeting';
  summary: string;
  notes: string;
  agent: string;
}

const LeadDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editedLead, setEditedLead] = useState<Partial<Lead>>({});

  // Mock data for lead details
  useEffect(() => {
    const mockLead: Lead = {
      id: id || '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '(555) 123-4567',
      status: 'Qualified',
      source: 'Website',
      assignedTo: 'John Doe',
      lastContact: '2024-01-15',
      nextFollowUp: '2024-01-22',
      value: 250000,
      notes: 'Interested in 3-bedroom home in downtown area. Has been pre-approved for $300k mortgage. Prefers modern amenities and good school district.',
      address: '123 Main St, Anytown, ST 12345',
      propertyType: 'Single Family Home',
      budget: 300000,
      timeline: '3-6 months',
      communicationHistory: [
        {
          id: '1',
          date: '2024-01-15',
          type: 'call',
          summary: 'Initial consultation call',
          notes: 'Discussed requirements, budget, and timeline. Very responsive and engaged.',
          agent: 'John Doe'
        },
        {
          id: '2',
          date: '2024-01-12',
          type: 'email',
          summary: 'Property recommendations sent',
          notes: 'Sent 5 property listings matching criteria. Asked for feedback.',
          agent: 'John Doe'
        },
        {
          id: '3',
          date: '2024-01-10',
          type: 'meeting',
          summary: 'First property viewing',
          notes: 'Viewed 3 properties. Showed interest in 123 Oak Street. Will discuss with spouse.',
          agent: 'John Doe'
        }
      ]
    };

    setLead(mockLead);
    setEditedLead(mockLead);
    setLoading(false);
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (lead) {
      setLead({ ...lead, ...editedLead });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedLead(lead || {});
    setIsEditing(false);
  };

  const handleDelete = () => {
    // Implement delete logic here
    console.log('Deleting lead:', id);
    setShowDeleteModal(false);
    navigate('/leads');
  };

  const handleFieldChange = (field: keyof Lead, value: string | number) => {
    setEditedLead(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCommunicationIcon = (type: string) => {
    switch (type) {
      case 'call':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      case 'email':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/>
            <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      case 'text':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      case 'meeting':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
            <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
            <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
            <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Loading lead details...</div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className={styles.page}>
        <div className={styles.error}>Lead not found</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <div className={styles.breadcrumb}>
              <button 
                className={styles.breadcrumbLink}
                onClick={() => navigate('/leads')}
              >
                Leads
              </button>
              <span className={styles.breadcrumbSeparator}>/</span>
              <span className={styles.breadcrumbCurrent}>{lead.name}</span>
            </div>
            <h1 className={styles.title}>{lead.name}</h1>
            <div className={styles.leadMeta}>
              <span className={`${styles.status} ${styles[`status${lead.status.toLowerCase()}`]}`}>
                {lead.status}
              </span>
              <span className={styles.source}>{lead.source}</span>
              <span className={styles.value}>{formatCurrency(lead.value)}</span>
            </div>
          </div>
          <div className={styles.headerActions}>
            <Button
              variant="outline"
              onClick={() => navigate(`/ai-chat?lead=${lead.id}`)}
            >
              AI Chat
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </Button>
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSave}>
                  Save
                </Button>
              </>
            ) : (
              <Button variant="primary" onClick={handleEdit}>
                Edit
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.mainContent}>
          {/* Lead Information */}
          <Card className={styles.infoCard}>
            <h2 className={styles.cardTitle}>Lead Information</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoField}>
                <label className={styles.fieldLabel}>Name</label>
                {isEditing ? (
                  <Input
                    value={editedLead.name || ''}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                  />
                ) : (
                  <span className={styles.fieldValue}>{lead.name}</span>
                )}
              </div>
              
              <div className={styles.infoField}>
                <label className={styles.fieldLabel}>Email</label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={editedLead.email || ''}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                  />
                ) : (
                  <span className={styles.fieldValue}>{lead.email}</span>
                )}
              </div>
              
              <div className={styles.infoField}>
                <label className={styles.fieldLabel}>Phone</label>
                {isEditing ? (
                  <Input
                    value={editedLead.phone || ''}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                  />
                ) : (
                  <span className={styles.fieldValue}>{lead.phone}</span>
                )}
              </div>
              
              <div className={styles.infoField}>
                <label className={styles.fieldLabel}>Status</label>
                {isEditing ? (
                  <select
                    value={editedLead.status || ''}
                    onChange={(e) => handleFieldChange('status', e.target.value)}
                    className={styles.select}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Closed">Closed</option>
                    <option value="Lost">Lost</option>
                  </select>
                ) : (
                  <span className={`${styles.status} ${styles[`status${lead.status.toLowerCase()}`]}`}>
                    {lead.status}
                  </span>
                )}
              </div>
              
              <div className={styles.infoField}>
                <label className={styles.fieldLabel}>Assigned To</label>
                {isEditing ? (
                  <Input
                    value={editedLead.assignedTo || ''}
                    onChange={(e) => handleFieldChange('assignedTo', e.target.value)}
                  />
                ) : (
                  <span className={styles.fieldValue}>{lead.assignedTo}</span>
                )}
              </div>
              
              <div className={styles.infoField}>
                <label className={styles.fieldLabel}>Value</label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editedLead.value || ''}
                    onChange={(e) => handleFieldChange('value', Number(e.target.value))}
                  />
                ) : (
                  <span className={styles.fieldValue}>{formatCurrency(lead.value)}</span>
                )}
              </div>
            </div>
          </Card>

          {/* Property Details */}
          <Card className={styles.infoCard}>
            <h2 className={styles.cardTitle}>Property Details</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoField}>
                <label className={styles.fieldLabel}>Address</label>
                <span className={styles.fieldValue}>{lead.address || 'Not specified'}</span>
              </div>
              
              <div className={styles.infoField}>
                <label className={styles.fieldLabel}>Property Type</label>
                <span className={styles.fieldValue}>{lead.propertyType || 'Not specified'}</span>
              </div>
              
              <div className={styles.infoField}>
                <label className={styles.fieldLabel}>Budget</label>
                <span className={styles.fieldValue}>
                  {lead.budget ? formatCurrency(lead.budget) : 'Not specified'}
                </span>
              </div>
              
              <div className={styles.infoField}>
                <label className={styles.fieldLabel}>Timeline</label>
                <span className={styles.fieldValue}>{lead.timeline || 'Not specified'}</span>
              </div>
            </div>
          </Card>

          {/* Notes */}
          <Card className={styles.infoCard}>
            <h2 className={styles.cardTitle}>Notes</h2>
            {isEditing ? (
              <textarea
                value={editedLead.notes || ''}
                onChange={(e) => handleFieldChange('notes', e.target.value)}
                className={styles.notesTextarea}
                rows={4}
              />
            ) : (
              <p className={styles.notes}>{lead.notes}</p>
            )}
          </Card>
        </div>

        <div className={styles.sidebar}>
          {/* Quick Actions */}
          <Card className={styles.quickActionsCard}>
            <h3 className={styles.cardTitle}>Quick Actions</h3>
            <div className={styles.quickActions}>
              <Button variant="outline" size="small" className={styles.actionButton}>
                Schedule Follow-up
              </Button>
              <Button variant="outline" size="small" className={styles.actionButton}>
                Send Email
              </Button>
              <Button variant="outline" size="small" className={styles.actionButton}>
                Log Call
              </Button>
              <Button variant="outline" size="small" className={styles.actionButton}>
                Create Task
              </Button>
            </div>
          </Card>

          {/* Communication History */}
          <Card className={styles.historyCard}>
            <h3 className={styles.cardTitle}>Communication History</h3>
            <div className={styles.communicationList}>
              {lead.communicationHistory.map((entry) => (
                <div key={entry.id} className={styles.communicationEntry}>
                  <div className={styles.communicationHeader}>
                    <div className={styles.communicationIcon}>
                      {getCommunicationIcon(entry.type)}
                    </div>
                    <div className={styles.communicationMeta}>
                      <span className={styles.communicationType}>{entry.type}</span>
                      <span className={styles.communicationDate}>
                        {formatDate(entry.date)}
                      </span>
                    </div>
                  </div>
                  <h4 className={styles.communicationSummary}>{entry.summary}</h4>
                  <p className={styles.communicationNotes}>{entry.notes}</p>
                  <span className={styles.communicationAgent}>{entry.agent}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Lead"
      >
        <div className={styles.deleteModalContent}>
          <p>Are you sure you want to delete this lead? This action cannot be undone.</p>
          <div className={styles.deleteModalActions}>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Lead
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LeadDetailPage; 