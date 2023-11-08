// App.tsx
import React, { useState, useEffect } from 'react'
import './App.css'
import { ThemeProvider } from './providers/theme-provider.provider'
import Map from './components/map'
import Login from './components/login/login'

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  useEffect(() => {
    const password = localStorage.getItem('password')
    if (password) {
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  return (
    <div className="App">
      <ThemeProvider>
        {isLoggedIn ? <Map /> : <Login onLogin={handleLogin} />}
      </ThemeProvider>
    </div>
  )
}

export default App
