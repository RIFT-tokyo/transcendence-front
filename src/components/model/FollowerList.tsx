import { Card, CardContent, Stack, Typography } from "@mui/material"
import { User } from "../../api/generated/api"
import FollowerStatus from "./FollowerStatus"

const FollowerList: React.VFC<{ followers: User[] | null }> = ({
  followers
}) => {
  return (
    <Card sx={{
      width: 328,
      height: 384,
    }}>
      <CardContent>
        <Stack spacing={1}>
          <Typography sx={{ fontWeight: "bold" }} variant="h5">
            Followings
          </Typography>
          {followers?.map((follower) => {
            return <FollowerStatus key={follower.id} user={follower}/>;
          })}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default FollowerList