import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { VolunteerProvider } from './context/VolunteerContext.jsx'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/data-entry/dist">
      <VolunteerProvider>
        <App />
      </VolunteerProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
