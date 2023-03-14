import { useEffect, useState } from "react"
import { getUserList } from "../api/users"

type User = {
  id: string,
  password: string
}

const useUserList = () => {
  const [userList, setUserList]  = useState<User[]>()

  useEffect(() => {
    const fetchUserList = async () => {
      const userListData = await getUserList()
      setUserList(userListData)
    }
    fetchUserList()
  }, [])

  return userList
}

export default useUserList