import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/home/Home';
import Hotels from './pages/hotels/Hotels';
import Hotel from './pages/hotel/Hotel';
import Login from './pages/login/Login';

const App = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/hotels/:id" element={<Hotel />} />
            <Route path="/auth" element={<Login />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App;
