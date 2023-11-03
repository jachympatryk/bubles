import { LeafletMouseEvent } from 'leaflet'

export interface CircleData {
  name: string
  storeId: number
  storeAddressId: number
  lat: number
  lng: number
  radius: number
  deliveryTime: number
  bubble: boolean
  gmv: number
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
  store_name: string
  store_id: number
  store_address_id: string
  store_address_lat: string
  store_address_lon: string
  maximum_delivery_distance_meters: string
  delivery_time: string
  gmv: string
  bubble: 'PRAWDA' | 'FALSZ' | 'TRUE' | 'FALSE'
}

export interface MapEventHandlerProps {
  handleMapClick: (event: LeafletMouseEvent) => void
}
