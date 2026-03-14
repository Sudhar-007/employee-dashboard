import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Analytics from './pages/Analytics'
import Details from './pages/Details'
import List from './pages/List'
import Login from './pages/Login'

function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth()
    return isAuthenticated ? children : <Navigate to="/login" />
}

function App() {
    return (
    <AuthProvider>
        `<Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/list" element={
            <ProtectedRoute><List /></ProtectedRoute>
        } />
        <Route path="/details/:id" element={
            <ProtectedRoute><Details /></ProtectedRoute>
        } />
        <Route path="/analytics" element={
            <ProtectedRoute><Analytics /></ProtectedRoute>
        } />
        </Routes>
    </AuthProvider>
    )
}

export default App