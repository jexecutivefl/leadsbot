import { describe, it, expect, beforeEach } from 'vitest'
import { analyticsService, DateRange } from '../../services/analyticsService'
import { Lead } from '../../types'

// Mock lead data
const mockLeads: Lead[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '555-0123',
    source: 'website',
    status: 'new',
    createdAt: '2024-12-15T10:00:00Z',
    updatedAt: '2024-12-15T10:00:00Z',
    notes: 'Interested in 3-bedroom house',
    communications: []
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    phone: '555-0124',
    source: 'socialMedia',
    status: 'contacted',
    createdAt: '2024-12-16T10:00:00Z',
    updatedAt: '2024-12-16T10:00:00Z',
    notes: 'Looking for downtown condo',
    communications: []
  },
  {
    id: '3',
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob@example.com',
    phone: '555-0125',
    source: 'referral',
    status: 'qualified',
    createdAt: '2024-12-17T10:00:00Z',
    updatedAt: '2024-12-17T10:00:00Z',
    notes: 'Ready to buy, budget $500k',
    communications: []
  },
  {
    id: '4',
    firstName: 'Alice',
    lastName: 'Brown',
    email: 'alice@example.com',
    phone: '555-0126',
    source: 'website',
    status: 'contacted',
    createdAt: '2024-12-18T10:00:00Z',
    updatedAt: '2024-12-18T10:00:00Z',
    notes: 'Scheduled viewing next week',
    communications: []
  }
]

describe('AnalyticsService', () => {
  beforeEach(() => {
    // Reset service state before each test
    analyticsService.setLeads([])
  })



  describe('setLeads', () => {
    it('should set leads data and clear cache', () => {
      analyticsService.setLeads(mockLeads)
      expect(analyticsService['leads']).toEqual(mockLeads)
    })
  })

  describe('getAnalyticsData', () => {
    it('should return analytics data for date range', async () => {
      analyticsService.setLeads(mockLeads)
      
      const dateRange: DateRange = {
        start: new Date('2024-12-15'),
        end: new Date('2024-12-18T23:59:59.999Z')
      }

      const result = await analyticsService.getAnalyticsData(dateRange)

      expect(result).toHaveProperty('metrics')
      expect(result).toHaveProperty('leadTrends')
      expect(result).toHaveProperty('sourceDistribution')
      expect(result).toHaveProperty('conversionTrends')
      expect(result).toHaveProperty('responseTimeTrends')
      expect(result).toHaveProperty('statusDistribution')
    })

    it('should cache results for same date range', async () => {
      analyticsService.setLeads(mockLeads)
      
      const dateRange: DateRange = {
        start: new Date('2024-12-15'),
        end: new Date('2024-12-18T23:59:59.999Z')
      }

      const firstCall = await analyticsService.getAnalyticsData(dateRange)
      const secondCall = await analyticsService.getAnalyticsData(dateRange)

      expect(firstCall).toEqual(secondCall)
    })
  })

  describe('calculateMetrics', () => {
    it('should calculate correct metrics', async () => {
      analyticsService.setLeads(mockLeads)
      
      const dateRange: DateRange = {
        start: new Date('2024-12-15'),
        end: new Date('2024-12-18T23:59:59.999Z')
      }

      const result = await analyticsService.getAnalyticsData(dateRange)

      expect(result.metrics.totalLeads).toBe(4)
      expect(result.metrics.newLeads).toBe(4) // All leads in date range
      expect(result.metrics.qualifiedLeads).toBe(1) // Only Bob Johnson
      expect(result.metrics.activeLeads).toBe(3) // new, contacted, follow-up
    })

    it('should handle empty leads array', async () => {
      const dateRange: DateRange = {
        start: new Date('2024-12-15'),
        end: new Date('2024-12-18T23:59:59.999Z')
      }

      const result = await analyticsService.getAnalyticsData(dateRange)

      expect(result.metrics.totalLeads).toBe(0)
      expect(result.metrics.newLeads).toBe(0)
      expect(result.metrics.conversionRate).toBe(0)
      expect(result.metrics.responseTime).toBe(0)
    })
  })

  describe('calculateSourceDistribution', () => {
    it('should calculate correct source distribution', async () => {
      analyticsService.setLeads(mockLeads)
      
      const dateRange: DateRange = {
        start: new Date('2024-12-15'),
        end: new Date('2024-12-18T23:59:59.999Z')
      }

      const result = await analyticsService.getAnalyticsData(dateRange)

      const sourceDistribution = result.sourceDistribution
      expect(sourceDistribution).toHaveLength(3) // Website, Social Media, Referrals
      
      const websiteCount = sourceDistribution.find(s => s.name === 'Website')?.value
      expect(websiteCount).toBe(2)
      
      const socialMediaCount = sourceDistribution.find(s => s.name === 'Social Media')?.value
      expect(socialMediaCount).toBe(1)
    })
  })

  describe('calculateStatusDistribution', () => {
    it('should calculate correct status distribution', async () => {
      analyticsService.setLeads(mockLeads)
      
      const dateRange: DateRange = {
        start: new Date('2024-12-15'),
        end: new Date('2024-12-18T23:59:59.999Z')
      }

      const result = await analyticsService.getAnalyticsData(dateRange)

      const statusDistribution = result.statusDistribution
      expect(statusDistribution).toHaveLength(4) // new, contacted, qualified, follow-up
      
      const newCount = statusDistribution.find(s => s.name === 'New')?.value
      expect(newCount).toBe(1)
      
      const qualifiedCount = statusDistribution.find(s => s.name === 'Qualified')?.value
      expect(qualifiedCount).toBe(1)
    })
  })

  describe('calculateChange', () => {
    it('should calculate positive change correctly', () => {
      const change = analyticsService.calculateChange(120, 100)
      expect(change).toBe(20)
    })

    it('should calculate negative change correctly', () => {
      const change = analyticsService.calculateChange(80, 100)
      expect(change).toBe(-20)
    })

    it('should handle zero previous value', () => {
      const change = analyticsService.calculateChange(50, 0)
      expect(change).toBe(100)
    })

    it('should handle zero current value', () => {
      const change = analyticsService.calculateChange(0, 100)
      expect(change).toBe(-100)
    })
  })

  describe('getChangeType', () => {
    it('should return increase for positive change', () => {
      const type = analyticsService.getChangeType(10)
      expect(type).toBe('increase')
    })

    it('should return decrease for negative change', () => {
      const type = analyticsService.getChangeType(-10)
      expect(type).toBe('decrease')
    })

    it('should return neutral for zero change', () => {
      const type = analyticsService.getChangeType(0)
      expect(type).toBe('neutral')
    })
  })

  describe('exportAnalyticsData', () => {
    it('should export data as JSON string', async () => {
      analyticsService.setLeads(mockLeads)
      
      const dateRange: DateRange = {
        start: new Date('2024-12-15'),
        end: new Date('2024-12-18T23:59:59.999Z')
      }

      const exportData = await analyticsService.exportAnalyticsData(dateRange)
      const parsed = JSON.parse(exportData)

      expect(parsed).toHaveProperty('metrics')
      expect(parsed).toHaveProperty('leadTrends')
      expect(typeof exportData).toBe('string')
    })
  })
}) 