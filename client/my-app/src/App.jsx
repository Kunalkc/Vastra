import React from 'react'
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login.jsx'
import Home from './components/Home.jsx'
import Profile from './components/Profile.jsx'
import Auction from './components/Auction.jsx'
import Post from './components/addproduct.jsx'
import ViewProduct from './components/viewproduct.jsx';
import Searchtab from './components/search.jsx';

export default function App() {


  const [searchbar , togglesearchbar] = useState(true)

  const flipsearchbar = () => {
    togglesearchbar(prev=>(!prev))
  }
  

  return (
    <Router>
  { searchbar? 
       <Searchtab
          isopen = {searchbar}
          togglebar = {flipsearchbar}
       />: <></>
   }
    <Routes>
     
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/login" element= {<Login />} />
      <Route path="/home" element={<Home togglesearch = {flipsearchbar}/>} />
      <Route path="/profile" element={<Profile togglesearch = {flipsearchbar} />} />
      <Route path="/auction" element={<Auction togglesearch = {flipsearchbar}/>} />
      <Route path="/post" element={<Post togglesearch = {flipsearchbar}/>} />
      <Route path="/products/prodbyid/:productId" element={<ViewProduct togglesearch = {flipsearchbar} />} />
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  </Router>
  )
} 