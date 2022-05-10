import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { IconButton, Typography } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { AuthApi } from '../../api/generated/api';
import { AuthContext } from '../../contexts/AuthContext';
import { HOME_URL, SIGNIN_URL, FT_COLOR } from '../config/constants';

interface State {
  username: string;
  password: string;
  showPassword: boolean;
  error: boolean;
}

const SignUp = () => {
  const [values, setValues] = React.useState<State>({
    username: '',
    password: '',
    showPassword: false,
    error: false,
  });
  const navigate = useNavigate();
  const authApi = new AuthApi();
  const { authUser, login } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleErrorOccurred = () => {
    setValues({
      ...values,
      error: true,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      username: values.username,
      password: values.password,
    };

    try {
      await authApi.postAuthSignup(payload, { withCredentials: true });
      await login();
      navigate(HOME_URL);
    } catch (err: any) {
      enqueueSnackbar(err.response.data.message, { variant: 'error' });
      handleErrorOccurred();
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
                value={values.username}
                onChange={handleChange('username')}
                error={values.error}
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="password"
                label="password"
                id="password"
                value={values.password}
                onChange={handleChange('password')}
                type={values.showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {values.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
                error={values.error}
                size="small"
                helperText={values.error ? 'Sign up failed...' : ''}
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
