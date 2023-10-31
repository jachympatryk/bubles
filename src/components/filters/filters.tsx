import React from 'react'
import { Button, Slider } from 'antd'
import styles from './filters.module.scss'
import { FiltersProps } from './filters.types'

export const Filters: React.FC<FiltersProps> = ({
  maxGMV,
  handleGmvFilterChange,
  gmvFilter,
  setGmvFilter,
}) => {
  return (
    <div className={styles.container}>
      <Slider
        min={0}
        max={maxGMV}
        onChange={handleGmvFilterChange}
        value={gmvFilter}
      />
      <Button onClick={() => setGmvFilter(0)}>Resetuj Filtr GMV</Button>
    </div>
  )
}
