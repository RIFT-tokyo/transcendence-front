import { Stack, Typography } from '@mui/material';
import { Achievement } from '../../api/generated';

interface AchievementBadgeProps {
  achievement: Achievement;
}

interface AchievementListProps {
  achievements: Achievement[];
}

const AchievementBadge = ({ achievement }: AchievementBadgeProps) => (
  <Stack paddingRight={0.5}>
    <img width={60} height={60} src={achievement.image} alt={achievement.name} />
  </Stack>
);

const AchievementList = ({ achievements }: AchievementListProps) => (
  <Stack>
    <Typography sx={{ fontWeight: 'bold' }} variant='h5'>Achievements</Typography>
    <Stack direction="row">
      {achievements.map((achievement) => <AchievementBadge key={achievement.name} achievement={achievement} />)}
    </Stack>
  </Stack>
)

export default AchievementList;
