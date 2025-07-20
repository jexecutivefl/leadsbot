import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NewLeadPage.module.css';
import LeadForm, { LeadFormData } from '../../components/leads/LeadForm';
import { leadService } from '../../services/leadService';

const NewLeadPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: LeadFormData) => {
    setIsLoading(true);

    try {
      await leadService.createLead(formData);
      navigate('/leads');
    } catch (error) {
      console.error('Error creating lead:', error);
      // You could add error handling here (show toast, etc.)
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/leads');
  };

  return (
    <div className={styles.newLeadPage}>
      <LeadForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={isLoading}
        mode="create"
      />
    </div>
  );
};

export default NewLeadPage; 