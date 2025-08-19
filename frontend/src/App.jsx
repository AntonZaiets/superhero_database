import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Navbar, SuperheroList, SuperheroDetail, SuperheroForm } from '@/components';
import 'react-toastify/dist/ReactToastify.css';

const App = () => (
  <div className="App">
    <Navbar />
    <div className="container">
      <Routes>
        <Route path="/" element={<SuperheroList />} />
        <Route path="/superhero/:id" element={<SuperheroDetail />} />
        <Route path="/create" element={<SuperheroForm />} />
        <Route path="/edit/:id" element={<SuperheroForm />} />
      </Routes>
    </div>
    <ToastContainer />
  </div>
);

export default App;
