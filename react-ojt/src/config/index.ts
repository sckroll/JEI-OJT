import { User } from "../types/User"

export const paths = [
  { path: 'tutorial', name: '튜토리얼' },
  { path: 'q1', name: '문제 1' },
  { path: 'q2', name: '문제 2' },
  { path: 'q3', name: '문제 3' },
  { path: 'q4', name: '문제 4' },
  { path: 'q5', name: '문제 5' },
  { path: 'q6', name: '문제 6' }
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