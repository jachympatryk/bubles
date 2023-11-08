import React, { useState } from 'react'
import { Form, Input, Button, message } from 'antd'

interface LoginProps {
  onLogin: () => void
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState<string>('')
  const correctPassword = 'LECH-Pany'

  const handleSubmit = () => {
    if (password === correctPassword) {
      localStorage.setItem('password', password)
      onLogin()
    } else {
      setPassword('')
      message.error('Incorrect password, access denied.').then()
    }
  }

  // Example inline styles
  const formStyle = {
    maxWidth: '300px',
    margin: 'auto',
    padding: '20px',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }

  const inputStyle = {
    marginBottom: '20px',
  }

  const buttonStyle = {
    width: '100%',
    background: '#1890ff',
    borderColor: '#1890ff',
  }

  return (
    <Form onFinish={handleSubmit} style={formStyle}>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
        style={inputStyle}
      >
        <Input.Password
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter Password"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={buttonStyle}>
          Login
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Login
