import { CircleData, CircleForm } from '../map.types'

export type AddCircleFormProps = {
  handleAddCircle: (values: CircleForm) => void
  initialValues: CircleData | null
}
