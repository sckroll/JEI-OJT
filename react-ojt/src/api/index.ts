import axios from 'axios'
import { AuthForm } from '../types/User'
import { initServer } from './server'

const instance = axios.create()

export const signIn = (authForm: AuthForm) => instance.post('/sign-in', authForm)
export const signOut = () => instance.get('/sign-out')
export const authCheck = async () => {
  const { data } = await instance.get<boolean>('/auth-check')
  return data
}

initServer(instance)