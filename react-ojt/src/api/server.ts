import { AxiosInstance, AxiosRequestConfig } from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { AuthForm, ContentState, DBMap, SignInErrorReason } from '../types'
import { userList, initialContents } from '../config'

const AUTH_KEY = 'JEI_AUTH'
const DB_KEY = 'JEI_DB'

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

const _parseDB = () => {
  const serializedDB = localStorage.getItem(DB_KEY)
  return serializedDB && new Map<string, ContentState[]>(JSON.parse(serializedDB))
}

const _stringifyDB = (db: DBMap) => {
  const stringifiedDB = JSON.stringify(Array.from(db))
  localStorage.setItem(DB_KEY, stringifiedDB)
}

const _fetchContentsData = (id: string) => {
  const db = _parseDB()
  if (!db) return

  return db.get(id)
}

const _updateContentsData = (id: string, contents = initialContents) => {
  let db = _parseDB()
  if (!db) db = new Map<string, ContentState[]>()

  db.set(id, contents)
  _stringifyDB(db)
}

export const initServer = (instance: AxiosInstance) => {
  const mock = new MockAdapter(instance, { delayResponse: 1000 })

  mock.onPost('/sign-in').reply(async ({ data }: AxiosRequestConfig<string>) => {
    if (!data) return [500]
    
    const authForm: AuthForm = JSON.parse(data)
    const errorMessage = await _signIn(authForm)

    // 첫 로그인 시 로컬 스토리지에 DB 생성
    const id = _getCurrUserId()
    _updateContentsData(id!)
    
    const status = errorMessage ? 500 : 200
    return [status, errorMessage]
  })

  mock.onGet('/sign-out').reply(() => {
    _signOut()
    return [200]
  })

  mock.onGet('/auth-check').reply<string | null>(() => {
    const userId = _getCurrUserId()
    return [200, userId]
  })

  mock.onGet('/contents').reply(async () => {
    const id = _getCurrUserId()
    if (!id) return [500]
    
    const contentState = _fetchContentsData(id)
    return [200, contentState]
  })

  mock.onPut('/contents').reply(async ({ data }: AxiosRequestConfig<string>) => {
    if (!data) return [500]

    const id = _getCurrUserId()
    if (!id) return [500]
    
    const updatedState = JSON.parse(data)
    _updateContentsData(id, updatedState)

    return [200]
  })

  mock.onPost('/contents/reset').reply(() => {
    const id = _getCurrUserId()
    if (!id) return [500]

    _updateContentsData(id)

    return [200]
  })
}