import { ChartData } from '../components/analytics/Chart'
import { Lead, AmplifyLead, adaptAmplifyLeadToLead } from '../types'
import { FilterOptions } from '../components/analytics/AdvancedFilters'

export interface AnalyticsMetrics {
  totalLeads: number
  newLeads: number
  conversionRate: number
  responseTime: number
  qualifiedLeads: number
  activeLeads: number
}

export interface AnalyticsData {
  metrics: AnalyticsMetrics
  leadTrends: ChartData[]
  sourceDistribution: ChartData[]
  conversionTrends: ChartData[]
  responseTimeTrends: ChartData[]
  statusDistribution: ChartData[]
}

export interface DateRange {
  start: Date
  end: Date
}

class AnalyticsService {
  private leads: Lead[] = []
  private cache: Map<string, AnalyticsData> = new Map()

  // Set leads data (called from lead service) - now accepts both types
  setLeads(leads: Lead[] | AmplifyLead[]) {
    // Convert AmplifyLead[] to Lead[] if needed
    this.leads = leads.map(lead => {
      if ('documents' in lead && typeof lead.documents === 'function') {
        // This is an AmplifyLead, convert it
        return adaptAmplifyLeadToLead(lead as AmplifyLead)
      }
      return lead as Lead
    })
    this.clearCache()
  }

  // Clear cache when data changes
  private clearCache() {
    this.cache.clear()
  }

  // Get analytics data for a specific date range
  async getAnalyticsData(dateRange: DateRange, filters?: FilterOptions): Promise<AnalyticsData> {
    const cacheKey = `${dateRange.start.toISOString()}-${dateRange.end.toISOString()}-${JSON.stringify(filters)}`
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!
    }

    const filteredLeads = this.filterLeadsByDateRange(dateRange, filters)


    const analyticsData: AnalyticsData = {
      metrics: this.calculateMetrics(filteredLeads),
      leadTrends: this.calculateLeadTrends(dateRange),
      sourceDistribution: this.calculateSourceDistribution(filteredLeads),
      conversionTrends: this.calculateConversionTrends(dateRange),
      responseTimeTrends: this.calculateResponseTimeTrends(dateRange),
      statusDistribution: this.calculateStatusDistribution(filteredLeads)
    }

