export const getUserList = async () => {
  const response = await fetch('users.json')
  const data = await response.json()
  return data
}