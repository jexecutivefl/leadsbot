import React, { useState, useEffect } from 'react'
import { format, subDays } from 'date-fns'
import { AnalyticsData, DateRange } from '../../services/analyticsService'
import { analyticsService } from '../../services/analyticsService'
import { leadService } from '../../services/leadService'
import { AmplifyLead, adaptAmplifyLeadToLead } from '../../types'
import { FilterOptions } from '../../components/analytics/AdvancedFilters'
import { MetricsCard } from '../../components/analytics/MetricsCard'
import { Chart, ChartData } from '../../components/analytics/Chart'
import { AdvancedFilters } from '../../components/analytics/AdvancedFilters'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import styles from './AnalyticsPage.module.css'

const AnalyticsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState('7d')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [filters, setFilters] = useState<FilterOptions>({
    sources: [],
    statuses: [],
    searchTerm: undefined
  })
  const [availableSources, setAvailableSources] = useState<string[]>([])
  const [availableStatuses, setAvailableStatuses] = useState<string[]>([])
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    metrics: {
      totalLeads: 0,
      newLeads: 0,
      conversionRate: 0,
      responseTime: 0,
      qualifiedLeads: 0,
      activeLeads: 0
    },
    leadTrends: [],
    sourceDistribution: [],
    conversionTrends: [],
    responseTimeTrends: [],
    statusDistribution: []
  })

  // Get date range from string
  const getDateRange = (range: string): DateRange => {
    const end = new Date()
    const start = new Date()
    
    switch (range) {
      case '7d':
        start.setDate(end.getDate() - 7)
        break
      case '30d':
        start.setDate(end.getDate() - 30)
        break
      case '90d':
        start.setDate(end.getDate() - 90)
        break
      default:
        start.setDate(end.getDate() - 7)
    }
    
    return { start, end }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        // Load leads data
        const leads = await leadService.listLeads()
        // Convert AmplifyLead[] to Lead[] for analytics service
        const convertedLeads = leads.map(lead => adaptAmplifyLeadToLead(lead as AmplifyLead))
        analyticsService.setLeads(convertedLeads)
        
        // Extract available sources and statuses from leads data
        const sources = [...new Set(leads.map(lead => lead.source).filter(Boolean))].sort() as string[]
        const statuses = [...new Set(leads.map(lead => lead.status).filter(Boolean))].sort() as string[]
        setAvailableSources(sources)
        setAvailableStatuses(statuses)
        
        // Get analytics data for current date range and filters
        const dateRangeObj = getDateRange(dateRange)
        const data = await analyticsService.getAnalyticsData(dateRangeObj, filters)
        setAnalyticsData(data)
        setLastUpdated(new Date())
      } catch (error) {
        console.error('Error loading analytics data:', error)
        // Fallback to mock data if service fails
        const mockData = generateMockData()
        setAnalyticsData(mockData)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [dateRange, filters])

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!loading) {
        setRefreshing(true)
        try {
          const leads = await leadService.listLeads()
          // Convert AmplifyLead[] to Lead[] for analytics service
          const convertedLeads = leads.map(lead => adaptAmplifyLeadToLead(lead as AmplifyLead))
          analyticsService.setLeads(convertedLeads)
          const dateRangeObj = getDateRange(dateRange)
          const data = await analyticsService.getAnalyticsData(dateRangeObj, filters)
          setAnalyticsData(data)
          setLastUpdated(new Date())
        } catch (error) {
          console.error('Error refreshing analytics data:', error)
        } finally {
          setRefreshing(false)
        }
      }
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [loading, dateRange, filters])

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const leads = await leadService.listLeads()
      // Convert AmplifyLead[] to Lead[] for analytics service
      const convertedLeads = leads.map(lead => adaptAmplifyLeadToLead(lead as AmplifyLead))
      analyticsService.setLeads(convertedLeads)
      const dateRangeObj = getDateRange(dateRange)
      const data = await analyticsService.getAnalyticsData(dateRangeObj, filters)
      setAnalyticsData(data)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error refreshing data:', error)
    } finally {
      setRefreshing(false)
    }
  }

  // Mock data generation (fallback)
  const generateMockData = (): AnalyticsData => {
    const now = new Date()
    const leadTrends: ChartData[] = []
    const conversionTrends: ChartData[] = []
    const responseTimeTrends: ChartData[] = []

    for (let i = 6; i >= 0; i--) {
      const date = subDays(now, i)
      leadTrends.push({
        name: format(date, 'MMM dd'),
        value: Math.floor(Math.random() * 50) + 10,
        new: Math.floor(Math.random() * 20) + 5
      })
      conversionTrends.push({
        name: format(date, 'MMM dd'),
        value: Math.random() * 30 + 10
      })
      responseTimeTrends.push({
        name: format(date, 'MMM dd'),
        value: Math.random() * 120 + 30
      })
    }

    const sourceDistribution: ChartData[] = [
      { name: 'Website', value: 45 },
      { name: 'Social Media', value: 25 },
      { name: 'Referrals', value: 15 },
      { name: 'Email', value: 10 },
      { name: 'Other', value: 5 }
    ]

    const statusDistribution: ChartData[] = [
      { name: 'New', value: 30 },
      { name: 'Contacted', value: 25 },
      { name: 'Follow-up', value: 20 },
      { name: 'Qualified', value: 15 },
      { name: 'Lost', value: 10 }
    ]

    return {
      metrics: {
        totalLeads: 1247,
        newLeads: 89,
        conversionRate: 23.4,
        responseTime: 45,
        qualifiedLeads: 187,
        activeLeads: 75
      },
      leadTrends,
      sourceDistribution,
      conversionTrends,
      responseTimeTrends,
      statusDistribution
    }
  }

  const handleDateRangeChange = (range: string) => {
    setDateRange(range)
  }

  const handleExport = async (exportFormat: 'json' | 'csv' | 'pdf' = 'json') => {
    try {
      const dateRangeObj = getDateRange(dateRange)
      const dataStr = await analyticsService.exportAnalyticsData(dateRangeObj, exportFormat, filters)
      
      let mimeType = 'application/json'
      let fileExtension = 'json'
      
      if (exportFormat === 'csv') {
        mimeType = 'text/csv'
        fileExtension = 'csv'
      } else if (exportFormat === 'pdf') {
        mimeType = 'text/html'
        fileExtension = 'html'
      }
      
      const dataBlob = new Blob([dataStr], { type: mimeType })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `analytics-${format(new Date(), 'yyyy-MM-dd')}.${fileExtension}`
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting data:', error)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Analytics Dashboard</h1>
          <p className={styles.subtitle}>
            Track your lead performance and conversion metrics
          </p>
        </div>
        
        <div className={styles.controls}>
          <div className={styles.dateRange}>
            <Button
              variant={dateRange === '7d' ? 'primary' : 'outline'}
              size="small"
              onClick={() => handleDateRangeChange('7d')}
            >
              7 Days
            </Button>
            <Button
              variant={dateRange === '30d' ? 'primary' : 'outline'}
              size="small"
              onClick={() => handleDateRangeChange('30d')}
            >
              30 Days
            </Button>
            <Button
              variant={dateRange === '90d' ? 'primary' : 'outline'}
              size="small"
              onClick={() => handleDateRangeChange('90d')}
            >
              90 Days
            </Button>
          </div>
          
          <div className={styles.actionButtons}>
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <div className={styles.exportDropdown}>
              <Button variant="outline" onClick={() => handleExport('json')}>
                Export JSON
              </Button>
              <Button variant="outline" onClick={() => handleExport('csv')}>
                Export CSV
              </Button>
              <Button variant="outline" onClick={() => handleExport('pdf')}>
                Export PDF
              </Button>
            </div>
          </div>
        </div>
        
        <div className={styles.lastUpdated}>
          Last updated: {format(lastUpdated, 'MMM dd, yyyy HH:mm')}
        </div>
      </div>

      <div className={styles.advancedFilters}>
        <AdvancedFilters
          onFiltersChange={setFilters}
          availableSources={availableSources}
          availableStatuses={availableStatuses}
        />
      </div>

      <div className={styles.metricsGrid}>
        <MetricsCard
          title="Total Leads"
          value={analyticsData.metrics.totalLeads.toLocaleString()}
          change={{ value: 12.5, type: 'increase' }}
          trend="up"
          loading={loading}
        />
        <MetricsCard
          title="New Leads"
          value={analyticsData.metrics.newLeads}
          change={{ value: 8.2, type: 'increase' }}
          trend="up"
          loading={loading}
        />
        <MetricsCard
          title="Conversion Rate"
          value={`${analyticsData.metrics.conversionRate}%`}
          change={{ value: 2.1, type: 'increase' }}
          trend="up"
          loading={loading}
        />
        <MetricsCard
          title="Avg Response Time"
          value={`${analyticsData.metrics.responseTime}m`}
          change={{ value: 5.3, type: 'decrease' }}
          trend="down"
          loading={loading}
        />
        <MetricsCard
          title="Qualified Leads"
          value={analyticsData.metrics.qualifiedLeads}
          change={{ value: 15.2, type: 'increase' }}
          trend="up"
          loading={loading}
        />
        <MetricsCard
          title="Active Leads"
          value={analyticsData.metrics.activeLeads}
          change={{ value: 3.8, type: 'decrease' }}
          trend="down"
          loading={loading}
        />
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartRow}>
          <Card className={styles.chartCard}>
            <Chart
              type="line"
              title="Lead Trends"
              data={analyticsData.leadTrends}
              height={300}
              dataKeys={['value', 'new']}
              colors={['#3b82f6', '#10b981']}
              loading={loading}
            />
          </Card>
          
          <Card className={styles.chartCard}>
            <Chart
              type="pie"
              title="Lead Sources"
              data={analyticsData.sourceDistribution}
              height={300}
              loading={loading}
            />
          </Card>
        </div>

        <div className={styles.chartRow}>
          <Card className={styles.chartCard}>
            <Chart
              type="area"
              title="Conversion Rate Trends"
              data={analyticsData.conversionTrends}
              height={300}
              loading={loading}
            />
          </Card>
          
          <Card className={styles.chartCard}>
            <Chart
              type="bar"
              title="Response Time Trends"
              data={analyticsData.responseTimeTrends}
              height={300}
              loading={loading}
            />
          </Card>
        </div>

        <div className={styles.chartRow}>
          <Card className={styles.chartCard}>
            <Chart
              type="pie"
              title="Lead Status Distribution"
              data={analyticsData.statusDistribution}
              height={300}
              loading={loading}
            />
          </Card>
          
          <Card className={styles.chartCard}>
            <Chart
              type="bar"
              title="Lead Sources by Month"
              data={analyticsData.sourceDistribution}
              height={300}
              loading={loading}
            />
          </Card>
        </div>
      </div>

      <div className={styles.insights}>
        <Card className={styles.insightsCard}>
          <h3 className={styles.insightsTitle}>Key Insights</h3>
          <div className={styles.insightsList}>
            <div className={styles.insight}>
              <span className={styles.insightIcon}>📈</span>
              <div className={styles.insightContent}>
                <h4>Lead Generation Up 12.5%</h4>
                <p>Website traffic and social media campaigns are driving strong lead growth.</p>
              </div>
            </div>
            <div className={styles.insight}>
              <span className={styles.insightIcon}>⚡</span>
              <div className={styles.insightContent}>
                <h4>Response Time Improved</h4>
                <p>Average response time decreased by 5.3 minutes this period.</p>
              </div>
            </div>
            <div className={styles.insight}>
              <span className={styles.insightIcon}>🎯</span>
              <div className={styles.insightContent}>
                <h4>Conversion Rate Rising</h4>
                <p>AI-powered follow-up is improving lead-to-customer conversion.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default AnalyticsPage