const STORAGE_KEY = 'JEI_AUTH'

export const signIn = (id: string) => {
  localStorage.setItem(STORAGE_KEY, id)
}

export const signOut = () => {
  localStorage.removeItem(STORAGE_KEY)
}