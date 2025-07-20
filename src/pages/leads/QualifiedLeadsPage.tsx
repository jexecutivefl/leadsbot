import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card/Card';
import Button from '../../components/ui/Button/Button';
import Table from '../../components/ui/Table/Table';
import Input from '../../components/ui/Input/Input';
import styles from './QualifiedLeadsPage.module.css';

import { Lead, TableColumn } from '../../types';

const QualifiedLeadsPage: React.FC = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);

  // Mock data for qualified leads
  useEffect(() => {
    const mockQualifiedLeads: Lead[] = [
      {
        id: '1',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@email.com',
        phone: '(555) 123-4567',
        status: 'qualified',
        source: 'website',
        assignedToId: 'user1',
        lastContacted: '2024-01-15T10:00:00Z',
        nextFollowUp: '2024-01-22T10:00:00Z',
        budget: { maxAmount: 250000 },
        notes: 'Interested in 3-bedroom home in downtown area',
        communications: [],
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'michael.chen@email.com',
        phone: '(555) 234-5678',
        status: 'qualified',
        source: 'referral',
        assignedToId: 'user2',
        lastContacted: '2024-01-14T10:00:00Z',
        nextFollowUp: '2024-01-21T10:00:00Z',
        budget: { maxAmount: 350000 },
        notes: 'Looking for investment property, ready to move quickly',
        communications: [],
        createdAt: '2024-01-09T10:00:00Z',
        updatedAt: '2024-01-14T10:00:00Z'
      },
      {
        id: '3',
        firstName: 'Emily',
        lastName: 'Rodriguez',
        email: 'emily.rodriguez@email.com',
        phone: '(555) 345-6789',
        status: 'qualified',
        source: 'socialMedia',
        assignedToId: 'user1',
        lastContacted: '2024-01-13T10:00:00Z',
        nextFollowUp: '2024-01-20T10:00:00Z',
        budget: { maxAmount: 180000 },
        notes: 'First-time buyer, needs guidance through process',
        communications: [],
        createdAt: '2024-01-08T10:00:00Z',
        updatedAt: '2024-01-13T10:00:00Z'
      },
      {
        id: '4',
        firstName: 'David',
        lastName: 'Thompson',
        email: 'david.thompson@email.com',
        phone: '(555) 456-7890',
        status: 'qualified',
        source: 'website',
        assignedToId: 'user2',
        lastContacted: '2024-01-12T10:00:00Z',
        nextFollowUp: '2024-01-19T10:00:00Z',
        budget: { maxAmount: 420000 },
        notes: 'Relocating from out of state, needs quick closing',
        communications: [],
        createdAt: '2024-01-07T10:00:00Z',
        updatedAt: '2024-01-12T10:00:00Z'
      },
      {
        id: '5',
        firstName: 'Lisa',
        lastName: 'Wang',
        email: 'lisa.wang@email.com',
        phone: '(555) 567-8901',
        status: 'qualified',
        source: 'referral',
        assignedToId: 'user1',
        lastContacted: '2024-01-11T10:00:00Z',
        nextFollowUp: '2024-01-18T10:00:00Z',
        budget: { maxAmount: 280000 },
        notes: 'Selling current home, looking for upgrade',
        communications: [],
        createdAt: '2024-01-06T10:00:00Z',
        updatedAt: '2024-01-11T10:00:00Z'
      }
    ];

    setLeads(mockQualifiedLeads);
    setFilteredLeads(mockQualifiedLeads);
    setLoading(false);
  }, []);

  // Filter leads based on search term
  useEffect(() => {
    const filtered = leads.filter(lead =>
      `${lead.firstName} ${lead.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      lead.phone.includes(searchTerm) ||
      (lead.assignedToId && lead.assignedToId.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredLeads(filtered);
  }, [searchTerm, leads]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearchTerm(e.target.value);
  };



  const handleBulkAction = (action: string) => {
    console.log(`Bulk action ${action} for leads:`, selectedLeads);
    // Implement bulk actions here
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
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const columns: TableColumn<Lead>[] = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (lead) => (
        <div className={styles.leadName}>
          <span className={styles.nameText}>{`${lead.firstName} ${lead.lastName}`}</span>
          <span className={styles.sourceBadge}>{lead.source || 'other'}</span>
        </div>
      )
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
      render: (lead) => lead.email || 'N/A'
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (lead) => lead.phone
    },
    {
      key: 'value',
      header: 'Value',
      sortable: true,
      render: (lead) => formatCurrency(lead.budget?.maxAmount || 0)
    },
    {
      key: 'assignedTo',
      header: 'Assigned To',
      render: (lead) => lead.assignedToId || 'Unassigned'
    },
    {
      key: 'lastContact',
      header: 'Last Contact',
      sortable: true,
      render: (lead) => lead.lastContacted ? formatDate(lead.lastContacted) : 'Never'
    },
    {
      key: 'nextFollowUp',
      header: 'Next Follow-up',
      sortable: true,
      render: (lead) => lead.nextFollowUp ? formatDate(lead.nextFollowUp) : 'Not scheduled'
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '160px',
      render: (lead) => (
        <div className={styles.actions}>
          <Button
            variant="outline"
            size="small"
            onClick={() => navigate(`/leads/${lead.id}`)}
          >
            View
          </Button>
          <Button
            variant="outline"
            size="small"
            onClick={() => navigate(`/ai-chat?lead=${lead.id}`)}
          >
            Chat
          </Button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Loading qualified leads...</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>Qualified Leads</h1>
            <p className={styles.subtitle}>
              Manage and track your qualified leads ({filteredLeads.length} total)
            </p>
          </div>
          <div className={styles.headerActions}>
            <Button
              variant="primary"
              onClick={() => navigate('/leads/new')}
            >
              Add New Lead
            </Button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className={styles.filtersCard}>
        <div className={styles.filtersContent}>
          <div className={styles.searchSection}>
            <Input
              type="text"
              placeholder="Search leads by name, email, phone, or assigned agent..."
              value={searchTerm}
              onChange={handleSearchChange}
              className={styles.searchInput}
            />
          </div>
          
          {selectedLeads.length > 0 && (
            <div className={styles.bulkActions}>
              <span className={styles.selectedCount}>
                {selectedLeads.length} selected
              </span>
              <Button
                variant="outline"
                size="small"
                onClick={() => handleBulkAction('export')}
              >
                Export
              </Button>
              <Button
                variant="outline"
                size="small"
                onClick={() => handleBulkAction('assign')}
              >
                Reassign
              </Button>
              <Button
                variant="outline"
                size="small"
                onClick={() => handleBulkAction('schedule')}
              >
                Schedule Follow-up
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Leads Table */}
      <Card className={styles.tableCard}>
        <Table
          columns={columns}
          data={filteredLeads}
          selectedRows={selectedLeads}
          onSelectionChange={setSelectedLeads}
          className={styles.leadsTable}
        />
      </Card>

      {/* Summary Stats */}
      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <div className={styles.statContent}>
            <h3 className={styles.statTitle}>Total Value</h3>
            <p className={styles.statValue}>
              {formatCurrency(filteredLeads.reduce((sum, lead) => sum + (lead.budget?.maxAmount || 0), 0))}
            </p>
          </div>
        </Card>
        
        <Card className={styles.statCard}>
          <div className={styles.statContent}>
            <h3 className={styles.statTitle}>Avg Lead Value</h3>
            <p className={styles.statValue}>
              {filteredLeads.length > 0 
                ? formatCurrency(filteredLeads.reduce((sum, lead) => sum + (lead.budget?.maxAmount || 0), 0) / filteredLeads.length)
                : '$0'
              }
            </p>
          </div>
        </Card>
        
        <Card className={styles.statCard}>
          <div className={styles.statContent}>
            <h3 className={styles.statTitle}>Due for Follow-up</h3>
            <p className={styles.statValue}>
              {filteredLeads.filter(lead => lead.nextFollowUp && new Date(lead.nextFollowUp) <= new Date()).length}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QualifiedLeadsPage; 