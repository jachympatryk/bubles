export interface CircleData {
  lat: number
  lng: number
  radius: number
  gmv: number
}

export interface CircleForm {
  lat: string
  lng: string
  radius: string
  gmv: string
}

export interface ExcelData {
  Latitude: string
  Longitude: string
  'Bubble radius (km)': string
  GMV: string
}
