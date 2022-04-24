import { Modal, Stack, Typography, Box } from '@mui/material';
import { useState } from 'react';
import { Achievement } from '../../api/generated';

interface AchievementBadgeProps {
  achievement: Achievement;
}

interface AchievementListProps {
  achievements: Achievement[];
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const AchievementBadge = ({ achievement }: AchievementBadgeProps) => {
  const [isOpenModal, toggleModal] = useState(false);
  return (
    <Stack paddingRight={0.5}>
      <Stack onClick={() => toggleModal(true)}>
        <img
          width={60}
          height={60}
          src={achievement.image}
          alt={achievement.name}
        />
      </Stack>
      <Modal open={isOpenModal} onClose={() => toggleModal(false)}>
        <Box sx={style}>
          <Stack direction="row" alignItems="center">
            <img
              width={100}
              height={100}
              src={achievement.image}
              alt={achievement.name}
            />
            <Stack>
              <Typography variant="h3">{achievement.name}</Typography>
              <Typography variant="body1">{achievement.description}</Typography>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </Stack>
  );
};

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
