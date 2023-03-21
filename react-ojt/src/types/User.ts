export enum SignInErrorReason {
  EMPTY_ID = '아이디를 입력해주세요.',
  EMPTY_PASSWORD = '비밀번호를 입력해주세요.',
  USER_NOT_FOUND = '올바르지 않은 아이디에요.',
  WRONG_PASSWORD = '비밀번호를 확인해주세요.',
  UNKNOWN = '잠시 후에 다시 시도해주세요.'
}

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