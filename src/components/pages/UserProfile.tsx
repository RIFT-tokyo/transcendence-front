import { Container, } from '@mui/material'
import { useEffect, useState } from 'react'
import { User, UserApi } from '../../api/generated/api';
import UserCard from '../model/UserCard';

const UserProfile = () => {
  const [user, setUser] = useState<User|null>(null)
  const userApi = new UserApi()

  useEffect(() => {
    (async () => {
      const user = await userApi.getUsersUserId(1)
      setUser(user.data)
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Container maxWidth="md">
      <UserCard user={user} />
    </Container>
  )
}

export default UserProfile