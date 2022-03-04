import { Container, LinearProgress, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { User, UserApi, FollowApi } from "../../api/generated/api";
import FollowerList from "../model/FollowerList";
import GameResult from "../model/GameResult";
import UserCard from "../model/UserCard";
import ErrorRouter from "../ui/ErrorRouter";

const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null)
  const [followers, setFollowers] = useState<User[] | null>(null)
  const [isOwner, setIsOwner] = useState<boolean>(false)
  const [isFollower, setIsFollower] = useState<boolean>(false)
  const [statusCode, setStatusCode] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const userApi = new UserApi()
  const followApi = new FollowApi()
  const username = useParams().username

  const followUser = async () => {
    if (loading || !user?.id) {
      return
    }
    setLoading(true)
    await followApi.putUsersFollowingUserID(user.id, { withCredentials: true }).then((res) => {
      setIsFollower(true)
    }).catch((err) => {
      setStatusCode(err.response.status)
    })
    setLoading(false)
  }

  const unfollowUser = async () => {
    if (loading || !user?.id) {
      return
    }
    setLoading(true)
    await followApi.deleteUsersFollowingUserID(user.id, { withCredentials: true }).then((res) => {
      setIsFollower(false)
    }).catch((err) => {
      setStatusCode(err.response.status)
    })
    setLoading(false)
  }

  const fetchMe = async () => {
    const ownerId = await userApi.getMe({ withCredentials: true }).then((res) => {
      setUser(res.data)
      return res.data.id
    }).catch((err) => {
      setStatusCode(err.response.status)
    })
    return ownerId
  }

  const fetchUserFromUsername = async (ownerId: number, username: string) => {
    await userApi.getUsersUsername(username, { withCredentials: true }).then((res) => {
      if (!res.data.id) {
        return
      }
      if (res.data.id === ownerId) {
        setIsOwner(true)
        return fetchFollowers(ownerId)
      } else {
        setUser(res.data)
        return fetchIsFollower(ownerId, res.data.id)
      }
    }).catch((err) => {
      setStatusCode(err.response.status)
    })
  }

  const fetchFollowers = async (ownerId: number) => {
    await followApi.getUsersUserIDFollowing(ownerId, undefined, undefined, { withCredentials: true }).then((res) => {
      setFollowers(res.data)
    }).catch((err) => {
      setStatusCode(err.response.status)
    })
  }

  const fetchIsFollower = async (ownerId: number, targetId: number) => {
    await followApi.getUsersUserIDFollowingTargetUserID(ownerId, targetId, { withCredentials: true }).then((res) => {
      setIsFollower(res.status === 204)
    }).catch((err) => {
      if (err.response.status === 404) {
        setIsFollower(false)
      } else {
        setStatusCode(err.response.status)
      }
    })
  }

  useEffect(() => {
    (async () => {
      const ownerId = await fetchMe()
      if (!ownerId) {
        return
      }
      if (username) {
        await fetchUserFromUsername(ownerId, username)
      } else {
        setIsOwner(true)
        await fetchFollowers(ownerId)
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ErrorRouter statusCode={statusCode}>
      {loading ? (
        <LinearProgress
          sx={{
            width: '100%',
            position: 'absolute'
          }}
        />
      ) : null}
      <Container>
        <Stack direction="row" margin={2} spacing={2}>
          <Stack direction="column" spacing={2}>
          <UserCard
              user={user}
              isOwner={isOwner}
              isFollower={isFollower}
              loading={loading}
              followUser={followUser}
              unfollowUser={unfollowUser}
            />
          {isOwner ? <FollowerList followers={followers}/> : null}
          </Stack>
          <Stack spacing={2}>
            <GameResult />
          </Stack>
        </Stack>
      </Container>
    </ErrorRouter>
  );
};

export default UserProfile;
