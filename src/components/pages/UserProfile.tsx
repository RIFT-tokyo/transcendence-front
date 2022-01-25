import { Container, } from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { ResponseUser, UserApi } from '../../api/generated/api';
import UserCard from '../model/UserCard';

const UserProfile = () => {
  const [user, setUser] = useState<ResponseUser|null>(null)
  const userApi = new UserApi()
  const username = useParams().username

  useEffect(() => {
    (async () => {
      const user = await userApi.getUsersUserId(1)
      setUser(user.data)
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Container maxWidth="md">
      {username}
      <UserCard user={user} />
    </Container>
  )
}

export default UserProfile