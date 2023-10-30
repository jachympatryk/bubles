import React from 'react'
import './App.css'
import Map from './components/map'
import { ThemeProvider } from './providers/theme-provider.provider'

function App() {
  return (
    <div className="App">
      <ThemeProvider>
        <Map />
      </ThemeProvider>
    </div>
  )
}

export default App
