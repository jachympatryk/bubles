import React from 'react'

export type FiltersProps = {
  maxGMV: number
  handleGmvFilterChange: (value: number) => void
  gmvFilter: number
  setGmvFilter: React.Dispatch<React.SetStateAction<number>>
}
