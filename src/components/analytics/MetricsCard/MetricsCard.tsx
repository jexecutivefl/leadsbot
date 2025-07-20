import React from 'react'

import styles from './MetricsCard.module.css'

export interface MetricsCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease' | 'neutral'
  }
  period?: string
  icon?: React.ReactNode
  trend?: 'up' | 'down' | 'stable'
  loading?: boolean
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  change,
  period = 'vs last period',
  icon,
  trend,
  loading = false
}) => {
  const getChangeColor = () => {
    if (!change) return styles.neutral
    switch (change.type) {
      case 'increase':
        return styles.positive
      case 'decrease':
        return styles.negative
      default:
        return styles.neutral
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return '↗'
      case 'down':
        return '↘'
      default:
        return '→'
    }
  }

  if (loading) {
    return (
      <div className={styles.card}>
        <div className={styles.skeleton}>
          <div className={styles.skeletonTitle}></div>
          <div className={styles.skeletonValue}></div>
          <div className={styles.skeletonChange}></div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {icon && <div className={styles.icon}>{icon}</div>}
      </div>
      
      <div className={styles.value}>{value}</div>
      
      {change && (
        <div className={styles.changeContainer}>
          <span className={`${styles.change} ${getChangeColor()}`}>
            {getTrendIcon()} {Math.abs(change.value)}%
          </span>
          <span className={styles.period}>{period}</span>
        </div>
      )}
    </div>
  )
} 