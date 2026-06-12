import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const token = user?.token || null
  const role  = user?.role  || null

  const login = useCallback((userData) => {
    const payload = {
      id:    userData.user.id,
      name:  userData.user.name,
      email: userData.user.email,
      role:  userData.user.role,
      token: userData.token,
    }
    localStorage.setItem('user', JSON.stringify(payload))
    localStorage.setItem('jwt_token', userData.token)
    localStorage.setItem('role', userData.user.role)
    setUser(payload)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('user')
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('role')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
