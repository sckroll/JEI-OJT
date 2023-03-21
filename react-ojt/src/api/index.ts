import axios from 'axios'
import { AuthForm } from '../types/User'
import { initServer } from './server'

const instance = axios.create()

export const signIn = async (authForm: AuthForm) => {
  const response = await instance.post('/sign-in', authForm)
  return !!response
}
export const signOut = () => instance.get('/sign-out')
export const authCheck = async () => {
  const { data } = await instance.get<boolean>('/auth-check')
  return data
}

initServer(instance)