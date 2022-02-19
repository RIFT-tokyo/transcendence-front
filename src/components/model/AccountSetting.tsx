import { Avatar, Divider, Stack, TextField, Typography } from '@mui/material'
// import { useState } from 'react'
import { ResponseUser } from '../../api/generated/api'

const AccountSetting: React.VFC<{user: ResponseUser}> = ({ user }) => {
  // const [username, setUsername] = useState(user.username)
  // const [displayName, setDisplayName] = useState(user.display_name)
  // const [statusMessage, setStatusMessage] = useState(user.status_message)

  return (
    <Stack bgcolor='background.paper' width={500}>
      <Stack padding={2} direction='column' spacing={1}>
        <Typography variant='h4'>Account</Typography>
        <Divider />
        <Typography variant='h6'>Profile Image</Typography>
        <Avatar sx={{ width: 296, height: 296 }} />
        <Typography variant='h6'>Username</Typography>
        <TextField size='small' label='Username' variant='outlined' />
        <Typography variant='h6'>Display Name</Typography>
        <TextField size='small' label='Display Name' variant='outlined' />
        <Typography variant='h6'>Bio</Typography>
        <TextField size='small' label='Bio' variant='outlined' />
      </Stack>
    </Stack>
  )
}

export default AccountSetting