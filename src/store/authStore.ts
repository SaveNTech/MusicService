import { create } from 'zustand'
import type { AuthUser } from '@/types'
import { authApi } from '@/api'

interface AuthState {
  user: AuthUser | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, username: string, password: string) => Promise<void>
  logout: () => void
  fetchMe: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('aura_token'),
  loading: false,

  login: async (email, password) => {
    const { data } = await authApi.login(email, password)
    localStorage.setItem('aura_token', data.access_token)
    set({ token: data.access_token })
    const me = await authApi.me()
    set({ user: me.data })
  },

  register: async (email, username, password) => {
    const { data } = await authApi.register(email, username, password)
    localStorage.setItem('aura_token', data.access_token)
    set({ token: data.access_token })
    const me = await authApi.me()
    set({ user: me.data })
  },

  logout: () => {
    localStorage.removeItem('aura_token')
    set({ user: null, token: null })
  },

  fetchMe: async () => {
    const token = localStorage.getItem('aura_token')
    if (!token) return
    try {
      set({ loading: true })
      const { data } = await authApi.me()
      set({ user: data, token })
    } catch {
      localStorage.removeItem('aura_token')
      set({ user: null, token: null })
    } finally {
      set({ loading: false })
    }
  },
}))
