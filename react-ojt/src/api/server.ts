import { AxiosInstance, AxiosRequestConfig } from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { AuthForm } from '../types/User'

const AUTH_KEY = 'JEI_AUTH'
const DB_KEY = 'JEI_DB'

export const initServer = (instance: AxiosInstance) => {
  const mock = new MockAdapter(instance)

  const _signIn = (id: string) => {
    localStorage.setItem(AUTH_KEY, id)
  }
  const _signOut = () => {
    localStorage.removeItem(AUTH_KEY)
  }

  mock.onPost('/signIn').reply(({ data }: AxiosRequestConfig<string>) => {
    try {
      if (!data) return [500]
      
      const parsed: AuthForm = JSON.parse(data)
      _signIn(parsed.id)
      
      return [200]
    } catch (e) {
      console.error(e);
      return [500]
    }
  })
  mock.onGet('/signOut').reply(() => {
    _signOut()
    return [200]
  })
}

export const isSignedIn = () => {
  return !!localStorage.getItem(AUTH_KEY)
}

export const getCurrUserId = () => {
  return localStorage.getItem(AUTH_KEY) ?? ''
}