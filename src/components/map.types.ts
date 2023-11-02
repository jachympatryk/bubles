import { LeafletMouseEvent } from 'leaflet'

export interface CircleData {
  lat: number
  lng: number
  radius: number
  gmv: number
  bubble: boolean
}

export interface CircleForm {
  lat: string
  lng: string
  radius: string
  gmv: string
  bubble: boolean
}

export interface ExcelData {
  lat: string
  lng: string
  radius: string
  gmv: string
  bubble: 'PRAWDA' | 'FALSZ' | 'TRUE' | 'FALSE'
}

export interface MapEventHandlerProps {
  handleMapClick: (event: LeafletMouseEvent) => void
}
