import { LeafletMouseEvent } from 'leaflet'

export interface CircleData {
  lat: number
  lng: number
  radius: number
  gmv: number
  bubble: boolean
  name: string
}

export interface CircleForm {
  lat: string
  lng: string
  radius: string
  gmv: string
  bubble: boolean
  name: string
}

export interface ExcelData {
  lat: string
  lng: string
  radius: string
  gmv: string
  bubble: 'PRAWDA' | 'FALSZ' | 'TRUE' | 'FALSE'
  name: string
}

export interface MapEventHandlerProps {
  handleMapClick: (event: LeafletMouseEvent) => void
}
