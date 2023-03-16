import { getCurrUserId } from './auth';
import { ContentState } from "../types/User"

type DBMap = Map<string, ContentState[]>

const DB_KEY = 'JEI_DB'
const initialContentsData: ContentState[] = [
  { id: 1, path: 'q1', name: '문제 1', state: 'unknown' },
  { id: 2, path: 'q2', name: '문제 2', state: 'unknown' },
  { id: 3, path: 'q3', name: '문제 3', state: 'unknown' },
  { id: 4, path: 'q4', name: '문제 4', state: 'unknown' },
  { id: 5, path: 'q5', name: '문제 5', state: 'unknown' },
  { id: 6, path: 'q6', name: '문제 6', state: 'unknown' }
]

export const getUserList = async () => {
  const response = await fetch('users.json')
  const userList = await response.json()
  return userList
}

const parseDB = () => {
  const serializedDB = localStorage.getItem(DB_KEY)
  if (serializedDB) {
    return new Map<string, ContentState[]>(JSON.parse(serializedDB))
  } else {
    return new Map([[getCurrUserId(), initialContentsData]])
  }
}
const stringifyDB = (db: DBMap) => {
  const stringifiedDB = JSON.stringify(Array.from(db))
  localStorage.setItem(DB_KEY, stringifiedDB)
}

export const fetchContentsData = (id: string) => {
  const db = parseDB()
  return db.get(id)
}

export const updateContentsData = (id: string, contents: ContentState[]) => {
  const db = parseDB()
  db.set(id, contents)
  stringifyDB(db)
}