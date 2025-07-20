import React from 'react'
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ChartData } from './Chart'
import styles from './Chart.module.css'

interface BarChartProps {
  data: ChartData[]
  title?: string
  height?: number
  color?: string
  showGrid?: boolean
  showTooltip?: boolean
  xAxisLabel?: string
  yAxisLabel?: string
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  height = 300,
  color = '#3b82f6',
  showGrid = true,
  showTooltip = true,
  xAxisLabel,
  yAxisLabel
}) => {
  return (
    <div className={styles.chartContainer}>
      {title && <h3 className={styles.chartTitle}>{title}</h3>}
      <div className={styles.chartWrapper} style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
            <XAxis 
              dataKey="name" 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            {showTooltip && (
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#f9fafb',
                  fontSize: '12px'
                }}
                cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
              />
            )}
            <Bar 
              dataKey="value" 
              fill={color}
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
      {(xAxisLabel || yAxisLabel) && (
        <div className={styles.chartLabels}>
          {xAxisLabel && <span className={styles.xAxisLabel}>{xAxisLabel}</span>}
          {yAxisLabel && <span className={styles.yAxisLabel}>{yAxisLabel}</span>}
        </div>
      )}
    </div>
  )
}

export default BarChart 