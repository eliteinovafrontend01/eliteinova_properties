import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import IndependentVillaPage from './Pages/IndependentVillaPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<IndependentVillaPage />} />
        <Route path='/villa' element={<IndependentVillaPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;