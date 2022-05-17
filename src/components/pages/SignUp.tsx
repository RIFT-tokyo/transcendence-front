import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useReducer } from 'react';
import { IconButton, Typography } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import Axios from 'axios';
import { AuthApi } from '../../api/generated/api';
import { AuthContext } from '../../contexts/AuthContext';
import { HOME_URL, SIGNIN_URL, FT_COLOR } from '../config/constants';

type State = {
  username: string;
  password: string;
  showPassword: boolean;
  error: boolean;
}

type Actions =
  | { type: 'username'; value: string }
  | { type: 'password'; value: string }
  | { type: 'showPassword'; value: boolean }
  | { type: 'error'; value: boolean };

const reducer = (state: State, action: Actions) => {
  switch (action.type) {
    case 'username':
      return { ...state, username: action.value };
    case 'password':
      return { ...state, password: action.value };
    case 'showPassword':
      return { ...state, showPassword: action.value };
    case 'error':
      return { ...state, error: action.value };
    default:
      return state;
  }
};

const authApi = new AuthApi();

const SignUp = () => {
  const navigate = useNavigate();
  const { authUser, login } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const [state, dispatch] = useReducer(reducer, {
    username: '',
    password: '',
    showPassword: false,
    error: false,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      username: state.username,
      password: state.password,
    };

    try {
      await authApi.postAuthSignup(payload, { withCredentials: true });
      await login();
      navigate(HOME_URL);
    } catch (err: unknown) {
      if (Axios.isAxiosError(err) && err.response) {
        enqueueSnackbar(err.response.data.message, { variant: 'error' });
      }
      dispatch({ type: 'error', value: true });
    }
  };

  const handleOauthLogin = () => {
    window.location.href = String(process.env.REACT_APP_OAUTH_LOGIN_URL);
  };

  useEffect(() => {
    if (authUser) {
      navigate(HOME_URL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        component="div"
        mt={10}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Typography
          variant="h2"
          color="primary"
          mb={5}
          sx={{
            fontFamily: 'Zen Tokyo Zoo',
          }}
        >
          TRANSCENDENCE
        </Typography>
        <img src="/auth/signup.svg" alt="Sign Up" height={320} />
        <Box component="form" noValidate onSubmit={handleSubmit} my={10}>
          <Grid container item spacing={2}>
            <Grid item xs={12}>
              <Button
                type="submit"
                size="large"
                fullWidth
                sx={{ color: 'white', backgroundColor: FT_COLOR }}
                onClick={handleOauthLogin}
              >
                sign up with{' '}
                <img
                  src="/auth/42.svg"
                  alt="42"
                  height={15}
                  style={{ marginLeft: 10 }}
                />
              </Button>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="username"
                label="username"
                name="username"
                value={state.username}
                onChange={(e) => dispatch({ type: 'username', value: e.target.value })}
                error={state.error}
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="password"
                label="password"
                id="password"
                value={state.password}
                onChange={(e) => dispatch({ type: 'password', value: e.target.value })}
                type={state.showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => dispatch({ type: 'showPassword', value: !state.showPassword })}
                      edge="end"
                    >
                      {state.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
                error={state.error}
                size="small"
                helperText={state.error ? 'Sign up failed...' : ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                SIGN UP
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="contained"
                color="inherit"
                onClick={() => navigate(SIGNIN_URL)}
              >
                SIGN IN
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;
