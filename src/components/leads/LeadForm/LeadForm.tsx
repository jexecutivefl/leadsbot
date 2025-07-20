import { useState, useEffect } from 'react';
import { Lead, LeadStatus, LeadSource } from '../../../types';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import styles from './LeadForm.module.css';

export interface LeadFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: LeadStatus;
  source: LeadSource;
  notes: string;
}

export interface LeadFormProps {
  lead?: Lead;
  onSubmit: (data: LeadFormData) => void;
  onCancel: () => void;
  loading?: boolean;
  mode?: 'create' | 'edit';
}

const LeadForm = ({
  lead,
  onSubmit,
  onCancel,
  loading = false,
  mode = 'create'
}: LeadFormProps) => {
  const [formData, setFormData] = useState<LeadFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    status: 'new',
    source: 'website',
    notes: ''
  });

  const [errors, setErrors] = useState<Partial<LeadFormData>>({});

  useEffect(() => {
    if (lead && mode === 'edit') {
      setFormData({
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email || '',
        phone: lead.phone || '',
        status: lead.status || 'new',
        source: lead.source || 'website',
        notes: lead.notes || ''
      });
    }
  }, [lead, mode]);

  const handleInputChange = (field: keyof LeadFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LeadFormData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const statusOptions = [
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'closed_won', label: 'Closed Won' },
    { value: 'closed_lost', label: 'Closed Lost' },
    { value: 'nurture', label: 'Nurture' }
  ];

  const sourceOptions = [
    { value: 'website', label: 'Website' },
    { value: 'referral', label: 'Referral' },
    { value: 'social_media', label: 'Social Media' },
    { value: 'cold_outreach', label: 'Cold Outreach' },
    { value: 'event', label: 'Event' },
    { value: 'advertising', label: 'Advertising' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <Card className={styles.leadForm}>
      <div className={styles.formHeader}>
        <h2>{mode === 'create' ? 'Add New Lead' : 'Edit Lead'}</h2>
        <p>{mode === 'create' ? 'Enter the lead information below' : 'Update the lead information'}</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          {/* First Name */}
          <div className={styles.formField}>
            <Input
              type="text"
              label="First Name"
              value={formData.firstName}
              onChange={handleInputChange('firstName')}
              error={errors.firstName}
              placeholder="Enter first name"
              required
            />
          </div>

          {/* Last Name */}
          <div className={styles.formField}>
            <Input
              type="text"
              label="Last Name"
              value={formData.lastName}
              onChange={handleInputChange('lastName')}
              error={errors.lastName}
              placeholder="Enter last name"
              required
            />
          </div>

          {/* Email */}
          <div className={styles.formField}>
            <Input
              type="email"
              label="Email"
              value={formData.email}
              onChange={handleInputChange('email')}
              error={errors.email}
              placeholder="Enter email address"
              required
            />
          </div>

          {/* Phone */}
          <div className={styles.formField}>
            <Input
              type="tel"
              label="Phone"
              value={formData.phone}
              onChange={handleInputChange('phone')}
              error={errors.phone}
              placeholder="Enter phone number"
            />
          </div>

          {/* Status */}
          <div className={styles.formField}>
            <Input
              type="select"
              label="Status"
              value={formData.status}
              onChange={handleInputChange('status')}
              options={statusOptions}
            />
          </div>

          {/* Source */}
          <div className={styles.formField}>
            <Input
              type="select"
              label="Source"
              value={formData.source}
              onChange={handleInputChange('source')}
              options={sourceOptions}
            />
          </div>
        </div>

        {/* Notes */}
        <div className={styles.formField}>
          <Input
            type="textarea"
            label="Notes"
            value={formData.notes}
            onChange={handleInputChange('notes')}
            placeholder="Add any notes about this lead..."
            rows={4}
          />
        </div>

        {/* Form Actions */}
        <div className={styles.formActions}>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading}
          >
            {mode === 'create' ? 'Create Lead' : 'Update Lead'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default LeadForm; 