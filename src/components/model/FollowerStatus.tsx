import { Avatar, Badge, Link, Stack, styled, Typography } from "@mui/material";
import { User, UserStatusEnum } from "../../api/generated/api";
import ChatBubble from "@mui/icons-material/ChatBubble";
import { NavLink } from "react-router-dom";

type Props = {
  user: User | null
}

const FollowerStatus: React.VFC<Props> = ({ user }) => {
  const selectBadgeColor = (status?: UserStatusEnum): "success" | "error" | "neutral" => {
    switch (status) {
      case UserStatusEnum.Online:
        return "success"
      case UserStatusEnum.Game:
        return "error"
      default:
        return "neutral"
    }
  }

  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    }
  }))

  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      justifyContent="space-between"
    >
      <Link component={NavLink} to={`/users/${user?.username}`}>
        <StyledBadge
          color={selectBadgeColor(user?.status)}
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
        >
          <Avatar sx={{ width: 40, height: 40 }} src={user?.profile_image} />
        </StyledBadge>
      </Link>
      <Stack sx={{ flexGrow: 1 }} direction="column">
        <Typography sx={{ fontWeight: "bold" }}>
          {user?.display_name ?? user?.username}
        </Typography>
        <Typography variant="body2">{user?.status_message}</Typography>
      </Stack>
      <ChatBubble sx={{ fontSize: 24 }} color="disabled" />
    </Stack>
  );
};

export default FollowerStatus;
