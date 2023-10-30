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
  Latitude: string
  Longitude: string
  'Bubble radius (km)': string
  GMV: string
  Bubble: 'Yes' | 'No'
}
