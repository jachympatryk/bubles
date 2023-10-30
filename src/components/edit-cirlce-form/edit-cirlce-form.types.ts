import { CircleData } from '../map.types'

export type EditCircleFormProps = {
  circle: CircleData
  handleSave: (editedCircle: CircleData) => void
  handleCancel: () => void
}
