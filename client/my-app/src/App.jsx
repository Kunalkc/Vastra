import react from 'react'
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './css/Landing.css'
import './components/Login'
import './components/Home'
import './components/Profile'
import './components/Auction'

function App() {

  return (
    <Router>
    <Routes>
 
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/auction/:id" element={<Auction />} />
      
      {/* Optional: Catch-all route (404 Page Not Found) */}
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  </Router>
  )
}

export default App
