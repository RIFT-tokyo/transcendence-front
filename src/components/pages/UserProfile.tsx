import { Container, Stack } from "@mui/material";
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
  const [ownerId, setOwnerId] = useState<number>(0)
  const [isOwner, setIsOwner] = useState<boolean>(false)
  const [isFollower, setIsFollower] = useState<boolean>(false)
  const [statusCode, setStatusCode] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const userApi = new UserApi()
  const followApi = new FollowApi()
  const username = useParams().username

  const followUser = async () => {
    if (loading) {
      return
    }
    setLoading(true)
    await followApi.putUsersFollowingUserID(ownerId).then((res) => {
      setIsFollower(true)
    }).catch((err) => {
      setStatusCode(err.response.status)
    })
    setLoading(false)
  }

  const unfollowUser = async () => {
    if (loading) {
      return
    }
    setLoading(true)
    await followApi.deleteUsersFollowingUserID(ownerId).then((res) => {
      setIsFollower(false)
    }).catch((err) => {
      setStatusCode(err.response.status)
    })
    setLoading(false)
  }

  useEffect(() => {
    (async () => {
      await userApi.getMe({ withCredentials: true }).then((res) => {
        setUser(res.data)
        if (res.data.id) {
          setOwnerId(res.data.id)
        }
        return res.data.id ? followApi.getUsersUserIDFollowing(res.data.id) : null
      }).then((res) => {
        if (res) {
          setFollowers(res.data)
        }
      }).catch((err) => {
        setStatusCode(err.response.status)
      })
      if (username) {
        await userApi
          .getUsersUsername(username)
          .then((res) => {
            setUser(res.data)
            if (res.data.id === user?.id) {
              setIsOwner(true)
            } else {
              setIsFollower(followers?.some((follower) => user?.id === follower.id) ?? false)
            }
          }).catch((err) => {
            setStatusCode(err.response.status)
          })
          .catch((err) => {
            setStatusCode(err.response.status);
          });
      } else {
        setIsOwner(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ErrorRouter statusCode={statusCode}>
      {loading ? <LinearProgress sx={{
        width: '100%',
        position: 'absolute'
      }}
      /> : null}
      <Container>
        <Stack direction="row" margin={2} spacing={2}>
          <Stack direction="column" spacing={2}>
          <UserCard user={user} isOwner={isOwner} isFollower={isFollower} loading={loading} followUser={followUser} unfollowUser={unfollowUser} />
            <FollowerList followers={followers}/>
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
