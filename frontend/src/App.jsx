import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
import Home from './Home.jsx'

import UrlForm from './components/UrlForm.jsx'
import Login from './components/Login.jsx'
import Signup from './components/Signup.jsx'

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [shortUrl, setShortUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = (receivedToken) => {
    localStorage.setItem('token', receivedToken)
    setToken(receivedToken)
    navigate('/')
  }

  const handleSignup = () => {
    navigate('/login')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
  }

  const handleShortenUrl = async (longUrl) => {
    setLoading(true)
    setError('')
    setShortUrl('')

    try {
      const response = await fetch('http://localhost:3000/api/url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ url: longUrl }),
      })

      if (!response.ok) {
        throw new Error('Hubo un problema al procesar la URL. Inténtalo de nuevo.')
      }

      const data = await response.json()
      setShortUrl(data.shortUrl)
    } catch (err) {
      setError(err.message || 'No se pudo conectar con el servidor.')
    } finally {
      setLoading(false)
    }
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
      </Routes>
  )
}
