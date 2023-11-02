import React, { FormEvent, useState } from 'react'
import { EditCircleFormProps } from './edit-cirlce-form.types'
import { CircleData } from '../map.types'
import styles from './edit-cirlce-form.module.scss'

export const EditCircleForm: React.FC<EditCircleFormProps> = ({
  circle,
  handleSave,
  handleCancel,
}) => {
  const [editedCircle, setEditedCircle] = useState<CircleData>(circle)

  const handleChange = (field: string, value: number | boolean | string) => {
    setEditedCircle({
      ...editedCircle,
      [field]: value,
    })
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleSave(editedCircle)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.editCircleForm}>
      <label className={styles.checkboxLabel}>
        Nazwa:
        <input
          type="string"
          value={editedCircle.name}
          onChange={e => handleChange('name', e.target.value)}
        />
      </label>
      <label>
        Latitude:
        <input
          type="number"
          value={editedCircle.lat}
          onChange={e => handleChange('lat', parseFloat(e.target.value))}
        />
      </label>
      <label>
        Longitude:
        <input
          type="number"
          value={editedCircle.lng}
          onChange={e => handleChange('lng', parseFloat(e.target.value))}
        />
      </label>
      <label>
        Radius:
        <input
          type="number"
          value={editedCircle.radius}
          onChange={e => handleChange('radius', parseFloat(e.target.value))}
        />
      </label>
      <label>
        GMV:
        <input
          type="number"
          value={editedCircle.gmv}
          onChange={e => handleChange('gmv', parseFloat(e.target.value))}
        />
      </label>
      <label className={styles.checkboxLabel}>
        Pokaż okrąg:
        <input
          className={styles.checkbox}
          type="checkbox"
          checked={editedCircle.bubble}
          onChange={e => handleChange('bubble', e.target.checked)}
        />
      </label>
      <div className={styles.buttons}>
        <button style={{ backgroundColor: '#5fc853' }} type="submit">
          Zapisz
        </button>
        <button type="button" onClick={handleCancel}>
          Anuluj
        </button>
      </div>
    </form>
  )
}
