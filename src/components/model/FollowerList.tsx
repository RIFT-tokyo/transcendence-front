import { Stack, Typography } from '@mui/material';
import * as React from 'react';
import { User } from '../../api/generated/api';
import FollowerStatus from './FollowerStatus';

type Props = {
  followers: User[] | null;
};

const FollowerList: React.VFC<Props> = ({ followers }: Props) => (
    <Stack
      sx={{
        height: 384,
      }}
    >
      <Typography sx={{ fontWeight: 'bold' }} variant="h5">Followings</Typography>
      {followers?.map((follower) => <FollowerStatus key={follower.id} user={follower} />)}
    </Stack>
  );

export default FollowerList;
