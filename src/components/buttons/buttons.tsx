import React from 'react'
import styles from './buttons.module.scss'
import { Button } from 'antd'
import { ButtonsProps } from './buttons.types'

export const Buttons: React.FC<ButtonsProps> = ({
  fileInputExcelRef,
  fileInputRef,
  setIsInfoModalOpen,
  setIsModalOpen,
  handleFileUpload,
  circles,
  importCircles,
  exportCircles,
  setIsDataModal,
}) => {
  return (
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

      <Button
        disabled={circles.length === 0}
        onClick={() => setIsDataModal(true)}
      >
        Pokaż dane
      </Button>

      {/*<Button onClick={() => fileInputRef.current?.click()}>*/}
      {/*  Importuj Okręgi*/}
      {/*</Button>*/}
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
  )
}
