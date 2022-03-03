import { Container, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { User, UserApi } from "../../api/generated/api";
import FriendList from "../model/FriendList";
import GameResult from "../model/GameResult";
import UserCard from "../model/UserCard";
import ErrorRouter from "../ui/ErrorRouter";

const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [statusCode, setStatusCode] = useState<number>(0);
  const userApi = new UserApi();
  const username = useParams().username;

  useEffect(() => {
    (async () => {
      await userApi
        .getMe({ withCredentials: true })
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          setStatusCode(err.response.status);
        });

      if (username) {
        await userApi
          .getUsersUsername(username)
          .then((res) => {
            setUser(res.data);
            setIsOwner(res.data.id === user?.id);
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
      <Container>
        <Stack direction="row" margin={2} spacing={2}>
          <Stack direction="column" spacing={2}>
            <UserCard user={user} isOwner={isOwner} />
            <FriendList />
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
