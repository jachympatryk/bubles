import React, { useState } from 'react'
import { EditCircleForm } from '../edit-cirlce-form/edit-circle-form'
import { CirclesListProps } from './circles-list.types'
import styles from './circle-list.module.scss'
import { CircleData } from '../map.types'
import { Button } from 'antd'
export const CirclesList: React.FC<CirclesListProps> = ({
  circles,
  handleRemoveCircle,
  handleEditCircle,
  centerMapOnCircle,
}) => {
  const [editingIndex, setEditingIndex] = useState(-1)

  const handleEdit = (index: number) => {
    setEditingIndex(index)
  }

  const handleSave = (editedCircle: CircleData) => {
    handleEditCircle(editedCircle, editingIndex)
    setEditingIndex(-1)
  }

  const handleCancel = () => {
    setEditingIndex(-1)
  }

  return (
    <ul className={styles.infoList}>
      {circles.map((circle, index) => {
        const bubbleValue = circle.bubble ? 'Tak' : 'Nie'

        return (
          <li key={index} onClick={() => centerMapOnCircle(circle)}>
            {editingIndex === index ? (
              <EditCircleForm
                circle={circle}
                handleSave={handleSave}
                handleCancel={handleCancel}
              />
            ) : (
              <>
                <p>Latitude: {circle.lat}</p>
                <p>Longitude: {circle.lng}</p>
                <p>Radius: {circle.radius / 1000} km</p>
                <p>GMV: {circle.gmv}</p>
                <p>Pokaz okrąg: {bubbleValue}</p>
                <div className={styles.buttons}>
                  <Button
                    style={{ backgroundColor: '#3c49d1' }}
                    onClick={e => {
                      e.stopPropagation()
                      handleEdit(index)
                    }}
                  >
                    Edytuj
                  </Button>
                  <Button
                    onClick={e => {
                      e.stopPropagation()
                      handleRemoveCircle(index)
                    }}
                  >
                    Usuń
                  </Button>
                </div>
              </>
            )}
          </li>
        )
      })}
    </ul>
  )
}
