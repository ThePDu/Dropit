import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('dropit_user')) || null }
    catch { return null }
  })

  const login  = (data) => { setUser(data); localStorage.setItem('dropit_user', JSON.stringify(data)) }
  const logout = ()     => { setUser(null); localStorage.removeItem('dropit_user') }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
