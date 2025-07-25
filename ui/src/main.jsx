import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Dashboard from './components/Dashboard.jsx'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        {/* Map the '/' route to the Dashboard component */}
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  </StrictMode>,
)
