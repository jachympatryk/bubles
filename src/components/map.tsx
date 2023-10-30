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
import { Modal, Button, Input, Form } from 'antd'
import { saveAs } from 'file-saver'

import * as yup from 'yup'

const circleSchema = yup.object().shape({
  lat: yup
    .number()
    .required('Szerokość geograficzna jest wymagana')
    .min(-90, 'Minimalna szerokość to -90')
    .max(90, 'Maksymalna szerokość to 90'),
  lng: yup
    .number()
    .required('Długość geograficzna jest wymagana')
    .min(-180, 'Minimalna długość to -180')
    .max(180, 'Maksymalna długość to 180'),
  radius: yup
    .number()
    .required('Promień jest wymagany')
    .min(0, 'Promień nie może być ujemny'),
  gmv: yup
    .number()
    .required('GMV jest wymagane')
    .min(0, 'GMV nie może być ujemne'),
})

interface CircleData {
  lat: number
  lng: number
  radius: number
  gmv: number
}

interface CircleForm {
  lat: string
  lng: string
  radius: string
  gmv: string
}
interface CircleData {
  lat: number
  lng: number
  radius: number
  gmv: number
}

interface ExcelData {
  Latitude: string
  Longitude: string
  'Bubble radius (km)': string
  GMV: string
}

const Map: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const fileInputExcelRef = useRef<HTMLInputElement>(null)

  const [circles, setCircles] = useState<CircleData[]>([])
  const [minGMV, setMinGMV] = useState<number>(Infinity)
  const [maxGMV, setMaxGMV] = useState<number>(-Infinity)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false)
  const [circleForm, setCircleForm] = useState<CircleForm>({
    lat: '',
    lng: '',
    radius: '',
    gmv: '',
  })
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    52.229675, 21.01223,
  ])

  const exportCircles = () => {
    const blob = new Blob([JSON.stringify(circles)], {
      type: 'text/plain;charset=utf-8',
    })
    saveAs(blob, 'circles.json')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCircleForm({ ...circleForm, [name]: value })
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
    setCircleForm({
      lat: '',
      lng: '',
      radius: '',
      gmv: '',
    })
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
      <div className={styles.bottomContainer}>
        <input
          id="file-upload"
          type="file"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          ref={fileInputExcelRef}
        />
        <label htmlFor="file-upload" className={styles.fileInput}>
          Wybierz plik
        </label>
        <Button onClick={() => setIsModalOpen(true)}>Dodaj okrąg</Button>
        <Button
          disabled={circles.length === 0}
          onClick={() => setIsInfoModalOpen(true)}
        >
          Pokaż informacje o okręgach
        </Button>

        <Button onClick={() => fileInputRef.current?.click()}>
          Importuj Okręgi
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: 'none' }}
          onChange={importCircles}
          accept=".json"
        />
        <Button disabled={circles.length === 0} onClick={exportCircles}>
          Eksportuj Okręgi
        </Button>
      </div>

      <Modal
        title="Dodaj okrąg"
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={handleAddCircle}
          initialValues={{
            lat: '',
            lng: '',
            radius: '',
            gmv: '',
          }}
        >
          <Form.Item
            label="Szerokość geograficzna:"
            name="lat"
            rules={[
              {
                required: true,
                message: 'Proszę wprowadzić szerokość geograficzną!',
              },
              {
                type: 'number',
                message: 'Proszę wprowadzić poprawną liczbę!',
                transform: value => parseFloat(value),
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Długość geograficzna:"
            name="lng"
            rules={[
              {
                required: true,
                message: 'Proszę wprowadzić długość geograficzną!',
              },
              {
                type: 'number',
                message: 'Proszę wprowadzić poprawną liczbę!',
                transform: value => parseFloat(value),
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Promień (w km):"
            name="radius"
            rules={[
              {
                required: true,
                message: 'Proszę wprowadzić promień!',
              },
              {
                type: 'number',
                message: 'Proszę wprowadzić liczbę dodatnią!',
                transform: value => parseFloat(value),
                min: 0,
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="GMV:"
            name="gmv"
            rules={[
              {
                required: true,
                message: 'Proszę wprowadzić GMV!',
              },
              {
                type: 'number',
                message: 'Proszę wprowadzić poprawną liczbę!',
                transform: value => parseFloat(value),
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Dodaj
          </Button>
        </Form>
      </Modal>

      <Modal
        title="Informacje o okręgach"
        visible={isInfoModalOpen}
        onCancel={() => setIsInfoModalOpen(false)}
        footer={null}
      >
        <ul className={styles.infoList}>
          {circles.map((circle, index) => (
            <li key={index} onClick={() => centerMapOnCircle(circle)}>
              <p>
                Latitude:
                {circle.lat}
              </p>
              <p>
                Longitude:
                {circle.lng}
              </p>
              <p>
                Radius:
                {circle.radius / 1000} km
              </p>
              <p>
                GMV:
                {circle.gmv}
              </p>
              <button
                onClick={e => {
                  e.stopPropagation()
                  handleRemoveCircle(index)
                }}
              >
                Usuń
              </button>
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  )
}

export default Map
