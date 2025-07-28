import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Dashboard from './components/Dashboard.jsx'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './HomePage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        {/* Map the '/' route to the Dashboard component */}
        <Route path='/' element={<Homepage />} />
        <Route path="/Dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  </StrictMode>,
)
