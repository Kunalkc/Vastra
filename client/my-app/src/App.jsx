import react from 'react'
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './css/Landing.css'
import Login from './components/Login.jsx'
import Home from './components/Home.jsx'
import Profile from './components/Profile.jsx'
import Auction from './components/Auction.jsx'

export default function App() {
  return (
    <Router>
    <Routes>
     
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/login" element= {<Login/>} />
      <Route path="/home" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/auction" element={<Auction />} />
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  </Router>
  )
} 