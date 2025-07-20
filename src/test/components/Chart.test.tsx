import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Chart } from '../../components/analytics/Chart'

const mockData = [
  { name: 'Jan', value: 100 },
  { name: 'Feb', value: 200 },
  { name: 'Mar', value: 150 }
]

describe('Chart', () => {
  it('renders line chart with title', () => {
    render(
      <Chart
        type="line"
        title="Test Chart"
        data={mockData}
      />
    )
    
    expect(screen.getByText('Test Chart')).toBeInTheDocument()
  })

  it('renders bar chart', () => {
    render(
      <Chart
        type="bar"
        data={mockData}
      />
    )
    
    // Chart should render without errors
    expect(document.querySelector('.recharts-responsive-container')).toBeInTheDocument()
  })

  it('renders pie chart', () => {
    render(
      <Chart
        type="pie"
        data={mockData}
      />
    )
    
    expect(document.querySelector('.recharts-responsive-container')).toBeInTheDocument()
  })

  it('renders area chart', () => {
    render(
      <Chart
        type="area"
        data={mockData}
      />
    )
    
    expect(document.querySelector('.recharts-responsive-container')).toBeInTheDocument()
  })

  it('shows loading skeleton when loading is true', () => {
    render(
      <Chart
        type="line"
        title="Test Chart"
        data={mockData}
        loading={true}
      />
    )
    
    // Should not show chart when loading
    expect(document.querySelector('.recharts-responsive-container')).not.toBeInTheDocument()
  })

  it('renders with custom height', () => {
    render(
      <Chart
        type="line"
        data={mockData}
        height={400}
      />
    )
    
    const chartContainer = document.querySelector('.recharts-responsive-container')
    expect(chartContainer).toHaveStyle({ height: '400px' })
  })

  it('renders with multiple data keys', () => {
    const multiData = [
      { name: 'Jan', value: 100, other: 50 },
      { name: 'Feb', value: 200, other: 75 },
      { name: 'Mar', value: 150, other: 60 }
    ]
    
    render(
      <Chart
        type="line"
        data={multiData}
        dataKeys={['value', 'other']}
      />
    )
    
    // Should render chart container
    expect(document.querySelector('.recharts-responsive-container')).toBeInTheDocument()
  })

  it('renders without grid when showGrid is false', () => {
    render(
      <Chart
        type="line"
        data={mockData}
        showGrid={false}
      />
    )
    
    // Chart should still render
    expect(document.querySelector('.recharts-responsive-container')).toBeInTheDocument()
  })

  it('renders without legend when showLegend is false', () => {
    render(
      <Chart
        type="line"
        data={mockData}
        showLegend={false}
      />
    )
    
    // Chart should still render
    expect(document.querySelector('.recharts-responsive-container')).toBeInTheDocument()
  })
}) 