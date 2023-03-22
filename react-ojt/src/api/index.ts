import axios from 'axios'
import { AuthForm, ContentState } from '../types'
import { initServer } from './server'

const instance = axios.create()

export const signIn = async (authForm: AuthForm) => {
  const response = await instance.post('/sign-in', authForm)
  return !!response
}

export const signOut = () => instance.get('/sign-out')

export const authCheck = async () => {
  const { data } = await instance.get<string | null>('/auth-check')
  return data
}

export const getContentState = async () => {
  const { data } = await instance.get<ContentState[]>('/contents')
  return data
}

export const updateContentState = async (updatedState: ContentState[]) => {
  await instance.post('/contents', updatedState)
}

initServer(instance)