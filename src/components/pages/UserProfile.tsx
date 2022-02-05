import { Container, Stack, } from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom';
import { ResponseUser, UserApi } from '../../api/generated/api';
import FriendList from '../model/FriendList';
import GameResult from '../model/GameResult';
import UserCard from '../model/UserCard';

const UserProfile = () => {
  const [user, setUser] = useState<ResponseUser|null>(null)
  const [error, setError] = useState<string|null>(null)
  const userApi = new UserApi()
  const username = useParams().username

  useEffect(() => {
    (async () => {
      if (username) {
        await userApi.getUsersUsername(username).then((res) => {
          setUser(res.data)
        }).catch((err) => {
          setError(err.message)
        })
      } else {
        // 本当はここでログインユーザー情報を取得する
        // await userApi.getMe().then((res) => {
        await userApi.getUsersUserId(1).then((res) => {
          setUser(res.data)
        }).catch((err) => {
          setError(err.message)
        })
      }
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Container>
      <Stack direction='row' margin={2} spacing={2}>
        <Stack direction='column' spacing={2}>
          { !error ? <UserCard user={user}/> : <Navigate to="404"/> }
          <FriendList />
        </Stack>
        <Stack spacing={2}>
          <GameResult/>
        </Stack>
      </Stack>
    </Container>
  )
}

export default UserProfile