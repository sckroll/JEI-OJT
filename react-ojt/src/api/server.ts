import { AxiosInstance, AxiosRequestConfig } from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { AuthForm } from '../types/User'

const AUTH_KEY = 'JEI_AUTH'
const DB_KEY = 'JEI_DB'

export const initServer = (instance: AxiosInstance) => {
  const mock = new MockAdapter(instance, { delayResponse: 1000 })

  const _signIn = (id: string) => {
    localStorage.setItem(AUTH_KEY, id)
  }
  const _signOut = () => {
    localStorage.removeItem(AUTH_KEY)
  }
  const _getCurrUserId = () => {
    return localStorage.getItem(AUTH_KEY)
  }

  mock.onPost('/sign-in').reply(({ data }: AxiosRequestConfig<string>) => {
    if (!data) return [500]
    
    const parsed: AuthForm = JSON.parse(data)
    _signIn(parsed.id)
    
    return [200]
  })
  mock.onGet('/sign-out').reply(() => {
    _signOut()
    return [200]
  })
  mock.onGet('/auth-check').reply<boolean>(() => {
    const userId = _getCurrUserId()
    return [200, !!userId]
  })
}