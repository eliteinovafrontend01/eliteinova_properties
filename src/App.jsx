import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import IndependentVilla from './IndependentVilla';

const App = () => {
  return (
    <>

    <BrowserRouter>
      <Routes>

        <Route path='/' element={<IndependentVilla/>}/>
      </Routes>
    </BrowserRouter>
      
    </>
  )
}

export default App
