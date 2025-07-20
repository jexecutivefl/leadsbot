import React, { useState, useEffect, useMemo } from 'react';
import styles from './LeadsPage.module.css';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { LeadCard } from '../../components/leads/LeadCard';
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
  const itemsPerPage = 10;

  // Fetch leads from API
  useEffect(() => {
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
      sortable: true,
      render: (lead) => (
        <div className={styles.tableAvatar}>
          <div className={styles.avatarInitials}>
            {lead.firstName[0]}{lead.lastName[0]}
          </div>
          <div className={styles.avatarInfo}>
            <div className={styles.avatarName}>
              {lead.firstName} {lead.lastName}
            </div>
            <div className={styles.avatarEmail}>
              {lead.email || 'No email'}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (lead) => lead.phone || '—'
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (lead) => (
        <span 
          className={styles.statusBadge}
          style={{ backgroundColor: getStatusColor(lead.status || 'new') }}
        >
          {(lead.status || 'new').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </span>
      )
    },
    {
      key: 'source',
      header: 'Source',
      sortable: true,
      render: (lead) => (
        (lead.source || 'other').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
      )
    },
    {
      key: 'assignedTo',
      header: 'Assigned To',
      render: (lead) => lead.assignedTo || '—'
    },
    {
      key: 'createdAt',
      header: 'Created',
      sortable: true,
      render: (lead) => new Date(lead.createdAt).toLocaleDateString()
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '160px',
      render: (lead) => (
        <div className={styles.tableActions}>
                     <Button 
             variant="ghost" 
             size="small"
             onClick={() => handleViewLead(lead)}
           >
             View
           </Button>
           <Button 
             variant="outline" 
             size="small"
             onClick={() => handleEditLead(lead)}
           >
             Edit
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
    // Open edit modal or navigate to edit page
  };

  const handleContactLead = (lead: Lead) => {
    console.log('Contact lead:', lead);
    // Open contact modal or action
  };

  const handleDeleteLead = (lead: Lead) => {
    console.log('Delete lead:', lead);
    // Show confirmation and delete
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for leads:`, selectedLeads);
    // Implement bulk actions
  };

  const handleAddLead = () => {
    console.log('Add new lead');
    // Open add lead modal or navigate to form
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
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>Leads</h1>
          <p className={styles.pageSubtitle}>
            Manage and track your sales leads
          </p>
        </div>
        <div className={styles.headerActions}>
          <Button variant="outline" size="medium">
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
              variant={viewMode === 'table' ? 'primary' : 'ghost'}
              size="medium"
              onClick={() => setViewMode('table')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Table
            </Button>
            <Button
              variant={viewMode === 'cards' ? 'primary' : 'ghost'}
              size="medium"
              onClick={() => setViewMode('cards')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Cards
            </Button>
          </div>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedLeads.length > 0 && (
        <Card className={styles.bulkActionsCard}>
          <div className={styles.bulkActionsContent}>
            <span className={styles.selectionCount}>
              {selectedLeads.length} lead{selectedLeads.length !== 1 ? 's' : ''} selected
            </span>
            <div className={styles.bulkActions}>
              <Button variant="outline" size="small" onClick={() => handleBulkAction('assign')}>
                Assign To
              </Button>
              <Button variant="outline" size="small" onClick={() => handleBulkAction('status')}>
                Change Status
              </Button>
              <Button variant="outline" size="small" onClick={() => handleBulkAction('export')}>
                Export
              </Button>
              <Button variant="destructive" size="small" onClick={() => handleBulkAction('delete')}>
                Delete
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Results Count */}
      <div className={styles.resultsInfo}>
        <span className={styles.resultsCount}>
          {filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''} found
        </span>
      </div>

      {/* Content */}
      {viewMode === 'table' ? (
        <Table
          data={paginatedLeads}
          columns={columns}
          loading={loading}
          emptyMessage="No leads found. Try adjusting your filters or add a new lead."
          onRowClick={handleViewLead}
          selectedRows={selectedLeads}
          onSelectionChange={setSelectedLeads}
          pagination={pagination}
          className={styles.leadsTable}
        />
      ) : (
        <div className={styles.cardsContainer}>
          {loading ? (
            <div className={styles.cardsLoading}>
              <div className={styles.loadingSpinner}>
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
              </div>
              <p>Loading leads...</p>
            </div>
          ) : paginatedLeads.length === 0 ? (
            <div className={styles.emptyState}>
              <svg
                className={styles.emptyIcon}
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <h3 className={styles.emptyTitle}>No leads found</h3>
              <p className={styles.emptyMessage}>
                Try adjusting your filters or add a new lead to get started.
              </p>
              <Button variant="primary" onClick={handleAddLead}>
                Add Lead
              </Button>
            </div>
          ) : (
            <>
              <div className={styles.cardsGrid}>
                {paginatedLeads.map(lead => (
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
              
              {totalPages > 1 && (
                <div className={styles.cardsPagination}>
                  <Button
                    variant="outline"
                    size="medium"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  <span className={styles.paginationInfo}>
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="medium"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default LeadsPage;