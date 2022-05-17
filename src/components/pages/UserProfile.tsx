import { Container, Divider, LinearProgress, Stack } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useContext, useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import Axios from 'axios';
import { User, UserApi, FollowApi } from '../../api/generated/api';
import { AuthContext } from '../../contexts/AuthContext';
import AchievementList from '../model/AchievementList';
import FollowingList from '../model/FollowingList';
import GameResult from '../model/GameResult';
import UserCard from '../model/UserCard';
import ErrorRouter from '../ui/ErrorRouter';

type State = {
  user: User | null;
  isOwner: boolean;
  isFollowing: boolean;
  statusCode: number;
  isLoading: boolean;
};

type Actions =
  | { type: 'user'; value: User }
  | { type: 'isOwner'; value: boolean }
  | { type: 'isFollowing'; value: boolean }
  | { type: 'statusCode'; value: number }
  | { type: 'loading' };

const reducer = (state: State, action: Actions) => {
  switch (action.type) {
    case 'user':
      return { ...state, user: action.value };
    case 'isOwner':
      return { ...state, isOwner: action.value };
    case 'isFollowing':
      return { ...state, isFollowing: action.value };
    case 'statusCode':
      return { ...state, statusCode: action.value };
    case 'loading':
      return { ...state, isLoading: !state.isLoading };
    default:
      return state;
  }
};

const userApi = new UserApi();
const followApi = new FollowApi();

const UserProfile = () => {
  const { username } = useParams();
  const { authUser, setAuthUser } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  const [state, dispatch] = useReducer(reducer, {
    user: null,
    isOwner: false,
    isFollowing: false,
    statusCode: 0,
    isLoading: false,
  });

  const followUser = async (userId: number) => {
    if (state.isLoading) {
      return;
    }
    dispatch({ type: 'loading' });
    try {
      await followApi.putUsersFollowingUserID(userId, {
        withCredentials: true,
      });
      dispatch({ type: 'isFollowing', value: true });
    } catch (err: unknown) {
      if (Axios.isAxiosError(err) && err.response) {
        enqueueSnackbar(err.message, { variant: 'error' });
      }
    }
    dispatch({ type: 'loading' });
  };

  const unfollowUser = async (userId: number) => {
    if (state.isLoading) {
      return;
    }
    dispatch({ type: 'loading' });
    try {
      await followApi.deleteUsersFollowingUserID(userId, {
        withCredentials: true,
      });
      dispatch({ type: 'isFollowing', value: false });
    } catch (err: unknown) {
      if (Axios.isAxiosError(err) && err.response) {
        enqueueSnackbar(err.message, { variant: 'error' });
      }
    }
    dispatch({ type: 'loading' });
  };

  const fetchIsFollower = async (ownerId: number, targetId: number) => {
    try {
      const res = await followApi.getUsersUserIDFollowingTargetUserID(
        ownerId,
        targetId,
        { withCredentials: true },
      );
      dispatch({ type: 'isFollowing', value: res.status === 204});
    } catch (err: unknown) {
      if (Axios.isAxiosError(err) && err.response) {
        if (err.response?.status === 404) {
          dispatch({ type: 'isFollowing', value: false });
        } else {
          dispatch({ type: 'statusCode', value: err.response?.status });
        }
      }
    }
  };

  const fetchUserFromUsername = async (ownerId: number, name: string) => {
    try {
      const res = await userApi.getUsersUsername(name, {
        withCredentials: true,
      });
      if (!res.data.id) {
        return;
      }
      dispatch({ type: 'user', value: res.data });
      fetchIsFollower(ownerId, res.data.id);
    } catch (err: unknown) {
      if (Axios.isAxiosError(err) && err.response) {
        dispatch({ type: 'statusCode', value: err.response?.status });
      }
    }
  };

  const fetchMe = async () => {
    try {
      const res = await userApi.getMe({ withCredentials: true });
      dispatch({ type: 'user', value: res.data });
      setAuthUser(res.data);
    } catch (err: unknown) {
      if (Axios.isAxiosError(err) && err.response) {
        dispatch({ type: 'statusCode', value: err.response?.status });
      }
    }
  };

  useEffect(() => {
    (async () => {
      if (!authUser || !authUser.id) {
        return;
      }
      if (username && authUser.username !== username) {
        fetchUserFromUsername(authUser.id, username);
        dispatch({ type: 'isOwner', value: false });
      } else {
        await fetchMe();
        dispatch({ type: 'isOwner', value: true });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  return (
    <ErrorRouter statusCode={state.statusCode}>
      {state.isLoading ? (
        <LinearProgress
          sx={{
            width: '100%',
            position: 'absolute',
          }}
        />
      ) : null}
      <Container component="main">
        <Stack direction="row">
          <Stack direction="column" margin={2} spacing={2} width={296}>
            <UserCard
              user={state.user}
              isOwner={state.isOwner}
              isFollower={state.isFollowing}
              disabled={state.isLoading}
              followUser={followUser}
              unfollowUser={unfollowUser}
            />
            {state.isOwner && authUser?.id && <FollowingList ownerId={authUser.id} />}
            {state.user?.achievements && state.user.achievements.length > 0 && (
              <AchievementList achievements={state.user.achievements} />
            )}
          </Stack>
          <Divider orientation="vertical" flexItem variant="middle" />
          <Stack margin={2} width="100%">
            <GameResult />
          </Stack>
        </Stack>
      </Container>
    </ErrorRouter>
  );
};

export default UserProfile;
