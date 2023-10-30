import React from 'react'
import { Button, Form, Input } from 'antd'
import { AddCircleFormProps } from './add-circle-form.types'

export const AddCircleForm: React.FC<AddCircleFormProps> = ({
  handleAddCircle,
}) => {
  return (
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
  )
}
