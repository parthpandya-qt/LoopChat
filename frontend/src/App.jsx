import React, { use, useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignUp from './pages/SignUpPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import { axiosInstance } from './lib/axios.js'
import { useAuthStore } from "./store/useAuthStore.js";
import { Loader } from 'lucide-react'
const App = () => {
  const {authUser, checkAuth,isCheckingAuth} = useAuthStore();
  useEffect(()=>{
    checkAuth();
  },[checkAuth])
  console.log(authUser);
  if(isCheckingAuth && !authUser)
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className='animate-spin' size={48} />
      </div>
    ) 
  return (
    <>
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
    </>
  )
}

export default App
