import { User, ContentState } from "../types"

export const initialContents: ContentState[] = [
  { id: 0, path: 'tutorial', name: '튜토리얼', state: 'unknown' },
  { id: 1, path: 'q1', name: '문제 1', state: 'unknown' },
  { id: 2, path: 'q2', name: '문제 2', state: 'unknown' },
  { id: 3, path: 'q3', name: '문제 3', state: 'unknown' },
  { id: 4, path: 'q4', name: '문제 4', state: 'unknown' },
  { id: 5, path: 'q5', name: '문제 5', state: 'unknown' },
  { id: 6, path: 'q6', name: '문제 6', state: 'unknown' }
]

export const userList: User[] = [
  {
    "id": "test",
    "password": "test1234",
    "name": "김성찬"
  }, {
    "id": "admin",
    "password": "admin",
    "name": "관리자"
  }
]