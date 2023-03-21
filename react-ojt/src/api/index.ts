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

export const getContentState = async (id: string) => {
  const { data } = await instance.get<ContentState[]>('/contents', { params: id })
  return data
}

export const setContentState = async (id: string, contentState: ContentState[]) => {
  await instance.post('/contents', { id, contentState })
}

initServer(instance)