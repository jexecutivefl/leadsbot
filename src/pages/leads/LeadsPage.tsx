import React, { useState, useEffect, useMemo } from 'react';
import styles from './LeadsPage.module.css';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { LeadCard } from '../../components/leads/LeadCard';
import CSVImport from '../../components/leads/CSVImport';
import { Lead, AmplifyLead, adaptAmplifyLeadToLead, TableColumn, TablePagination } from '../../types';
import { leadService } from '../../services/leadService';

type ViewMode = 'table' | 'cards';

type FilterStatus = 'all' | 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost' | 'nurture';
type FilterSource = 'all' | 'website' | 'referral' | 'social_media' | 'cold_outreach' | 'event' | 'advertising' | 'other';

interface LeadsPageProps {
  className?: string;
}

const LeadsPage: React.FC<LeadsPageProps> = ({
  className = '',
  ...props
}) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [sourceFilter, setSourceFilter] = useState<FilterSource>('all');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCSVImport, setShowCSVImport] = useState(false);
  const itemsPerPage = 10;

  // Fetch leads from API
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const leadsData = await leadService.listLeads();
      // Convert AmplifyLead[] to Lead[] for our app
      const convertedLeads = leadsData.map(lead => adaptAmplifyLeadToLead(lead as AmplifyLead));
      setLeads(convertedLeads);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Filter and search logic
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = 
        lead.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lead.email && lead.email.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
      
      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [leads, searchQuery, statusFilter, sourceFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const pagination: TablePagination = {
    currentPage,
    totalPages,
    onPageChange: setCurrentPage
  };

  // Status badge color helper
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

  // Table columns configuration
  const columns: TableColumn<Lead>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (lead) => (
        <div className={styles.nameCell}>
          <div className={styles.nameInfo}>
            <span className={styles.fullName}>
              {lead.firstName} {lead.lastName}
            </span>
            {lead.email && (
              <span className={styles.email}>{lead.email}</span>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (lead) => lead.phone
    },
    {
      key: 'status',
      header: 'Status',
      render: (lead) => (
        <span 
          className={styles.statusBadge}
          style={{ backgroundColor: getStatusColor(lead.status || 'new') }}
        >
          {(lead.status || 'new').replace('_', ' ').toUpperCase()}
        </span>
      )
    },
    {
      key: 'source',
      header: 'Source',
      render: (lead) => (
        <span className={styles.sourceBadge}>
          {(lead.source || 'other').replace('_', ' ').toUpperCase()}
        </span>
      )
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (lead) => (
        <span className={`${styles.priorityBadge} ${styles[`priority-${lead.priority || 'warm'}`]}`}>
          {(lead.priority || 'warm').toUpperCase()}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (lead) => (
        <div className={styles.actionButtons}>
          <Button
            variant="ghost"
            size="small"
            onClick={() => handleViewLead(lead)}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
              </svg>
            }
          >
            View
          </Button>
          <Button
            variant="ghost"
            size="small"
            onClick={() => handleEditLead(lead)}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2"/>
                <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            }
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="small"
            onClick={() => handleContactLead(lead)}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22 2H2l8 9.46V19l4-2v-8.54L22 2z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            }
          >
            Contact
          </Button>
        </div>
      )
    }
  ];

  // Event handlers
  const handleViewLead = (lead: Lead) => {
    console.log('View lead:', lead);
    // Navigate to lead detail page
  };

  const handleEditLead = (lead: Lead) => {
    console.log('Edit lead:', lead);
    // Open edit lead modal
  };

  const handleContactLead = (lead: Lead) => {
    console.log('Contact lead:', lead);
    // Open contact lead modal
  };

  const handleDeleteLead = (lead: Lead) => {
    console.log('Delete lead:', lead);
    // Show delete confirmation
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for leads:`, selectedLeads);
    // Implement bulk actions
  };

  const handleAddLead = () => {
    console.log('Add new lead');
    // Open add lead modal or navigate to form
  };

  const handleImportLeads = () => {
    setShowCSVImport(true);
  };

  const handleImportComplete = (importedCount: number) => {
    setShowCSVImport(false);
    // Refresh the leads list
    fetchLeads();
    console.log(`Imported ${importedCount} leads`);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSourceFilter('all');
    setCurrentPage(1);
  };

  const leadsPageClasses = [
    styles.leadsPage,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={leadsPageClasses} {...props}>
      {/* CSV Import Modal */}
      {showCSVImport && (
        <div className={styles.modalOverlay}>
          <CSVImport
            onImportComplete={handleImportComplete}
            onClose={() => setShowCSVImport(false)}
          />
        </div>
      )}

      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>Leads</h1>
          <p className={styles.pageSubtitle}>
            Manage and track your sales leads
          </p>
        </div>
        <div className={styles.headerActions}>
          <Button variant="outline" size="medium" onClick={handleImportLeads}>
            Import Leads
          </Button>
          <Button variant="primary" size="medium" onClick={handleAddLead}>
            Add Lead
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className={styles.filtersCard}>
        <div className={styles.filtersContent}>
          <div className={styles.searchSection}>
            <Input
              type="text"
              placeholder="Search leads by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
                </svg>
              }
              iconPosition="leading"
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.filtersSection}>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
              className={styles.filterSelect}
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">Proposal</option>
              <option value="negotiation">Negotiation</option>
              <option value="closed_won">Closed Won</option>
              <option value="closed_lost">Closed Lost</option>
              <option value="nurture">Nurture</option>
            </select>

            <select 
              value={sourceFilter} 
              onChange={(e) => setSourceFilter(e.target.value as FilterSource)}
              className={styles.filterSelect}
            >
              <option value="all">All Sources</option>
              <option value="website">Website</option>
              <option value="referral">Referral</option>
              <option value="social_media">Social Media</option>
              <option value="cold_outreach">Cold Outreach</option>
              <option value="event">Event</option>
              <option value="advertising">Advertising</option>
              <option value="other">Other</option>
            </select>

            <Button variant="outline" size="medium" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>

          <div className={styles.viewToggle}>
            <Button
              variant={viewMode === 'table' ? 'primary' : 'outline'}
              size="small"
              onClick={() => setViewMode('table')}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M3 3h18v18H3zM9 9h6v6H9z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              }
            >
              Table
            </Button>
            <Button
              variant={viewMode === 'cards' ? 'primary' : 'outline'}
              size="small"
              onClick={() => setViewMode('cards')}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                  <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                  <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                  <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                </svg>
              }
            >
              Cards
            </Button>
          </div>
        </div>
      </Card>

      {/* Content */}
      {loading ? (
        <Card className={styles.loadingCard}>
          <div className={styles.loadingContent}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading leads...</p>
          </div>
        </Card>
      ) : filteredLeads.length === 0 ? (
        <Card className={styles.emptyCard}>
          <div className={styles.emptyContent}>
            <div className={styles.emptyIcon}>📋</div>
            <h3>No leads found</h3>
            <p>
              {searchQuery || statusFilter !== 'all' || sourceFilter !== 'all'
                ? 'Try adjusting your filters or search terms.'
                : 'Get started by adding your first lead or importing from a CSV file.'}
            </p>
            <div className={styles.emptyActions}>
              <Button variant="primary" onClick={handleAddLead}>
                Add First Lead
              </Button>
              <Button variant="outline" onClick={handleImportLeads}>
                Import from CSV
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <>
          {/* Bulk Actions */}
          {selectedLeads.length > 0 && (
            <Card className={styles.bulkActionsCard}>
              <div className={styles.bulkActionsContent}>
                <span className={styles.bulkActionsText}>
                  {selectedLeads.length} lead{selectedLeads.length !== 1 ? 's' : ''} selected
                </span>
                <div className={styles.bulkActionsButtons}>
                  <Button variant="outline" size="small" onClick={() => handleBulkAction('contact')}>
                    Contact All
                  </Button>
                  <Button variant="outline" size="small" onClick={() => handleBulkAction('export')}>
                    Export
                  </Button>
                  <Button variant="outline" size="small" onClick={() => handleBulkAction('delete')}>
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Leads Display */}
          {viewMode === 'table' ? (
            <Card className={styles.tableCard}>
              <Table
                data={paginatedLeads}
                columns={columns}
                pagination={pagination}
                onSelectionChange={setSelectedLeads}
                className={styles.leadsTable}
              />
            </Card>
          ) : (
            <div className={styles.cardsGrid}>
              {paginatedLeads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onView={handleViewLead}
                  onEdit={handleEditLead}
                  onContact={handleContactLead}
                  onDelete={handleDeleteLead}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LeadsPage;