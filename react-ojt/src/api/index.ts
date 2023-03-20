import axios from 'axios'
import { AuthForm } from '../types/User'
import { initServer } from './server'

const instance = axios.create()

export const signIn = (authForm: AuthForm) => instance.post('/signIn', authForm)
export const signOut = () => instance.get('/signOut')

initServer(instance)