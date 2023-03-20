export type User = {
  id: string,
  password: string,
  name: string
}

export type AuthForm = Omit<User, 'name'>

export interface ContentState {
  id: number,
  path: string,
  name: string,
  state: 'success' | 'failure' | 'unknown'
}

export type UserContentStats = {
  id: string,
  contentStates: ContentState[]
}