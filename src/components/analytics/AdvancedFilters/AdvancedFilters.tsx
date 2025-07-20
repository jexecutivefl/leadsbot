import React, { useState } from 'react'
import { Button } from '../../ui/Button'
import { Input } from '../../ui/Input'
import styles from './AdvancedFilters.module.css'

export interface FilterOptions {
  sources: string[]
  statuses: string[]
  customDateRange?: {
    start: Date
    end: Date
  }
  searchTerm?: string
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void
  availableSources: string[]
  availableStatuses: string[]
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  onFiltersChange,
  availableSources,
  availableStatuses
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedSources, setSelectedSources] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const handleSourceToggle = (source: string) => {
    const newSources = selectedSources.includes(source)
      ? selectedSources.filter(s => s !== source)
      : [...selectedSources, source]
    setSelectedSources(newSources)
    applyFilters(newSources, selectedStatuses, customStartDate, customEndDate, searchTerm)
  }

  const handleStatusToggle = (status: string) => {
    const newStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter(s => s !== status)
      : [...selectedStatuses, status]
    setSelectedStatuses(newStatuses)
    applyFilters(selectedSources, newStatuses, customStartDate, customEndDate, searchTerm)
  }

  const handleCustomDateChange = () => {
    applyFilters(selectedSources, selectedStatuses, customStartDate, customEndDate, searchTerm)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    applyFilters(selectedSources, selectedStatuses, customStartDate, customEndDate, value)
  }

  const applyFilters = (
    sources: string[],
    statuses: string[],
    startDate: string,
    endDate: string,
    search: string
  ) => {
    const filters: FilterOptions = {
      sources,
      statuses,
      searchTerm: search || undefined
    }

    if (startDate && endDate) {
      filters.customDateRange = {
        start: new Date(startDate),
        end: new Date(endDate)
      }
    }

    onFiltersChange(filters)
  }

  const clearFilters = () => {
    setSelectedSources([])
    setSelectedStatuses([])
    setCustomStartDate('')
    setCustomEndDate('')
    setSearchTerm('')
    onFiltersChange({
      sources: [],
      statuses: [],
      searchTerm: undefined
    })
  }

  return (
    <div className={styles.container}>
      <Button
        variant="outline"
        size="small"
        onClick={() => setIsExpanded(!isExpanded)}
        className={styles.toggleButton}
      >
        {isExpanded ? 'Hide' : 'Show'} Advanced Filters
      </Button>

      {isExpanded && (
        <div className={styles.filtersPanel}>
          <div className={styles.filterSection}>
            <h4 className={styles.sectionTitle}>Search</h4>
            <Input
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterSection}>
            <h4 className={styles.sectionTitle}>Lead Sources</h4>
            <div className={styles.filterOptions}>
              {availableSources.map(source => (
                <label key={source} className={styles.filterOption}>
                  <input
                    type="checkbox"
                    checked={selectedSources.includes(source)}
                    onChange={() => handleSourceToggle(source)}
                  />
                  <span>{source}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.filterSection}>
            <h4 className={styles.sectionTitle}>Lead Status</h4>
            <div className={styles.filterOptions}>
              {availableStatuses.map(status => (
                <label key={status} className={styles.filterOption}>
                  <input
                    type="checkbox"
                    checked={selectedStatuses.includes(status)}
                    onChange={() => handleStatusToggle(status)}
                  />
                  <span>{status}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.filterSection}>
            <h4 className={styles.sectionTitle}>Custom Date Range</h4>
            <div className={styles.dateInputs}>
              <Input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                placeholder="Start Date"
                className={styles.dateInput}
              />
              <Input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                placeholder="End Date"
                className={styles.dateInput}
              />
              <Button
                variant="outline"
                size="small"
                onClick={handleCustomDateChange}
                disabled={!customStartDate || !customEndDate}
              >
                Apply
              </Button>
            </div>
          </div>

          <div className={styles.filterActions}>
            <Button
              variant="outline"
              size="small"
              onClick={clearFilters}
            >
              Clear All Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 