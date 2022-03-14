import { Card, CardContent, Stack, Typography } from '@mui/material';
import { User } from '../../api/generated/api';
import FollowerStatus from './FollowerStatus';

type Props = {
  followers: User[] | null;
};

const FollowerList: React.VFC<Props> = ({ followers }) => (
    <Card
      sx={{
        width: 328,
        height: 384,
      }}
    >
      <CardContent>
        <Stack spacing={1}>
          <Typography sx={{ fontWeight: 'bold' }} variant="h5">
            Followings
          </Typography>
          {followers?.map((follower) => <FollowerStatus key={follower.id} user={follower} />)}
        </Stack>
      </CardContent>
    </Card>
  );

export default FollowerList;
