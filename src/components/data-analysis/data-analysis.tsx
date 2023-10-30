import React from 'react'
import { CircleData } from '../map.types'

interface DataAnalysisProps {
  circles: CircleData[]
}

const DataAnalysis: React.FC<DataAnalysisProps> = ({ circles }) => {
  const calculateStats = () => {
    if (circles.length === 0) {
      return null
    }

    const gmvs = circles.map(circle => circle.gmv)
    const sum = gmvs.reduce((a, b) => a + b, 0)
    const avg = sum / gmvs.length
    const max = Math.max(...gmvs)
    const min = Math.min(...gmvs)

    return { sum, avg, max, min }
  }

  const stats = calculateStats()

  if (!stats) {
    return <div>Brak danych do analizy.</div>
  }

  return (
    <div>
      <h3>Analiza danych GMV:</h3>
      <div>Suma GMV: {stats.sum}</div>
      <div>Średnia GMV: {stats.avg.toFixed(2)}</div>
      <div>Maksymalne GMV: {stats.max}</div>
      <div>Minimalne GMV: {stats.min}</div>
    </div>
  )
}

export default DataAnalysis
