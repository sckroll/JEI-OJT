import { AxiosInstance, AxiosRequestConfig } from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { AuthForm, SignInErrorReason } from '../types/User'
import { userList } from '../config'

const AUTH_KEY = 'JEI_AUTH'
const DB_KEY = 'JEI_DB'

export const initServer = (instance: AxiosInstance) => {
  const mock = new MockAdapter(instance, { delayResponse: 1000 })

  const _signIn = async (authForm: AuthForm) => {
    if (!authForm.id) return SignInErrorReason.EMPTY_ID.valueOf()
    if (!authForm.password) return SignInErrorReason.EMPTY_PASSWORD.valueOf()

    const userData = userList.find(user => user.id === authForm.id)
    if (!userData) return SignInErrorReason.USER_NOT_FOUND.valueOf()

    const isWrongPassword = userData.password !== authForm.password
    if (isWrongPassword) return SignInErrorReason.WRONG_PASSWORD.valueOf()

    localStorage.setItem(AUTH_KEY, authForm.id)
  }
  const _signOut = () => {
    localStorage.removeItem(AUTH_KEY)
  }
  const _getCurrUserId = () => {
    return localStorage.getItem(AUTH_KEY)
  }

  mock.onPost('/sign-in').reply(async ({ data }: AxiosRequestConfig<string>) => {
    if (!data) return [500]
    
    const authForm: AuthForm = JSON.parse(data)
    const errorMessage = await _signIn(authForm)
    
    const status = errorMessage ? 500 : 200
    return [status, errorMessage]
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