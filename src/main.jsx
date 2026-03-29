import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import  App from'./app.jsx'
import { HashRouter } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'


createRoot(document.getElementById('root')).render(
  <HashRouter>
  <Navbar/>
<App/>
  </HashRouter>
)