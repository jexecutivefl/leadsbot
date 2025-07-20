import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MetricsCard } from '../../components/analytics/MetricsCard'

describe('MetricsCard', () => {
  it('renders with basic props', () => {
    render(
      <MetricsCard
        title="Test Metric"
        value="123"
      />
    )
    
    expect(screen.getByText('Test Metric')).toBeInTheDocument()
    expect(screen.getByText('123')).toBeInTheDocument()
  })

  it('renders with change indicator', () => {
    render(
      <MetricsCard
        title="Test Metric"
        value="123"
        change={{ value: 15, type: 'increase' }}
        trend="up"
      />
    )
    
    expect(screen.getByText('↗ 15%')).toBeInTheDocument()
  })

  it('renders with icon', () => {
    render(
      <MetricsCard
        title="Test Metric"
        value="123"
        icon={<span data-testid="test-icon">📊</span>}
      />
    )
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
  })

  it('shows loading skeleton when loading is true', () => {
    render(
      <MetricsCard
        title="Test Metric"
        value="123"
        loading={true}
      />
    )
    
    // Should not show actual content when loading
    expect(screen.queryByText('Test Metric')).not.toBeInTheDocument()
    expect(screen.queryByText('123')).not.toBeInTheDocument()
  })

  it('applies correct CSS classes for different change types', () => {
    const { rerender } = render(
      <MetricsCard
        title="Test"
        value="123"
        change={{ value: 10, type: 'increase' }}
        trend="up"
      />
    )
    
    const changeElement = screen.getByText('↗ 10%')
    expect(changeElement.className).toContain('positive')
    
    rerender(
      <MetricsCard
        title="Test"
        value="123"
        change={{ value: 10, type: 'decrease' }}
        trend="down"
      />
    )
    
    const decreaseElement = screen.getByText('↘ 10%')
    expect(decreaseElement.className).toContain('negative')
  })

  it('renders custom period text', () => {
    render(
      <MetricsCard
        title="Test Metric"
        value="123"
        change={{ value: 15, type: 'increase' }}
        period="vs last month"
      />
    )
    
    expect(screen.getByText('vs last month')).toBeInTheDocument()
  })
}) 