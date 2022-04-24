import { Stack, Typography } from '@mui/material';
import { Achievement } from '../../api/generated';
import AchievementBadge from './AchievementBadge';

interface AchievementListProps {
  achievements: Achievement[];
}

const AchievementList = ({ achievements }: AchievementListProps) => (
  <Stack>
    <Typography sx={{ fontWeight: 'bold' }} variant="h5">
      Achievements
    </Typography>
    <Stack direction="row">
      {achievements.map((achievement) => (
        <AchievementBadge key={achievement.name} achievement={achievement} />
      ))}
    </Stack>
  </Stack>
);

export default AchievementList;
