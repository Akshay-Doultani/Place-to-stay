import React from 'react';
import BottomNav from './components/BottomNav';
import Loading from './components/Loading';
import NavBar from './components/NavBar';
import Notification from './components/Notification';
import Login from './components/user/Login';
import Room from './components/rooms/Room';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ManageRooms from './components/ManageRooms';


const App = () => {
  return (
    <>
      <Loading />
      <Notification />
      <Login />
      <NavBar />
      <BottomNav />
      <Room/>
     
    </>
  );
};

export default App;
