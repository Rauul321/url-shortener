import {useEffect, useState} from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
import Home from './Home.jsx'

import UrlForm from './components/UrlForm.jsx'
import Login from './components/Login.jsx'
import Signup from './components/Signup.jsx'
import Dashboard from "./Dashboard.jsx"
import {jwtDecode} from 'jwt-decode'
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(null)
  const [shortUrl, setShortUrl] = useState('')
  const [urls, setUrls] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const fetchUrls = async () => {
    if(!user?.id) {
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3000/${user.id}/urls`)

      if(!response.ok) {
        throw new Error('URLs cannot be obtained')
      }

      const data = await response.json()
      setUrls(data.urls)
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect( () => {
    if(token) {
      try {
        const decoded = jwtDecode(token)
        setUser(decoded)

      } catch(error) {
        console.error('Invalid token', error)
        handleLogout()
      }
    }
  }, [token])

  useEffect(() => {
    fetchUrls()
  }, [user?.id])

  const handleLogin = (receivedToken) => {
    localStorage.setItem('token', receivedToken)
    setToken(receivedToken)

    const decoded = jwtDecode(receivedToken)
    setUser(decoded)
    navigate('/')
  }

  const handleSignup = () => {
    navigate('/login')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const handleShortenUrl = async (longUrl) => {
    setLoading(true)
    setError('')
    setShortUrl('')

    try {

      const headers = {
        'Content-Type': 'application/json',
        ...(token && {'Authorization': `Bearer ${token}`})
      }

      const response= await fetch('http://localhost:3000/api/url', {
        method: 'POST',
        headers,
        body: JSON.stringify({ url: longUrl }),
      })

      const data = await response.json()

      if(!response.ok) {
        throw new Error(data.error || data.message || 'A problem was verified while processing the URL')
      }

      setShortUrl(data.shortUrl)

    } catch (err) {
      setError(err.message || 'No se pudo conectar con el servidor.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async (code) => {

  }

  const handleGenerateQr = async (code) => {
    try {
      const response = await fetch(`http://localhost:3000/${code}/qr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) throw new Error('Error downloading the file')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'qr.pdf'
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleDeleteUrl = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/url/${id}`, {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'}
      })

      if(!response.ok) {
        throw new Error("Error while trying to delete the URL")
      }
    } catch(err) {
      setError(err.message || 'Error while trying to delete URL')
    }
  }


  return (
      <Routes>
        <Route path="/" element={
          <Home
              token={token}
              onLogout={handleLogout}
              onShortenUrl={handleShortenUrl}
              onGenerateQr={handleGenerateQr}
              shortUrl={shortUrl}
              error={error}
              loading={loading}
          />
        } />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup onSignup={handleSignup} />} />
        <Route path="/dashboard" element={
          <ProtectedRoute token={token}>
            <Dashboard username={user?.username} urls={urls} onBackHome={() => navigate('/')} onDeleteUrl={handleDeleteUrl} onDeleteAccount={handleDeleteAccount}/>
          </ProtectedRoute>
        } />
      </Routes>
  )
}
