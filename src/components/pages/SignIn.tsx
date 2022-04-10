import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { AuthApi } from '../../api/generated/api';
import { AuthContext } from '../../contexts/AuthContext';

interface State {
  username: string;
  password: string;
  showPassword: boolean;
  error: boolean;
}

const SignIn = () => {
  const [values, setValues] = React.useState<State>({
    username: '',
    password: '',
    showPassword: false,
    error: false,
  });
  const navigate = useNavigate();
  const authApi = new AuthApi();
  const { authUser, login } = useContext(AuthContext);

  const goHome = () => {
    navigate('/home');
  };

  const goSignUp = () => {
    navigate('/');
  };

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
      await authApi.postAuthLogin(payload, { withCredentials: true });
      await login();
      goHome();
    } catch (err) {
      handleErrorOccurred();
    }
  };

  const handleOauthLogin = () => {
    window.location.href = String(process.env.REACT_APP_OAUTH_LOGIN_URL);
  };

  useEffect(() => {
    if (authUser) {
      goHome();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <img src="/auth/signin.svg" alt="Sign Up" width="440" />
        <Grid container item>
          <Button
            type="submit"
            fullWidth
            style={{ color: 'white', backgroundColor: '#00BABC' }}
            sx={{ mt: 3, mb: 2 }}
            onClick={handleOauthLogin}
          >
            SIGN UP WITH{' '}
            <img src="/auth/42.svg" alt="42" style={{ marginLeft: '24px' }} />
          </Button>
        </Grid>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="username"
                label="username"
                name="username"
                value={values.username}
                onChange={handleChange('username')}
                error={values.error}
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
                helperText={values.error ? 'Sign in failed...' : ''}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: '#448FA3' }}
              >
                SIGN IN
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  color: '#1f3242',
                  backgroundColor: '#e4dfe0',
                }}
                onClick={goSignUp}
              >
                SIGN UP
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default SignIn;
