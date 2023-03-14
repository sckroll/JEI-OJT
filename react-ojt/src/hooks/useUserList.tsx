import { useEffect, useState } from "react"

type User = {
  id: string,
  password: string
}

const useUserList = () => {
  const [userList, setUserList]  = useState<User[]>()

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch('users.json')
      const data = await response.json()
      setUserList(data)
    }
    fetchUserData()
  }, [])

  return userList
}

export default useUserList