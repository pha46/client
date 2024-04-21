import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import RequireAuth from '@auth-kit/react-router/RequireAuth'

import Login from './components/Login'
import App from './App';

const RoutesComponent = () => {
  return (
    <BrowserRouter>
        <Routes>
          <Route path={'/' } element={<Login/>}/>
          <Route path={'/secure/*'} element={
            <RequireAuth fallbackPath={'/'}>
              <App/>
            </RequireAuth>
          }/>
        </Routes>
    </BrowserRouter>
  )
}

export default RoutesComponent