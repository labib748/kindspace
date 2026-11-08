import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import EmergencyButton from './components/EmergencyButton'
import Mascot from './components/Mascot'
import Home from './pages/Home'
import Konselor from './pages/Konselor'
import Booking from './pages/Booking'
import Dashboard from './pages/Dashboard'
import Napas from './pages/Napas'
import Login from './pages/Login'
import Daftar from './pages/Daftar'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/konselor" element={<Konselor />} />
            <Route path="/napas" element={<Napas />} />
            <Route path="/masuk" element={<Login />} />
            <Route path="/daftar" element={<Daftar />} />
            <Route
              path="/booking"
              element={
                <ProtectedRoute roles={['mahasiswa']}>
                  <Booking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
        <EmergencyButton />
        <Mascot />
      </AuthProvider>
    </BrowserRouter>
  )
}
