import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import IndependentVilla from './IndependentVilla';
// import IndependentVillaPage from './IndependentVillaPage';

const App = () => {
  return (
    <>

    <BrowserRouter>
      <Routes>

        <Route path='/' element={<IndependentVilla/>}/>
        {/* <Route path='/' element={<IndependentVillaPage/>} /> */}
      </Routes>
    </BrowserRouter>
      
    </>
  )
}

export default App
