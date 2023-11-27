import React, { useEffect, useRef, useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Circle,
  CircleMarker,
  useMap,
  Tooltip,
} from 'react-leaflet'
import styles from './map.module.scss'
import 'leaflet/dist/leaflet.css'
import * as XLSX from 'xlsx'
import { Modal } from 'antd'
import { CirclesList } from './circles-list/circles-list'
import {
  CircleData,
  CircleForm,
  ExcelData,
  MapEventHandlerProps,
} from './map.types'
import { AddCircleForm } from './add-circle-form/add-circle-form'
import { Buttons } from './buttons/buttons'
import DataAnalysis from './data-analysis/data-analysis'
import { useTheme } from '../providers/theme-provider.provider'
import { ThemeToggleButton } from './theme-toggle-button/theme-toggle-button'

const poznanCoordinates: [number, number] = [52.409538, 16.931992]

const MapEventHandler: React.FC<MapEventHandlerProps> = ({
  handleMapClick,
}) => {
  const map = useMap()

  useEffect(() => {
    map.on('click', handleMapClick)

    return () => {
      map.off('click', handleMapClick)
    }
  }, [map, handleMapClick])

  return null
}

const uniqueColors = [
  '#FF5733',
  '#33FF57',
  '#3357FF',
  '#FF33F5',
  '#F5FF33',
  '#33FFF5',
  '#5733FF',
  '#FF3357',
  '#57FF33',
  '#3357F5',
  '#F533FF',
  '#33F5FF',
  '#FF5733',
  '#5733F5',
  '#F55733',
  '#33FF57',
  '#57F533',
  '#3357FF',
  '#5733FF',
  '#F53357',
  '#33F557',
  '#FF3357',
  '#FF5733',
  '#57FF33',
  '#F5FF33',
  '#FF33F5',
  '#33FFF5',
  '#F5FF33',
  '#33FF57',
  '#57F5FF',
]

