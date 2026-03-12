import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import  App from'./app.jsx'
import { BrowserRouter } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <Navbar/>
<App/>
  </BrowserRouter>
)