const AUTH_KEY = 'JEI_AUTH'

export const signIn = (id: string) => {
  localStorage.setItem(AUTH_KEY, id)
}

export const signOut = () => {
  localStorage.removeItem(AUTH_KEY)
}

export const isSignedIn = () => {
  return !!localStorage.getItem(AUTH_KEY)
}

export const getCurrUserId = () => {
  return localStorage.getItem(AUTH_KEY) ?? ''
}