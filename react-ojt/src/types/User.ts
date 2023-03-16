export type User = {
  id: string,
  password: string,
  name: string
}

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