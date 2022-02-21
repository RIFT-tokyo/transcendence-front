import { Link, Stack, Typography } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person';
import { NavLink } from 'react-router-dom';

type Props = {
  actions: string[]
}

const SettingTab: React.VFC<Props> = ({ actions }) => {
  let settings = actions.map(item => {
    const link = '/settings/' + item.toLowerCase();
    return (
      <Link key={item.toLowerCase()} component={NavLink} color='inherit' underline='none' to={link}>
        <Stack direction='row' spacing={2}>
          <PersonIcon />
          <Typography variant='h5'>{item}</Typography>
        </Stack>
      </Link>
    )
  })

  return (
    <Stack padding={2} width={150} direction='column' spacing={1}>
      {settings}
    </Stack>
  )
}

export default SettingTab