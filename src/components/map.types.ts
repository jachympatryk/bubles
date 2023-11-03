import { LeafletMouseEvent } from 'leaflet'

export interface CircleData {
  lat: number
  lng: number
  radius: number
  gmv: number
  bubble: boolean
  name: string
  storeId: number
}

export interface CircleForm {
  lat: string
  lng: string
  radius: string
  gmv: string
  bubble: boolean
  name: string
  storeId: number
}

export interface ExcelData {
  lat: string
  lng: string
  radius: string
  gmv: string
  bubble: 'PRAWDA' | 'FALSZ' | 'TRUE' | 'FALSE'
  name: string
  store_id: number
}

export interface MapEventHandlerProps {
  handleMapClick: (event: LeafletMouseEvent) => void
}
