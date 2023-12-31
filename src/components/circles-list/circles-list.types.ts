import { CircleData } from '../map.types'

export type CirclesListProps = {
  circles: CircleData[]
  handleRemoveCircle: (index: number) => void
  centerMapOnCircle: (circle: CircleData) => void
  handleEditCircle: (editedCircle: CircleData, index: number) => void
  handleRemoveAllCircles: () => void
}
