import axios from 'axios'
import { AuthForm, ContentState, User } from '../types'
import { initServer } from './server'

const instance = axios.create()

export const signIn = async (authForm: AuthForm) => {
  const response = await instance.post('/sign-in', authForm)
  return !!response
}

export const signOut = async () => {
  await instance.get('/sign-out')
}

export const authCheck = async () => {
  const { data } = await instance.get<User | null>('/auth-check')
  return data
}

export const getContentState = async () => {
  const { data } = await instance.get<ContentState[]>('/contents')
  return data
}

export const updateContentState = async (updatedState: ContentState[]) => {
  await instance.put('/contents', updatedState)
}

export const resetContentState = async () => {
  await instance.post('/contents/reset')
}

initServer(instance)