import { Container, LinearProgress, Stack } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { User, UserApi, FollowApi } from '../../api/generated/api';
import { AuthContext } from '../../contexts/AuthContext';
import FollowerList from '../model/FollowerList';
import GameResult from '../model/GameResult';
import UserCard from '../model/UserCard';
import ErrorRouter from '../ui/ErrorRouter';

const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [followers, setFollowers] = useState<User[] | null>(null);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isFollower, setIsFollower] = useState<boolean>(false);
  const [statusCode, setStatusCode] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const userApi = new UserApi();
  const followApi = new FollowApi();
  const { username } = useParams();
  const { currentUser } = useContext(AuthContext);

  const followUser = async (userId: number) => {
    if (loading) {
      return;
    }
    setLoading(true);
    await followApi
      .putUsersFollowingUserID(userId, { withCredentials: true })
      .then(() => {
        setIsFollower(true);
      })
      .catch((err) => {
        setStatusCode(err.response.status);
      });
    setLoading(false);
  };

  const unfollowUser = async (userId: number) => {
    if (loading) {
      return;
    }
    setLoading(true);
    await followApi
      .deleteUsersFollowingUserID(userId, { withCredentials: true })
      .then(() => {
        setIsFollower(false);
      })
      .catch((err) => {
        setStatusCode(err.response.status);
      });
    setLoading(false);
  };

  const fetchIsFollower = async (ownerId: number, targetId: number) => {
    await followApi
      .getUsersUserIDFollowingTargetUserID(ownerId, targetId, {
        withCredentials: true,
      })
      .then((res) => {
        setIsFollower(res.status === 204);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setIsFollower(false);
        } else {
          setStatusCode(err.response.status);
        }
      });
  };

  const fetchUserFromUsername = async (ownerId: number, name: string) => {
    await userApi
      .getUsersUsername(name, { withCredentials: true })
      .then((res) => {
        if (!res.data.id) {
          return;
        }
        setUser(res.data);
        fetchIsFollower(ownerId, res.data.id);
      })
      .catch((err) => {
        setStatusCode(err.response.status);
      });
  };

  const fetchFollowings = async (ownerId: number) => {
    await followApi
      .getUsersUserIDFollowing(ownerId, undefined, undefined, {
        withCredentials: true,
      })
      .then((res) => {
        setFollowers(res.data);
      })
      .catch((err) => {
        setStatusCode(err.response.status);
      });
  };

  useEffect(() => {
    (async () => {
      const owner = currentUser!;
      if (username && owner.username !== username) {
        await fetchUserFromUsername(owner.id!, username);
        setIsOwner(false);
      } else {
        setUser(owner);
        setIsOwner(true);
        fetchFollowings(owner.id);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  return (
    <ErrorRouter statusCode={statusCode}>
      {loading ? (
        <LinearProgress
          sx={{
            width: '100%',
            position: 'absolute',
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
            {isOwner ? <FollowerList followers={followers} /> : null}
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
