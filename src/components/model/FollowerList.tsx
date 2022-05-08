import { Stack, Typography } from '@mui/material';
import * as React from 'react';
import { User } from '../../api/generated/api';
import FollowerStatus from './FollowerStatus';

type Props = {
  followers: User[];
};

const FollowerList: React.VFC<Props> = ({ followers }: Props) => (
  <Stack>
    <Typography sx={{ fontWeight: 'bold' }} variant="h5">
      Followings
    </Typography>
    <Stack
      maxHeight={256}
      sx={{ overflowY: 'auto' }}
    >
      {followers?.map((follower) => (
        <FollowerStatus key={follower.id} user={follower} />
      ))}
    </Stack>
  </Stack>
);

export default FollowerList;
