import React from 'react'
import { FaMoon, FaSun } from 'react-icons/fa'
import { useTheme } from '../../providers/theme-provider.provider'
import styles from './theme-toggle-button.module.scss'
export const ThemeToggleButton: React.FC = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={styles.container}
      style={{ backgroundColor: theme === 'light' ? '#5b5b5b' : '#fff' }}
    >
      {theme === 'light' ? <FaMoon style={{ color: '#fff' }} /> : <FaSun />}
    </button>
  )
}
