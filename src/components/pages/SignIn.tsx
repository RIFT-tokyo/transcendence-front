import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import { AuthApi, UserApi } from "../../api/generated/api";
import { useEffect } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton } from "@mui/material";

interface State {
  username: string;
  password: string;
  showPassword: boolean;
}

export default function SignIn() {
  const [values, setValues] = React.useState<State>({
    username: "",
    password: "",
    showPassword: false,
  });
  const navigate = useNavigate();
  const authApi = new AuthApi();
  const userApi = new UserApi();

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      username: values.username,
      password: values.password,
    };

    console.log(payload);
    await authApi
      .postAuthLogin(payload, { withCredentials: true })
      .then((res) => {
        console.log(res);
        goHome();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleOauthLogin = () => {
    window.location.href = String(process.env.REACT_APP_OAUTH_LOGIN_URL);
  };

  const goHome = () => {
    navigate("/home");
  };

  const handleClick = () => {
    navigate("/");
  };

  useEffect(() => {
    (async () => {
      await userApi
        .getMe({ withCredentials: true })
        .then((res) => {
          console.log(res.status);
          console.log("まぎまぎまぎまぎ");
          goHome();
        })
        .catch((err) => {
          console.log("まぎまぎまぎみねみね");
          console.log(err);
        });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img src="/auth/signin.svg" alt="Sign Up" width="440" />
        <Grid container item>
          <Button
            type="submit"
            fullWidth
            style={{ color: "white", backgroundColor: "#00BABC" }}
            sx={{ mt: 3, mb: 2 }}
            onClick={handleOauthLogin}
          >
            SIGN UP WITH{" "}
            <img src="/auth/42.svg" alt="42" style={{ marginLeft: "24px" }} />
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
                onChange={handleChange("username")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="password"
                label="password"
                id="password"
                value={values.password}
                onChange={handleChange("password")}
                type={values.showPassword ? "text" : "password"}
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
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: "#448FA3" }}
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
                  color: "#1f3242",
                  backgroundColor: "#e4dfe0",
                }}
                onClick={handleClick}
              >
                SIGN UP
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
