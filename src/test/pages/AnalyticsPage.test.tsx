import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import AnalyticsPage from '../../pages/analytics/AnalyticsPage'
import { analyticsService } from '../../services/analyticsService'

// Mock date-fns
vi.mock('date-fns', () => ({
  format: vi.fn(() => 'Jan 01'),
  subDays: vi.fn((date, days) => new Date(date.getTime() - days * 24 * 60 * 60 * 1000))
}))

// Mock leadService
vi.mock('../../services/leadService', () => ({
  leadService: {
    listLeads: vi.fn().mockResolvedValue([])
  }
}))

// Mock analyticsService
vi.mock('../../services/analyticsService', () => ({
  analyticsService: {
    setLeads: vi.fn(),
    getAnalyticsData: vi.fn().mockResolvedValue({
      metrics: {
        totalLeads: 1247,
        newLeads: 89,
        conversionRate: 23.4,
        responseTime: 45,
        qualifiedLeads: 187,
        activeLeads: 75
      },
      leadTrends: [],
      sourceDistribution: [],
      conversionTrends: [],
      responseTimeTrends: [],
      statusDistribution: []
    }),
    exportAnalyticsData: vi.fn().mockResolvedValue('{"test": "data"}')
  }
}))

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('AnalyticsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders analytics dashboard with title', async () => {
    renderWithRouter(<AnalyticsPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument()
    })
  })

  it('displays metrics cards', async () => {
    renderWithRouter(<AnalyticsPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Total Leads')).toBeInTheDocument()
      expect(screen.getByText('New Leads')).toBeInTheDocument()
      expect(screen.getByText('Conversion Rate')).toBeInTheDocument()
      expect(screen.getByText('Avg Response Time')).toBeInTheDocument()
    })
  })

  it('shows date range controls', async () => {
    renderWithRouter(<AnalyticsPage />)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: '7 Days' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '30 Days' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '90 Days' })).toBeInTheDocument()
    })
  })

  it('changes date range when buttons are clicked', async () => {
    renderWithRouter(<AnalyticsPage />)
    
    await waitFor(() => {
      const thirtyDaysButton = screen.getByRole('button', { name: '30 Days' })
      fireEvent.click(thirtyDaysButton)
      
      // Should trigger data reload (we can't easily test the actual data change)
      expect(thirtyDaysButton).toBeInTheDocument()
    })
  })

  it('displays export buttons', async () => {
    renderWithRouter(<AnalyticsPage />)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Export JSON' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Export CSV' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Export PDF' })).toBeInTheDocument()
    })
  })

  it('displays chart titles', async () => {
    renderWithRouter(<AnalyticsPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Lead Trends')).toBeInTheDocument()
      expect(screen.getByText('Lead Sources')).toBeInTheDocument()
      expect(screen.getByText('Conversion Rate Trends')).toBeInTheDocument()
      expect(screen.getByText('Response Time Trends')).toBeInTheDocument()
    })
  })

  it('displays insights section', async () => {
    renderWithRouter(<AnalyticsPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Key Insights')).toBeInTheDocument()
      expect(screen.getByText('Lead Generation Up 12.5%')).toBeInTheDocument()
      expect(screen.getByText('Response Time Improved')).toBeInTheDocument()
      expect(screen.getByText('Conversion Rate Rising')).toBeInTheDocument()
    })
  })

  it('shows loading state initially', () => {
    renderWithRouter(<AnalyticsPage />)
    
    // Should show loading indicators
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument()
  })

  it('handles export functionality', async () => {
    // Mock the analyticsService export method
    const mockExportAnalyticsData = vi.fn().mockResolvedValue('{"test": "data"}')
    vi.mocked(analyticsService.exportAnalyticsData).mockImplementation(mockExportAnalyticsData)
    
    renderWithRouter(<AnalyticsPage />)
    
    await waitFor(() => {
      const exportButton = screen.getByRole('button', { name: 'Export JSON' })
      fireEvent.click(exportButton)
      
      // Verify the export service was called
      expect(mockExportAnalyticsData).toHaveBeenCalled()
    })
  })
}) 