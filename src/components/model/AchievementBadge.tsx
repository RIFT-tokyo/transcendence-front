import { Stack, Modal, Box, Typography } from '@mui/material';
import { useState } from 'react';
import { Achievement } from '../../api/generated';

interface AchievementBadgeProps {
  achievement: Achievement;
}

const style = {
  position: 'absolute' as const,
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
        <Box
          width={60}
          height={60}
          component="img"
          alt={achievement.name}
          src={achievement.image}
        />
      </Stack>
      <Modal open={isOpenModal} onClose={() => toggleModal(false)}>
        <Box component="div" sx={style}>
          <Stack direction="row" alignItems="center">
            <Box
              width={100}
              height={100}
              component="img"
              alt={achievement.name}
              src={achievement.image}
            />
            <Stack margin={1}>
              <Typography variant="h3">{achievement.name}</Typography>
              <Typography variant="body1">{achievement.description}</Typography>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </Stack>
  );
};

export default AchievementBadge;
