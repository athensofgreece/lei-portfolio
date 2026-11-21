import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { initAnalytics } from './stats.js'
import './styles.css'

initAnalytics()
createRoot(document.getElementById('root')).render(<App />)