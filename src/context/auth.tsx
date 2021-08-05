import Router from 'next/router'
import { destroyCookie, parseCookies, setCookie } from 'nookies'
import { createContext, ReactNode, useEffect, useState } from 'react'
import { api } from '../services/apiClient'

type User = {
  email: string
  permissions: string[]
  roles: string[]
}

type SignCredentials = {
  email: string
  password: string
}

type AuthContextData = {
  signIn(credentials: SignCredentials): Promise<void>
  user: User
  isAuthenticated: boolean
}

type AuthProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextData)

export function signOut() {
  destroyCookie(undefined, 'nextauth.token')
  destroyCookie(undefined, 'nextauth.refreshToken')

  Router.replace('/')
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>()
  const isAuthenticated = !!user

  useEffect(() => {
    ;(async () => {
      const { 'nextauth.token': token } = parseCookies()

      if (token) {
        try {
          const response = await api.get('/me')

          const { email, roles, permissions } = response.data

          setUser({ email, roles, permissions })
        } catch {
          signOut()
        }
      }
    })()
  }, [])

  async function signIn({ email, password }) {
    try {
      const { data } = await api.post('/sessions', {
        email,
        password,
      })

      const { token, refreshToken, permissions, roles } = data

      setCookie(undefined, 'nextauth.token', token, {
        maxAge: 60 * 60 * 24,
        path: '/',
      })

      setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24,
        path: '/',
      })

      setUser({ email, permissions, roles })

      api.defaults.headers['Authorization'] = `Bearer ${token}`

      Router.push('/dashboard')
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, user }}>
      {children}
    </AuthContext.Provider>
  )
}
