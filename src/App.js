import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar/NavBar';
import SearchBar from './components/SearchBar/SearchBar';
import Footer from './components/Footer/Footer';
import Trending from './components/Trending/Trending';
import Intro from './components/Introduction/Introduction';

function App() {
  const [collapsed, setCollapsed] = useState(false);


  return (
    <div className="App">
      <NavBar />
      <SearchBar />
      <Intro />
      <Trending />
      <Footer />
    </div>

  );
}

export default App;