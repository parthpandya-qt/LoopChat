import React, { useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import { Route, Routes, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import { useAuthStore } from "./store/useAuthStore.js";
import { Loader } from 'lucide-react'
import { Toaster } from "react-hot-toast";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth])
  console.log(authUser);
  if (isCheckingAuth)
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
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />

          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />

          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />

          <Route path="/settings" element={<SettingsPage />} />

          <Route
            path="/profile"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />
        </Routes>
        <Toaster />
      </div>

    </>
  )
}

export default App
