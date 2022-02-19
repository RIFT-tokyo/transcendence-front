import { Avatar, Divider, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { ResponseUser } from '../../api/generated/api'

const AccountSetting: React.VFC<{user: ResponseUser}> = ({ user }) => {
  const [username, setUsername] = useState(user.username)
  const [displayName, setDisplayName] = useState(user.display_name)
  const [statusMessage, setStatusMessage] = useState(user.status_message)

  const usernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }
  const displayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayName(e.target.value)
  }
  const statusMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatusMessage(e.target.value)
  }

  return (
    <Stack bgcolor='background.paper' width={500}>
      <Stack padding={2} direction='column' spacing={1}>
        <Typography variant='h4'>Account</Typography>
        <Divider />
        <Typography variant='h6'>Profile Image</Typography>
        <Avatar sx={{ width: 296, height: 296 }} src={user.profile_image}/>
        <Typography variant='h6'>Username</Typography>
        <TextField size='small' variant='outlined' value={username} onChange={usernameChange} />
        <Typography variant='h6'>Display Name</Typography>
        <TextField size='small' variant='outlined' value={displayName} onChange={displayNameChange} />
        <Typography variant='h6'>Bio</Typography>
        <TextField size='small' variant='outlined' value={statusMessage} onChange={statusMessageChange} />
      </Stack>
    </Stack>
  )
}

export default AccountSetting