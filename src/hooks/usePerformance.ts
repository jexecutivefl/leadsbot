import { useEffect, useRef } from 'react'

interface PerformanceMetrics {
  pageLoadTime: number
  timeToInteractive: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  cumulativeLayoutShift: number
}

export const usePerformance = (pageName: string) => {
  const startTime = useRef(performance.now())
  const metrics = useRef<PerformanceMetrics>({
    pageLoadTime: 0,
    timeToInteractive: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    cumulativeLayoutShift: 0,
  })

  useEffect(() => {
    const measurePerformance = () => {
      // Page load time
      const pageLoadTime = performance.now() - startTime.current
      metrics.current.pageLoadTime = pageLoadTime

      // Web Vitals
      if ('PerformanceObserver' in window) {
        // First Contentful Paint
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const fcp = entries.find(entry => entry.name === 'first-contentful-paint')
          if (fcp) {
            metrics.current.firstContentfulPaint = fcp.startTime
          }
        })
        fcpObserver.observe({ entryTypes: ['paint'] })

        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lcp = entries[entries.length - 1]
          if (lcp) {
            metrics.current.largestContentfulPaint = lcp.startTime
          }
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

        // Cumulative Layout Shift
        const clsObserver = new PerformanceObserver((list) => {
          let cls = 0
          for (const entry of list.getEntries()) {
            const layoutShiftEntry = entry as any
            if (!layoutShiftEntry.hadRecentInput) {
              cls += layoutShiftEntry.value
            }
          }
          metrics.current.cumulativeLayoutShift = cls
        })
        clsObserver.observe({ entryTypes: ['layout-shift'] })
      }

      // Time to Interactive (simplified)
      const tti = performance.now() - startTime.current
      metrics.current.timeToInteractive = tti

      // Log metrics in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Performance metrics for ${pageName}:`, metrics.current)
      }

      // Send to analytics in production
      if (process.env.NODE_ENV === 'production') {
        // TODO: Send to analytics service
        console.log('Production performance metrics:', {
          page: pageName,
          ...metrics.current,
        })
      }
    }

    // Measure after component mounts
    const timer = setTimeout(measurePerformance, 100)

    return () => {
      clearTimeout(timer)
    }
  }, [pageName])

  return metrics.current
}

export default usePerformance 