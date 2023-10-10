import React from 'react'

import { Container } from '@mui/material';

import Navbar from './components/Navbar';
import Home from './components/Home';
import Auth from './components/Auth/Auth';
import PostDetails from './components/PostDetails';
import CreatorOrTag from './components/CreatorOrTag'

import { BrowserRouter, Routes, Route,Navigate  } from 'react-router-dom';

const App = () => {
  const user = JSON.parse(localStorage.getItem('profile'));
  return (
    <>
    <BrowserRouter>
        <Container maxWidth="xl" sx={{width:'100%'}}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/posts"/>} />
            <Route path="/posts" element={<Home />} />
            <Route path="/posts/search" element={<Home/>} />
            <Route path="/posts/:id"  element={<PostDetails/>} />
            <Route path="/creators/:name" element={<CreatorOrTag/>} />
            <Route path="/tags/:name" element={<CreatorOrTag/>} />
            <Route path="/auth"  element={!user ? ( <Auth />) :( <Navigate replace to={"/posts"} />)} />
          </Routes>
        </Container>
      </BrowserRouter>
    </>
  )
}

export default App