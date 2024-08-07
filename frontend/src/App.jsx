import React from 'react'
import { Route, Routes } from 'react-router-dom'
import {Toaster} from "react-hot-toast"

import SignUpPage from './pages/auth/signup/SignUpPage'
import Home from './pages/home/Home'
import LoginPage from './pages/auth/login/LoginPage'
import Sidebar from './components/common/Sidebar'
import RightPanel from './components/common/RightPanel'
import NotificationPage from './pages/notification/NotificationPage'
import ProfilePage from './pages/profile/ProfilePage'

function App() {
  return (
    
		<div className='flex max-w-6xl mx-auto'>
      {/* its a common componet so it cant be wraped in routes */}
      <Sidebar/>
      <Routes>
        <Route path="/" element={<Home/>}/>;
        <Route path="/signup" element={<SignUpPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path='/notifications' element={<NotificationPage/>}/>
        <Route path='/profile/:username' element={<ProfilePage/>}/>
      </Routes>
      {/* <RightPanel/> */}
      <Toaster/>
    </div>
  )
}

export default App