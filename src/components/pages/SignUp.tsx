import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import { UserApi } from "../../api/generated/api";
import { useEffect } from "react";

export default function SignUp() {
  const navigate = useNavigate();
  const userApi = new UserApi();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload = {
      username: data.get("username")!.toString(),
      password: data.get("password")!.toString(),
    };
    await userApi
      .postUsers(payload)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleOauthLogin = () => {
    window.location.href = "http://localhost:4211/api/auth/login";
  };

  const goHome = () => {
    navigate("/home");
  };

  const handleClick = () => {
    navigate("/signin");
  };

  useEffect(() => {
    (async () => {
      await userApi
        .getUsers(0, 0, { withCredentials: true }) // getMe()の方が良い
        .then((res) => {
          if (res.status === 200) {
            goHome();
          }
        })
        .catch((err) => {
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
        <img src="/auth/signup.svg" alt="Sign Up" height="320" />
        <Grid container item sm={11}>
          <Button
            type="submit"
            fullWidth
            sx={{ mt: 3, mb: 2, color: "white", backgroundColor: "#00BABC" }}
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
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="password"
                label="password"
                type="password"
                id="password"
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
                SIGN UP
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
                SIGN IN
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
