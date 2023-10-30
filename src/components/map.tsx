import React, { useEffect, useRef, useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Circle,
  CircleMarker,
  useMap,
} from 'react-leaflet'
import styles from './map.module.scss'
import 'leaflet/dist/leaflet.css'
import * as XLSX from 'xlsx'
import { Modal } from 'antd'
import { saveAs } from 'file-saver'
import { CirclesList } from './circles-list/circles-list'
import { CircleData, CircleForm, ExcelData } from './map.types'
import { AddCircleForm } from './add-circle-form/add-circle-form'
import { Buttons } from './buttons/buttons'

const Map: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const fileInputExcelRef = useRef<HTMLInputElement>(null)

  const [circles, setCircles] = useState<CircleData[]>([])
  const [minGMV, setMinGMV] = useState<number>(Infinity)
  const [maxGMV, setMaxGMV] = useState<number>(-Infinity)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false)
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    52.229675, 21.01223,
  ])

  const handleEditCircle = (editedCircle: CircleData, index: number) => {
    const newCircles = [...circles]
    newCircles[index] = editedCircle
    setCircles(newCircles)
  }

  const exportCircles = () => {
    const blob = new Blob([JSON.stringify(circles)], {
      type: 'text/plain;charset=utf-8',
    })
    saveAs(blob, 'circles.json')
  }

  function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap()
    map.setView(center)
    return null
  }

  const importCircles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const text = e.target?.result
          if (typeof text === 'string') {
            const importedCircles: CircleData[] = JSON.parse(text)

            const newCircles = [...circles, ...importedCircles]

            setCircles(newCircles)

            const gmvValues = importedCircles.map(circle => circle.gmv)
            setMinGMV(Math.min(...gmvValues))
            setMaxGMV(Math.max(...gmvValues))
          }
        } catch (error) {
          console.error('Wystąpił błąd podczas importowania okręgów', error)
        }
      }
      reader.readAsText(file)
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleAddCircle = (values: CircleForm) => {
    const newCircle = {
      lat: parseFloat(values.lat),
      lng: parseFloat(values.lng),
      radius: parseFloat(values.radius) * 1000, // Konwersja km na metry
      gmv: parseFloat(values.gmv),
    }

    setCircles([...circles, newCircle])
    setMapCenter([newCircle.lat, newCircle.lng])

    const gmvValues = circles.map(circle => circle.gmv)
    setMinGMV(Math.min(newCircle.gmv, ...gmvValues))
    setMaxGMV(Math.max(newCircle.gmv, ...gmvValues))
    setIsModalOpen(false)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null

    if (file) {
      const reader = new FileReader()
      reader.onload = (e: any) => {
        try {
          const data = new Uint8Array(e.target.result)
          const workbook = XLSX.read(data, { type: 'array' })
          const worksheet = workbook.Sheets[workbook.SheetNames[0]]
          const json: ExcelData[] = XLSX.utils.sheet_to_json(worksheet, {
            raw: false,
          })

          const formattedData: CircleData[] = json.map(item => {
            const gmv = parseFloat(item.GMV)
            return {
              lat: parseFloat(item.Latitude),
              lng: parseFloat(item.Longitude),
              radius: parseFloat(item['Bubble radius (km)']) * 1000, // Konwersja km na metry
              gmv: isNaN(gmv) ? 0 : gmv,
            }
          })

          const gmvValues = formattedData.map(item => item.gmv)
          const minVal = Math.min(...gmvValues)
          const maxVal = Math.max(...gmvValues)

          setMinGMV(minVal)
          setMaxGMV(maxVal)

          const newCircles = [...circles, ...formattedData]

          setCircles(newCircles)
        } catch (error) {
          console.error('Wystąpił błąd podczas wczytywania pliku', error)
        }
      }

      reader.readAsArrayBuffer(file)
    }

    if (fileInputExcelRef.current) {
      fileInputExcelRef.current.value = ''
    }
  }

  const centerMapOnCircle = (circle: CircleData) => {
    setMapCenter([circle.lat, circle.lng])
  }

  const getColorFromGMV = (gmv: number, minGMV: number, maxGMV: number) => {
    if (maxGMV === minGMV) {
      return 'rgb(0, 0, 255)'
    }
    const ratio = (gmv - minGMV) / (maxGMV - minGMV)
    const red = Math.min(255, Math.floor(255 * ratio))
    const blue = 255 - red
    return `rgb(${red}, 0, ${blue})`
  }

  const handleRemoveCircle = (index: number) => {
    const newCircles = [...circles]
    newCircles.splice(index, 1)
    setCircles(newCircles)

    if (newCircles.length > 0) {
      const gmvValues = newCircles.map(circle => circle.gmv)
      setMinGMV(Math.min(...gmvValues))
      setMaxGMV(Math.max(...gmvValues))
    } else {
      setMinGMV(Infinity)
      setMaxGMV(-Infinity)
    }
  }

  useEffect(() => {
    if (isInfoModalOpen) {
      if (circles.length === 0) setIsInfoModalOpen(false)
    }
  }, [circles])

  return (
    <div className={styles.mapContainer}>
      <MapContainer
        center={mapCenter}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
      >
        <ChangeView center={mapCenter} />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {circles.map((circle, idx) => {
          const circleColor = getColorFromGMV(circle.gmv, minGMV, maxGMV)
          return (
            <React.Fragment key={idx}>
              <Circle
                center={[circle.lat, circle.lng]}
                radius={circle.radius}
                pathOptions={{ color: circleColor }}
              />
              <CircleMarker
                center={[circle.lat, circle.lng]}
                radius={3}
                pathOptions={{ color: circleColor }}
              />
            </React.Fragment>
          )
        })}
      </MapContainer>

      <Buttons
        circles={circles}
        importCircles={importCircles}
        fileInputExcelRef={fileInputExcelRef}
        fileInputRef={fileInputRef}
        handleFileUpload={handleFileUpload}
        setIsInfoModalOpen={setIsInfoModalOpen}
        setIsModalOpen={setIsModalOpen}
        exportCircles={exportCircles}
      />

      <Modal
        title="Dodaj okrąg"
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <AddCircleForm handleAddCircle={handleAddCircle} />
      </Modal>

      <Modal
        title="Informacje o okręgach"
        visible={isInfoModalOpen}
        onCancel={() => setIsInfoModalOpen(false)}
        footer={null}
      >
        <CirclesList
          handleEditCircle={handleEditCircle}
          circles={circles}
          handleRemoveCircle={handleRemoveCircle}
          centerMapOnCircle={centerMapOnCircle}
        />
      </Modal>
    </div>
  )
}

export default Map
