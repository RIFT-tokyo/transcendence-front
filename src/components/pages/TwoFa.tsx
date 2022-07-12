import { FormEvent, useContext, useEffect, useReducer } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import { AuthApi } from '../../api/generated/api';
import { AuthContext } from '../../contexts/AuthContext';
import { HOME_URL } from '../config/constants';

type State = {
  code: string;
  error: boolean;
};

type Actions = { type: 'SET_CODE'; payload: string } | { type: 'ERROR' };

const reducer = (state: State, action: Actions) => {
  switch (action.type) {
    case 'SET_CODE':
      return { ...state, code: action.payload };
    case 'ERROR':
      return { ...state, error: true };
    default:
      return state;
  }
};

const authApi = new AuthApi();

const TwoFa = () => {
  const navigate = useNavigate();
  const { authUser, login } = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, {
    code: '',
    error: false,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      authcode: state.code,
    };
    try {
      await authApi.postAuth2faVerify(payload, { withCredentials: true });
      await login();
      navigate(HOME_URL);
    } catch (err) {
      dispatch({ type: 'ERROR' });
    }
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
        <img src="/auth/twofa.svg" alt="Two-factor authentication" height={320} />
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="code"
                label="6 digits code"
                id="code"
                value={state.code}
                onChange={(e) =>
                  dispatch({ type: 'SET_CODE', payload: e.target.value })
                }
                type="text"
                error={state.error}
                size="small"
                helperText={state.error ? 'Two-factor authentication failed...' : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                SUBMIT
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default TwoFa;
