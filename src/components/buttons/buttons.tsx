import React from 'react'
import styles from './buttons.module.scss'
import { Button } from 'antd'
import { ButtonsProps } from './buttons.types'

export const Buttons: React.FC<ButtonsProps> = ({
  fileInputExcelRef,
  setIsInfoModalOpen,
  setIsModalOpen,
  handleFileUpload,
  circles,
  exportCircles,
  setIsDataModal,
  setMaxIntersections,
  maxIntersections,
}) => {
  const handleAddIntersections = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)

    setMaxIntersections(value)
  }

  return (
    <div className={styles.bottomContainer}>
      {/* <input
        id="intersections"
        value={maxIntersections}
        type="number"
        onChange={handleAddIntersections}
        className={styles.input}
      /> */}

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

      <Button
        disabled={circles.length === 0}
        onClick={() => setIsDataModal(true)}
      >
        Pokaż dane
      </Button>

      <Button disabled={circles.length === 0} onClick={exportCircles}>
        Eksportuj Okręgi
      </Button>
    </div>
  )
}
