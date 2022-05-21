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
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_IS_OWNER'; payload: boolean }
  | { type: 'SET_IS_FOLLOWING'; payload: boolean }
  | { type: 'SET_STATUS_CODE'; payload: number }
  | { type: 'LOADING' };

const reducer = (state: State, action: Actions) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_IS_OWNER':
      return { ...state, isOwner: action.payload };
    case 'SET_IS_FOLLOWING':
      return { ...state, isFollowing: action.payload };
    case 'SET_STATUS_CODE':
      return { ...state, statusCode: action.payload };
    case 'LOADING':
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
    dispatch({ type: 'LOADING' });
    try {
      await followApi.putUsersFollowingUserID(userId, {
        withCredentials: true,
      });
      dispatch({ type: 'SET_IS_FOLLOWING', payload: true });
    } catch (err: unknown) {
      if (Axios.isAxiosError(err) && err.response) {
        enqueueSnackbar(err.message, { variant: 'error' });
      }
    }
    dispatch({ type: 'LOADING' });
  };

  const unfollowUser = async (userId: number) => {
    if (state.isLoading) {
      return;
    }
    dispatch({ type: 'LOADING' });
    try {
      await followApi.deleteUsersFollowingUserID(userId, {
        withCredentials: true,
      });
      dispatch({ type: 'SET_IS_FOLLOWING', payload: false });
    } catch (err: unknown) {
      if (Axios.isAxiosError(err) && err.response) {
        enqueueSnackbar(err.message, { variant: 'error' });
      }
    }
    dispatch({ type: 'LOADING' });
  };

  const fetchIsFollower = async (ownerId: number, targetId: number) => {
    try {
      const res = await followApi.getUsersUserIDFollowingTargetUserID(
        ownerId,
        targetId,
        { withCredentials: true },
      );
      dispatch({ type: 'SET_IS_FOLLOWING', payload: res.status === 204});
    } catch (err: unknown) {
      if (Axios.isAxiosError(err) && err.response) {
        if (err.response?.status === 404) {
          dispatch({ type: 'SET_IS_FOLLOWING', payload: false });
        } else {
          dispatch({ type: 'SET_STATUS_CODE', payload: err.response?.status });
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
      dispatch({ type: 'SET_USER', payload: res.data });
      fetchIsFollower(ownerId, res.data.id);
    } catch (err: unknown) {
      if (Axios.isAxiosError(err) && err.response) {
        dispatch({ type: 'SET_STATUS_CODE', payload: err.response?.status });
      }
    }
  };

  const fetchMe = async () => {
    try {
      const res = await userApi.getMe({ withCredentials: true });
      dispatch({ type: 'SET_USER', payload: res.data });
      setAuthUser(res.data);
    } catch (err: unknown) {
      if (Axios.isAxiosError(err) && err.response) {
        dispatch({ type: 'SET_STATUS_CODE', payload: err.response?.status });
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
        dispatch({ type: 'SET_IS_OWNER', payload: false });
      } else {
        await fetchMe();
        dispatch({ type: 'SET_IS_OWNER', payload: true });
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
