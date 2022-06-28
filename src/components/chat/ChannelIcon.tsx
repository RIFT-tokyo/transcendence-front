import TagIcon from '@mui/icons-material/Tag';
import LockIcon from '@mui/icons-material/Lock';

type Props = {
  isProtected: boolean;
};

const ChannelIcon = (props: Props) => {
  const { isProtected } = props;

  if (isProtected) {
    return <LockIcon />;
  }
  return <TagIcon />;
};

export default ChannelIcon;
