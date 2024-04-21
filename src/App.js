import './App.css';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Redirect from './pages/Redirect';
import Home from './pages/Home';
import Movies from './pages/movies';
import Bookmark from './pages/Bookmark';
import Series from './pages/Series';
import Navbar from './components/Navbar';

function App() {
    return (
        <>
        <Navbar/>
            <Routes>
                <Route path='/' element={<Redirect />} />
                <Route path='/home' element={<Home />} />
                <Route path='/movies' element={<Movies />} />
                <Route path='/series' element={<Series />} />
                <Route path='/bookmark' element={<Bookmark />} />
            </Routes>
        </>
    );
}

export default App;