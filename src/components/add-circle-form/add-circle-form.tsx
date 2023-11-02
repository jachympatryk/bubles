import React from 'react'
import { Button, Checkbox, Form, Input } from 'antd'
import { AddCircleFormProps } from './add-circle-form.types'
import styles from './add-circle-form.module.scss'

export const AddCircleForm: React.FC<AddCircleFormProps> = ({
  handleAddCircle,
  initialValues,
}) => {
  return (
    <Form
      layout="vertical"
      onFinish={handleAddCircle}
      initialValues={{
        lat: initialValues?.lat || '',
        lng: initialValues?.lng || '',
        radius: initialValues?.radius || '',
        gmv: initialValues?.gmv || '',
        bubble: initialValues?.bubble || false,
        name: initialValues?.name || '',
      }}
      className={styles.container}
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
        <Input type="number" className={styles.input} />
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
        <Input type="number" className={styles.input} />
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
        <Input type="number" className={styles.input} />
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
        <Input type="number" className={styles.input} />
      </Form.Item>
      <Form.Item
        label="Nazwa:"
        name="name"
        rules={[
          {
            required: true,
            message: 'Prosze wprowadzić nazwę!',
          },
        ]}
      >
        <Input type="string" className={styles.input} />
      </Form.Item>
      <Form.Item
        label="Pokazuj okrąg:"
        name="bubble"
        valuePropName="checked"
        className={styles.checkbox}
      >
        <Checkbox />
      </Form.Item>
      <Button type="primary" htmlType="submit" className={styles.button}>
        Dodaj
      </Button>
    </Form>
  )
}