    this.cache.set(cacheKey, analyticsData)
    return analyticsData
  }

  // Filter leads by date range and additional filters
  private filterLeadsByDateRange(dateRange: DateRange, filters?: FilterOptions): Lead[] {
    return this.leads.filter(lead => {
      const leadDate = new Date(lead.createdAt)
      // Normalize dates to start of day for comparison
      const leadDateStart = new Date(leadDate.getFullYear(), leadDate.getMonth(), leadDate.getDate())
      const rangeStart = new Date(dateRange.start.getFullYear(), dateRange.start.getMonth(), dateRange.start.getDate())
      const rangeEnd = new Date(dateRange.end.getFullYear(), dateRange.end.getMonth(), dateRange.end.getDate())
      
      // Date range filter
      const dateInRange = leadDateStart >= rangeStart && leadDateStart <= rangeEnd
      if (!dateInRange) return false

      // Source filter
      if (filters?.sources && filters.sources.length > 0) {
        if (!filters.sources.includes(lead.source || 'other')) return false
      }

      // Status filter
      if (filters?.statuses && filters.statuses.length > 0) {
        if (!filters.statuses.includes(lead.status || 'new')) return false
      }

      // Search term filter
      if (filters?.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase()
        const matchesSearch = 
          lead.firstName?.toLowerCase().includes(searchLower) ||
          lead.lastName?.toLowerCase().includes(searchLower) ||
          lead.email?.toLowerCase().includes(searchLower) ||
          lead.phone?.toLowerCase().includes(searchLower)
        
        if (!matchesSearch) return false
      }

      // Custom date range filter (if provided, override the main date range)
      if (filters?.customDateRange) {
        const customStart = new Date(filters.customDateRange.start.getFullYear(), filters.customDateRange.start.getMonth(), filters.customDateRange.start.getDate())
        const customEnd = new Date(filters.customDateRange.end.getFullYear(), filters.customDateRange.end.getMonth(), filters.customDateRange.end.getDate())
        
        if (leadDateStart < customStart || leadDateStart > customEnd) return false
      }

      return true
    })
  }



  // Calculate key metrics
  private calculateMetrics(currentLeads: Lead[]): AnalyticsMetrics {
    const totalLeads = currentLeads.length
    const newLeads = currentLeads.length
    const qualifiedLeads = currentLeads.filter(lead => lead.status === 'qualified').length
    const activeLeads = currentLeads.filter(lead => 
      ['new', 'contacted', 'follow-up'].includes(lead.status || 'new')
    ).length

    // Calculate conversion rate (qualified leads / total leads)
    const conversionRate = totalLeads > 0 ? (qualifiedLeads / totalLeads) * 100 : 0

    // Calculate average response time (mock calculation)
    const responseTime = this.calculateAverageResponseTime(currentLeads)

    return {
      totalLeads,
      newLeads,
      conversionRate: Math.round(conversionRate * 10) / 10,
      responseTime: Math.round(responseTime),
      qualifiedLeads,
      activeLeads
    }
  }

  // Calculate average response time (mock implementation)
  private calculateAverageResponseTime(leads: Lead[]): number {
    // Mock calculation - in real implementation, this would use actual response times
    return leads.length > 0 ? Math.random() * 120 + 30 : 0
  }

  // Calculate lead trends over time
  private calculateLeadTrends(dateRange: DateRange): ChartData[] {
    const trends: ChartData[] = []
    const current = new Date(dateRange.start)
    
    while (current <= dateRange.end) {
      const dayStart = new Date(current)
      const dayEnd = new Date(current)
      dayEnd.setHours(23, 59, 59, 999)

      const dayLeads = this.filterLeadsByDateRange({ start: dayStart, end: dayEnd })
      const newLeads = dayLeads.filter(lead => {
        const leadDate = new Date(lead.createdAt)
        return leadDate >= dayStart && leadDate <= dayEnd
      }).length

      trends.push({
        name: current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: dayLeads.length,
        new: newLeads
      })

      current.setDate(current.getDate() + 1)
    }

    return trends
  }

  // Calculate lead source distribution
  private calculateSourceDistribution(leads: Lead[]): ChartData[] {
    const sourceCount: { [key: string]: number } = {}
    
    leads.forEach(lead => {
      const source = lead.source || 'Unknown'
      sourceCount[source] = (sourceCount[source] || 0) + 1
    })

    return Object.entries(sourceCount).map(([source, count]) => ({
      name: this.formatSourceName(source),
      value: count
    }))
  }

  // Format source name for display
  private formatSourceName(source: string): string {
    const sourceMap: { [key: string]: string } = {
      'website': 'Website',
      'socialMedia': 'Social Media',
      'referral': 'Referral',
      'email': 'Email',
      'phone': 'Phone',
      'other': 'Other'
    }
    return sourceMap[source] || source.charAt(0).toUpperCase() + source.slice(1)
  }

  // Calculate conversion rate trends
  private calculateConversionTrends(dateRange: DateRange): ChartData[] {
    const trends: ChartData[] = []
    const current = new Date(dateRange.start)
    
    while (current <= dateRange.end) {
      const dayStart = new Date(current)
      const dayEnd = new Date(current)
      dayEnd.setHours(23, 59, 59, 999)

      const dayLeads = this.filterLeadsByDateRange({ start: dayStart, end: dayEnd })
      const qualifiedLeads = dayLeads.filter(lead => lead.status === 'qualified').length
      const conversionRate = dayLeads.length > 0 ? (qualifiedLeads / dayLeads.length) * 100 : 0

      trends.push({
        name: current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: Math.round(conversionRate * 10) / 10
      })

      current.setDate(current.getDate() + 1)
    }

    return trends
  }

  // Calculate response time trends
  private calculateResponseTimeTrends(dateRange: DateRange): ChartData[] {
    const trends: ChartData[] = []
    const current = new Date(dateRange.start)
    
    while (current <= dateRange.end) {
      const dayStart = new Date(current)
      const dayEnd = new Date(current)
      dayEnd.setHours(23, 59, 59, 999)

      const dayLeads = this.filterLeadsByDateRange({ start: dayStart, end: dayEnd })
      const avgResponseTime = this.calculateAverageResponseTime(dayLeads)

      trends.push({
        name: current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: Math.round(avgResponseTime)
      })

      current.setDate(current.getDate() + 1)
    }

    return trends
  }

  // Calculate lead status distribution
  private calculateStatusDistribution(leads: Lead[]): ChartData[] {
    const statusCount: { [key: string]: number } = {}
    
    // Initialize all possible statuses with 0
    const allStatuses = ['new', 'contacted', 'qualified', 'follow-up']
    allStatuses.forEach(status => {
      statusCount[status] = 0
    })
    
    // Count actual statuses
    leads.forEach(lead => {
      const status = lead.status || 'new'
      statusCount[status] = (statusCount[status] || 0) + 1
    })

    return Object.entries(statusCount).map(([status, count]) => ({
      name: this.formatStatusName(status),
      value: count
    }))
  }

  // Format status name for display
  private formatStatusName(status: string): string {
    const statusMap: { [key: string]: string } = {
      'new': 'New',
      'contacted': 'Contacted',
      'qualified': 'Qualified',
      'follow-up': 'Follow-up'
    }
    return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1)
  }

  // Get change percentage for metrics
  calculateChange(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0
    return Math.round(((current - previous) / previous) * 100 * 10) / 10
  }

  // Get change type (increase, decrease, neutral)
  getChangeType(change: number): 'increase' | 'decrease' | 'neutral' {
    if (change > 0) return 'increase'
    if (change < 0) return 'decrease'
    return 'neutral'
  }

  // Export analytics data in different formats
  async exportAnalyticsData(dateRange: DateRange, format: 'json' | 'csv' | 'pdf' = 'json', filters?: FilterOptions): Promise<string> {
    const data = await this.getAnalyticsData(dateRange, filters)
    
    switch (format) {
      case 'csv':
        return this.convertToCSV(data)
      case 'pdf':
        return this.convertToPDF(data)
      default:
        return JSON.stringify(data, null, 2)
    }
  }

  // Convert analytics data to CSV format
  private convertToCSV(data: AnalyticsData): string {
    const csvRows: string[] = []
    
    // Add metrics
    csvRows.push('Metric,Value')
    csvRows.push(`Total Leads,${data.metrics.totalLeads}`)
    csvRows.push(`New Leads,${data.metrics.newLeads}`)
    csvRows.push(`Conversion Rate,${data.metrics.conversionRate}%`)
    csvRows.push(`Response Time,${data.metrics.responseTime}m`)
    csvRows.push(`Qualified Leads,${data.metrics.qualifiedLeads}`)
    csvRows.push(`Active Leads,${data.metrics.activeLeads}`)
    csvRows.push('')
    
    // Add lead trends
    csvRows.push('Lead Trends')
    csvRows.push('Date,Total Leads,New Leads')
    data.leadTrends.forEach(trend => {
      csvRows.push(`${trend.name},${trend.value},${trend.new || 0}`)
    })
    csvRows.push('')
    
    // Add source distribution
    csvRows.push('Lead Sources')
    csvRows.push('Source,Count')
    data.sourceDistribution.forEach(source => {
      csvRows.push(`${source.name},${source.value}`)
    })
    csvRows.push('')
    
    // Add conversion trends
    csvRows.push('Conversion Rate Trends')
    csvRows.push('Date,Conversion Rate (%)')
    data.conversionTrends.forEach(trend => {
      csvRows.push(`${trend.name},${trend.value}`)
    })
    
    return csvRows.join('\n')
  }

  // Convert analytics data to PDF format (simplified HTML-like structure)
  private convertToPDF(data: AnalyticsData): string {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Analytics Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .header { text-align: center; margin-bottom: 30px; }
    .section { margin-bottom: 20px; }
    .metric { display: inline-block; margin: 10px; padding: 10px; border: 1px solid #ccc; }
    table { width: 100%; border-collapse: collapse; margin: 10px 0; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Analytics Dashboard Report</h1>
    <p>Generated on ${new Date().toLocaleDateString()}</p>
  </div>
  
  <div class="section">
    <h2>Key Metrics</h2>
    <div class="metric">Total Leads: ${data.metrics.totalLeads}</div>
    <div class="metric">New Leads: ${data.metrics.newLeads}</div>
    <div class="metric">Conversion Rate: ${data.metrics.conversionRate}%</div>
    <div class="metric">Response Time: ${data.metrics.responseTime}m</div>
    <div class="metric">Qualified Leads: ${data.metrics.qualifiedLeads}</div>
    <div class="metric">Active Leads: ${data.metrics.activeLeads}</div>
  </div>
  
  <div class="section">
    <h2>Lead Sources</h2>
    <table>
      <tr><th>Source</th><th>Count</th></tr>
      ${data.sourceDistribution.map(source => 
        `<tr><td>${source.name}</td><td>${source.value}</td></tr>`
      ).join('')}
    </table>
  </div>
  
  <div class="section">
    <h2>Lead Status Distribution</h2>
    <table>
      <tr><th>Status</th><th>Count</th></tr>
      ${data.statusDistribution.map(status => 
        `<tr><td>${status.name}</td><td>${status.value}</td></tr>`
      ).join('')}
    </table>
  </div>
</body>
</html>
    `
    return html
  }
}

export const analyticsService = new AnalyticsService() 