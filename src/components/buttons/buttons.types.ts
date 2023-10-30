import { CircleData } from '../map.types'
import React from 'react'

export type ButtonsProps = {
  circles: CircleData[]
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  fileInputExcelRef: React.RefObject<HTMLInputElement>
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setIsInfoModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  fileInputRef: React.RefObject<HTMLInputElement>
  importCircles: (event: React.ChangeEvent<HTMLInputElement>) => void
  exportCircles: () => void
}
