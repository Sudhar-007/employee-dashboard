import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem('auth') === 'true'
    )

    const login = (username, password) => {
    if (username === 'testuser' && password === 'Test123') {
        localStorage.setItem('auth', 'true')
        setIsAuthenticated(true)
        return true
    }
    return false
    }

    const logout = () => {
    localStorage.removeItem('auth')
    setIsAuthenticated(false)
    }

    return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
        {children}
    </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}