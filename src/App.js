import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar';
import SearchBar from './components/SearchBar';
import Footer from './components/Footer';
import Movies from './components/Movies';
import Login from './components/Login';
import Home from './components/Home';
import NotFound from './components/NotFound';
import MovieDetail from './components/MovieDetail';
import PersonDetail from './components/PersonDetail';


import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './components/Register';


function App() {
  const [collapsed, setCollapsed] = useState(false);


  return (
    <div className="App">

      <NavBar />

    
      <Routes>
            <Route path="/" element={ <Home/> } />
            <Route path="/movies" element={ <Movies/> }/>
            <Route path="/movie/:id" element={ <MovieDetail/> }/>
            <Route path="/person/:id" element={ <PersonDetail/> }/>
            <Route path="/login" element={ <Login/> } />
            <Route path="/register" element={ <Register/> } />
            <Route path="*" element={ <NotFound /> } />
      </Routes>
      <Footer />
    </div>

  );
}

export default App;