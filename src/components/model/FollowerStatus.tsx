import { Avatar, Badge, Stack, Typography } from "@mui/material";
import { User } from "../../api/generated/api";
import ChatBubble from "@mui/icons-material/ChatBubble";

const FollowerStatus: React.VFC<{ user: User | null }> = ({ user }) => {
  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      justifyContent="space-between"
    >
      <Badge
        color="success"
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        variant="dot"
      >
        <Avatar sx={{ width: 40, height: 40 }} src={user?.profile_image} />
      </Badge>
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