const Map: React.FC = () => {
  const fileInputExcelRef = useRef<HTMLInputElement>(null)

  const [circles, setCircles] = useState<CircleData[]>([])
  const [minGMV, setMinGMV] = useState<number>(Infinity)
  const [maxGMV, setMaxGMV] = useState<number>(-Infinity)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false)
  const [mapCenter, setMapCenter] =
    useState<[number, number]>(poznanCoordinates)
  const [isDataModal, setIsDataModal] = useState<boolean>(false)
  const [tempCircle, setTempCircle] = useState<CircleData | null>(null)
  const [gmvFilter] = useState<number>(0)
  const [maxIntersections, setMaxIntersections] = useState<number>(4)
  const [storeIdToColorMap, setStoreIdToColorMap] = useState<{
    [storeId: number]: string
  }>({})

  const { theme } = useTheme()

  const handleMapClick = (event: any) => {
    const { lat, lng } = event.latlng
    setTempCircle({
      lat,
      lng,
      radius: 0,
      gmv: 0,
      bubble: true,
      name: '',
      storeId: 0,
      deliveryTime: 0,
      storeAddressId: 0,
    })
    setIsModalOpen(true)
  }

  const handleEditCircle = (editedCircle: CircleData, index: number) => {
    const newCircles = [...circles]
    newCircles[index] = editedCircle
    const sortedCircles = newCircles.sort((a, b) => b.gmv - a.gmv)
    setCircles(sortedCircles)
    localStorage.setItem('circles', JSON.stringify(sortedCircles))
  }

  const exportCircles = () => {
    console.log(circles)
    const modifiedCircles = circles.map(circle => {
      return {
        store_name: circle.name,
        store_id: circle.storeId,
        store_address_id: circle.storeAddressId,
        store_address_lat: circle.lat,
        store_address_lon: circle.lng,
        maximum_delivery_distance_meters: circle.radius,
        delivery_time: circle.deliveryTime,
        bubble: circle.bubble,
        gmv: circle.gmv,
      }
    })

    const ws = XLSX.utils.json_to_sheet(modifiedCircles)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Circles')

    const now = new Date()
    const dateString = now.toISOString().split('T')[0]
    const fileName = `circles_${dateString}.xlsx`

    XLSX.writeFile(wb, fileName)
  }

  const ChangeView = ({ center }: { center: [number, number] }) => {
    const map = useMap()
    map.setView(center)
    return null
  }

  const toRadians = (degree: number) => degree * (Math.PI / 180)

  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ) => {
    const earthRadius = 6371e3
    const dLat = toRadians(lat2 - lat1)
    const dLng = toRadians(lng2 - lng1)

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return earthRadius * c
  }

  const doCirclesOverlapOrContain = (
    circle1: CircleData,
    circle2: CircleData
  ) => {
    const distance = calculateDistance(
      circle1.lat,
      circle1.lng,
      circle2.lat,
      circle2.lng
    )
    const sumOfRadii = circle1.radius + circle2.radius
    const radiusDifference = Math.abs(circle1.radius - circle2.radius)

    const intersect = distance < sumOfRadii
    const oneContainsTheOther = distance < radiusDifference

    return { intersect, oneContainsTheOther }
  }

  const doCirclesIntersect = (circle1: CircleData, circle2: CircleData) => {
    const lat1 = circle1.lat * (Math.PI / 180)
    const lat2 = circle2.lat * (Math.PI / 180)
    const lng1 = circle1.lng * (Math.PI / 180)
    const lng2 = circle2.lng * (Math.PI / 180)

    const earthRadius = 6371e3
    const dLat = lat2 - lat1
    const dLng = lng2 - lng1

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    const distance = earthRadius * c
    const totalRadii = circle1.radius + circle2.radius

    return distance < totalRadii
  }

  // const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files ? e.target.files[0] : null
  //
  //   if (file) {
  //     const reader = new FileReader()
  //     reader.onload = (e: any) => {
  //       try {
  //         const data = new Uint8Array(e.target.result)
  //         const workbook = XLSX.read(data, { type: 'array' })
  //         const worksheet = workbook.Sheets[workbook.SheetNames[0]]
  //         const json: ExcelData[] = XLSX.utils.sheet_to_json(worksheet, {
  //           raw: false,
  //         })
  //
  //         const importedCircles: CircleData[] = json
  //           .map(item => ({
  //             lat: parseFloat(item.store_address_lat.replace(',', '.')),
  //             lng: parseFloat(item.store_address_lon.replace(',', '.')),
  //             radius: parseFloat(item.maximum_delivery_distance_meters),
  //             gmv: parseFloat(item.gmv) || 0,
  //             name: item.store_name,
  //             storeId: parseInt(String(item.store_id)),
  //             bubble:
  //               item.bubble === 'PRAWDA' || item.bubble === 'TRUE' || true,
  //             storeAddressId: parseInt(item.store_address_id) || 0,
  //             deliveryTime: parseInt(item.delivery_time) || 0,
  //           }))
  //           .sort((a, b) => b.gmv - a.gmv)
  //
  //         const newCircles: CircleData[] = [...circles]
  //         const sameIdCircles: CircleData[] = []
  //         const existingStoreIds = new Set<number>(
  //           newCircles.map(c => c.storeId)
  //         )
  //
  //         importedCircles.forEach(importedCircle => {
  //           if (existingStoreIds.has(importedCircle.storeId)) {
  //             sameIdCircles.push(importedCircle)
  //           }
  //           if (!existingStoreIds.has(importedCircle.storeId)) {
  //             let intersectionsOrContainments = 0
  //             newCircles.forEach(newCircle => {
  //               const { intersect, oneContainsTheOther } =
  //                 doCirclesOverlapOrContain(importedCircle, newCircle)
  //               if (intersect || oneContainsTheOther) {
  //                 intersectionsOrContainments++
  //               }
  //             })
  //
  //             if (intersectionsOrContainments < maxIntersections) {
  //               newCircles.push(importedCircle)
  //               existingStoreIds.add(importedCircle.storeId)
  //             }
  //           }
  //         })
  //
  //         const circlesToAdd: CircleData[] = [...newCircles, ...sameIdCircles]
  //
  //         circlesToAdd.sort((a, b) => {
  //           const gmvDifference = b.gmv - a.gmv
  //
  //           if (gmvDifference === 0) {
  //             return a.name.localeCompare(b.name)
  //           }
  //
  //           return gmvDifference
  //         })
  //
  //         setCircles(circlesToAdd)
  //         localStorage.setItem('circles', JSON.stringify(circlesToAdd))
  //
  //         const gmvValues = circlesToAdd.map(circle => circle.gmv)
  //         setMinGMV(Math.min(...gmvValues))
  //         setMaxGMV(Math.max(...gmvValues))
  //       } catch (error) {
  //         console.error('Wystąpił błąd podczas wczytywania pliku', error)
  //       }
  //     }
  //
  //     reader.readAsArrayBuffer(file)
  //   }
  //
  //   if (fileInputExcelRef.current) {
  //     fileInputExcelRef.current.value = ''
  //   }
  // }

  const getColorForStoreId = (storeId: number) => {
    if (!(storeId in storeIdToColorMap)) {
      const color =
        uniqueColors[
          Object.keys(storeIdToColorMap).length % uniqueColors.length
        ]
      setStoreIdToColorMap(prevMap => ({
        ...prevMap,
        [storeId]: color,
      }))
    }
    return storeIdToColorMap[storeId] || 'defaultColor' // Zwróć domyślny kolor jako zabezpieczenie
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

          const importedCircles: CircleData[] = json
            .map(item => ({
              lat: parseFloat(item.store_address_lat.replace(',', '.')),
              lng: parseFloat(item.store_address_lon.replace(',', '.')),
              radius: parseFloat(item.maximum_delivery_distance_meters),
              gmv: parseFloat(item.gmv) || 0,
              name: item.store_name,
              storeId: parseInt(String(item.store_id)),
              bubble:
                item.bubble === 'PRAWDA' || item.bubble === 'TRUE' || true,
              storeAddressId: parseInt(item.store_address_id) || 0,
              deliveryTime: parseInt(item.delivery_time) || 0,
            }))
            .sort((a, b) => b.gmv - a.gmv)

          let newCircles: CircleData[] = [...circles]
          let circlesToExclude = new Set<number>()

          importedCircles.forEach(importedCircle => {
            if (circlesToExclude.has(importedCircle.storeId)) {
              return
            }

            let canAddCircle = true
            const relatedCircles = importedCircles.filter(
              c => c.storeId === importedCircle.storeId
            )

            for (let relatedCircle of relatedCircles) {
              let intersectionsOrContainments = 0
              newCircles.forEach(newCircle => {
                const { intersect, oneContainsTheOther } =
                  doCirclesOverlapOrContain(relatedCircle, newCircle)
                if (intersect || oneContainsTheOther) {
                  intersectionsOrContainments++
                }
              })

              if (intersectionsOrContainments >= maxIntersections) {
                canAddCircle = false
                break
              }
            }

            if (canAddCircle) {
              relatedCircles.forEach(c => newCircles.push(c))
            } else {
              circlesToExclude.add(importedCircle.storeId)
            }
          })

          newCircles.sort((a, b) => {
            const gmvDifference = b.gmv - a.gmv
            return gmvDifference === 0
              ? a.name.localeCompare(b.name)
              : gmvDifference
          })

          setCircles(newCircles)
          localStorage.setItem('circles', JSON.stringify(newCircles))

          const gmvValues = newCircles.map(circle => circle.gmv)
          setMinGMV(Math.min(...gmvValues))
          setMaxGMV(Math.max(...gmvValues))
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

  const handleAddCircle = (values: CircleForm) => {
    const newCircle: CircleData = {
      lat: tempCircle ? tempCircle.lat : parseFloat(values.lat),
      lng: tempCircle ? tempCircle.lng : parseFloat(values.lng),
      radius: parseFloat(values.radius) * 1000,
      gmv: parseFloat(values.gmv),
      bubble: values.bubble,
      name: values.name,
      storeId: values.storeId,
      storeAddressId: 0,
      deliveryTime: 0,
    }

    const newCircles = [...circles, newCircle]
    newCircles.sort((a, b) => b.gmv - a.gmv) // Sortowanie od najwyższego do najniższego GMV
    setCircles(newCircles)
    localStorage.setItem('circles', JSON.stringify(newCircles))

    setMapCenter([newCircle.lat, newCircle.lng])

    const gmvValues = newCircles.map(circle => circle.gmv)
    setMinGMV(Math.min(newCircle.gmv, ...gmvValues))
    setMaxGMV(Math.max(newCircle.gmv, ...gmvValues))
    setIsModalOpen(false)
  }

  const centerMapOnCircle = (circle: CircleData) => {
    setMapCenter([circle.lat, circle.lng])
  }

  const tileUrl =
    theme === 'light'
      ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' // Jasny motyw
      : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' // Ciemny motyw

  const getColorFromGMV = (gmv: number, minGMV: number, maxGMV: number) => {
    if (maxGMV === minGMV) {
      return 'rgb(0, 0, 255)'
    }
    const ratio = (gmv - minGMV) / (maxGMV - minGMV)
    const red = Math.min(255, Math.floor(255 * ratio))
    const blue = 255 - red
    return `rgb(${red}, 0, ${blue})`
  }

  const handleRemoveAllCircles = () => {
    setCircles([])
    localStorage.setItem('circles', JSON.stringify([]))
  }

  const handleRemoveCircle = (index: number) => {
    const newCircles = [...circles]
    newCircles.splice(index, 1)
    newCircles.sort((a, b) => b.gmv - a.gmv) // Sortowanie od najwyższego do najniższego GMV
    setCircles(newCircles)
    localStorage.setItem('circles', JSON.stringify(newCircles))

    if (newCircles.length > 0) {
      const gmvValues = newCircles.map(circle => circle.gmv)
      setMinGMV(Math.min(...gmvValues))
      setMaxGMV(Math.max(...gmvValues))
    } else {
      setMinGMV(Infinity)
      setMaxGMV(-Infinity)
    }
  }

  const generateColor = (storeId: number) => {
    let hash = 0
    const storeIdString = storeId.toString()
    for (let i = 0; i < storeIdString.length; i++) {
      hash = storeIdString.charCodeAt(i) + ((hash << 5) - hash)
    }

    let color = '#'
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff
      color += ('00' + value.toString(16)).substr(-2)
    }

    return color
  }

  useEffect(() => {
    const newColorMap = { ...storeIdToColorMap }
    let isColorMapUpdated = false

    circles.forEach(circle => {
      if (!(circle.storeId in newColorMap)) {
        const color =
          uniqueColors[Object.keys(newColorMap).length % uniqueColors.length]
        newColorMap[circle.storeId] = color
        isColorMapUpdated = true
      }
    })

    if (isColorMapUpdated) {
      setStoreIdToColorMap(newColorMap)
    }
  }, [circles])

  useEffect(() => {
    if (isInfoModalOpen) {
      if (circles.length === 0) setIsInfoModalOpen(false)
    }
  }, [circles])

  useEffect(() => {
    const savedCircles = localStorage.getItem('circles')

    if (savedCircles) {
      const parsedCircles: CircleData[] = JSON.parse(savedCircles)
      if (Array.isArray(parsedCircles)) {
        parsedCircles.sort((a, b) => b.gmv - a.gmv) // Sortowanie od najwyższego do najniższego GMV
        setCircles(parsedCircles)
        if (parsedCircles.length > 0) {
          const gmvValues = parsedCircles.map(circle => circle.gmv)
          setMinGMV(Math.min(...gmvValues))
          setMaxGMV(Math.max(...gmvValues))
        }
      }
    }
  }, [])

  return (
    <div className={styles.mapContainer}>
      <ThemeToggleButton />

      <MapContainer
        center={mapCenter}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
      >
        <ChangeView center={mapCenter} />
        <TileLayer url={tileUrl} />
        <MapEventHandler handleMapClick={handleMapClick} />

        {circles
          .filter(circle => circle.gmv >= gmvFilter)
          .map((circle, idx) => {
            if (!circle.bubble) return null

            const circleColor = getColorFromGMV(circle.gmv, minGMV, maxGMV)
            return (
              <React.Fragment key={idx}>
                <Circle
                  center={[circle.lat, circle.lng]}
                  radius={circle.radius}
                  pathOptions={{ color: circleColor }}
                >
                  <Tooltip permanent>
                    {circle.name}, {circle.gmv}
                  </Tooltip>
                </Circle>
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
        fileInputExcelRef={fileInputExcelRef}
        handleFileUpload={handleFileUpload}
        setIsInfoModalOpen={setIsInfoModalOpen}
        setIsModalOpen={setIsModalOpen}
        exportCircles={exportCircles}
        setIsDataModal={setIsDataModal}
        setMaxIntersections={setMaxIntersections}
        maxIntersections={maxIntersections}
      />

      <Modal
        title="Dodaj okrąg"
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <AddCircleForm
          handleAddCircle={handleAddCircle}
          initialValues={tempCircle || null}
        />
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
          handleRemoveAllCircles={handleRemoveAllCircles}
        />
      </Modal>
      <Modal
        title="Informacje o okręgach"
        visible={isDataModal}
        onCancel={() => setIsDataModal(false)}
        footer={null}
      >
        <DataAnalysis circles={circles} />
      </Modal>
    </div>
  )
}

export default Map
