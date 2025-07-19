import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

interface StatsData {
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  conversionRate: number;
}

interface RecentLead {
  id: string;
  name: string;
  email: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal';
  source: string;
  createdAt: string;
}

interface DashboardProps {
  className?: string;
}

const Dashboard: React.FC<DashboardProps> = ({
  className = '',
  ...props
}) => {
  const [statsData, setStatsData] = useState<StatsData>({
    totalLeads: 0,
    newLeads: 0,
    qualifiedLeads: 0,
    conversionRate: 0,
  });
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        setStatsData({
          totalLeads: 347,
          newLeads: 12,
          qualifiedLeads: 28,
          conversionRate: 24.5,
        });

        setRecentLeads([
          {
            id: '1',
            name: 'Sarah Johnson',
            email: 'sarah.johnson@email.com',
            status: 'new',
            source: 'Website',
            createdAt: '2024-01-15T10:30:00Z',
          },
          {
            id: '2',
            name: 'Michael Chen',
            email: 'michael.chen@email.com',
            status: 'contacted',
            source: 'Referral',
            createdAt: '2024-01-15T09:15:00Z',
          },
          {
            id: '3',
            name: 'Emily Davis',
            email: 'emily.davis@email.com',
            status: 'qualified',
            source: 'Social Media',
            createdAt: '2024-01-15T08:45:00Z',
          },
          {
            id: '4',
            name: 'David Wilson',
            email: 'david.wilson@email.com',
            status: 'proposal',
            source: 'Cold Outreach',
            createdAt: '2024-01-14T16:20:00Z',
          },
          {
            id: '5',
            name: 'Lisa Thompson',
            email: 'lisa.thompson@email.com',
            status: 'new',
            source: 'Website',
            createdAt: '2024-01-14T14:10:00Z',
          },
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'var(--color-primary-500)';
      case 'contacted': return 'var(--color-warning-500)';
      case 'qualified': return 'var(--color-success-500)';
      case 'proposal': return 'var(--color-info-500)';
      default: return 'var(--color-gray-500)';
    }
  };

  const getStatusBadge = (status: string) => (
    <span 
      className={styles.statusBadge} 
      style={{ backgroundColor: getStatusColor(status) }}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const dashboardClasses = [
    styles.dashboard,
    className
  ].filter(Boolean).join(' ');

  if (isLoading) {
    return (
      <div className={dashboardClasses} {...props}>
        <div className={styles.loadingState}>
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
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={dashboardClasses} {...props}>
      {/* Welcome Section */}
      <div className={styles.welcomeSection}>
        <div className={styles.welcomeContent}>
          <h1 className={styles.welcomeTitle}>Welcome back, John!</h1>
          <p className={styles.welcomeSubtitle}>
            Here's what's happening with your leads today
          </p>
        </div>
        <div className={styles.welcomeActions}>
          <Button variant="outline" size="medium">
            View Reports
          </Button>
          <Button variant="primary" size="medium">
            Add New Lead
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <Card className={styles.statsCard}>
          <div className={styles.statsContent}>
            <div className={styles.statsIcon} style={{ backgroundColor: 'var(--color-primary-100)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="var(--color-primary-600)" strokeWidth="2"/>
                <circle cx="9" cy="7" r="4" stroke="var(--color-primary-600)" strokeWidth="2"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="var(--color-primary-600)" strokeWidth="2"/>
              </svg>
            </div>
            <div className={styles.statsText}>
              <h3 className={styles.statsNumber}>{statsData.totalLeads}</h3>
              <p className={styles.statsLabel}>Total Leads</p>
              <span className={styles.statsChange}>+8% from last month</span>
            </div>
          </div>
        </Card>

        <Card className={styles.statsCard}>
          <div className={styles.statsContent}>
            <div className={styles.statsIcon} style={{ backgroundColor: 'var(--color-success-100)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="var(--color-success-600)" strokeWidth="2"/>
                <circle cx="12" cy="12" r="3" fill="var(--color-success-600)"/>
              </svg>
            </div>
            <div className={styles.statsText}>
              <h3 className={styles.statsNumber}>{statsData.newLeads}</h3>
              <p className={styles.statsLabel}>New This Week</p>
              <span className={styles.statsChange}>+12% from last week</span>
            </div>
          </div>
        </Card>

        <Card className={styles.statsCard}>
          <div className={styles.statsContent}>
            <div className={styles.statsIcon} style={{ backgroundColor: 'var(--color-warning-100)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4" stroke="var(--color-warning-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="10" stroke="var(--color-warning-600)" strokeWidth="2"/>
              </svg>
            </div>
            <div className={styles.statsText}>
              <h3 className={styles.statsNumber}>{statsData.qualifiedLeads}</h3>
              <p className={styles.statsLabel}>Qualified</p>
              <span className={styles.statsChange}>+5% from last month</span>
            </div>
          </div>
        </Card>

        <Card className={styles.statsCard}>
          <div className={styles.statsContent}>
            <div className={styles.statsIcon} style={{ backgroundColor: 'var(--color-info-100)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 3v18h18" stroke="var(--color-info-600)" strokeWidth="2"/>
                <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" stroke="var(--color-info-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={styles.statsText}>
              <h3 className={styles.statsNumber}>{statsData.conversionRate}%</h3>
              <p className={styles.statsLabel}>Conversion Rate</p>
              <span className={styles.statsChange}>+2.1% from last month</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Leads Table */}
      <Card 
        title="Recent Leads" 
        subtitle="Latest leads that need your attention"
        actions={
          <Button variant="outline" size="small">
            View All Leads
          </Button>
        }
        className={styles.recentLeadsCard}
      >
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr>
                <th className={styles.tableHeaderCell}>Name</th>
                <th className={styles.tableHeaderCell}>Email</th>
                <th className={styles.tableHeaderCell}>Status</th>
                <th className={styles.tableHeaderCell}>Source</th>
                <th className={styles.tableHeaderCell}>Created</th>
                <th className={styles.tableHeaderCell}>Actions</th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {recentLeads.map((lead) => (
                <tr key={lead.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>
                    <div className={styles.leadName}>
                      <div className={styles.leadAvatar}>
                        {lead.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span>{lead.name}</span>
                    </div>
                  </td>
                  <td className={styles.tableCell}>
                    <span className={styles.leadEmail}>{lead.email}</span>
                  </td>
                  <td className={styles.tableCell}>
                    {getStatusBadge(lead.status)}
                  </td>
                  <td className={styles.tableCell}>
                    <span className={styles.leadSource}>{lead.source}</span>
                  </td>
                  <td className={styles.tableCell}>
                    <span className={styles.leadDate}>{formatDate(lead.createdAt)}</span>
                  </td>
                  <td className={styles.tableCell}>
                    <div className={styles.tableActions}>
                      <Button variant="ghost" size="small">
                        View
                      </Button>
                      <Button variant="outline" size="small">
                        Contact
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <Card title="Quick Actions" className={styles.quickActionsCard}>
          <div className={styles.actionGrid}>
            <Button variant="primary" size="medium" className={styles.actionButton}>
              Import Leads
            </Button>
            <Button variant="outline" size="medium" className={styles.actionButton}>
              Export Data
            </Button>
            <Button variant="outline" size="medium" className={styles.actionButton}>
              Send Campaign
            </Button>
            <Button variant="outline" size="medium" className={styles.actionButton}>
              View Analytics
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;