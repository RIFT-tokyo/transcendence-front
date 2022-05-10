import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Avatar,
  Stack,
  Link,
} from '@mui/material';
import { useCallback, useState } from 'react';
import { format } from 'date-fns';
import { NavLink } from 'react-router-dom';
import { Match, MatchApi } from '../../api/generated';
import stringToColor from '../../functions/stringToColor';
import ScrollObserver from '../ui/ScrollObserver';

const MatchHistory = () => {
  const [offset, setOffset] = useState(0);
  const [isActiveObserver, setIsActiveObserver] = useState(true);
  const [matches, setMatches] = useState<Match[]>([]);
  const matchApi = new MatchApi();

  const fetchNextMatches = useCallback(async () => {
    const { data } = await matchApi.getMatches(undefined, offset, {
      withCredentials: true,
    });
    if (data.has_next === false) {
      setIsActiveObserver(false);
    }
    setOffset((prev) => prev + 10);
    setMatches((prev) => [...prev, ...(data.entries || [])]);
  }, [offset, matches]);

  return (
    <TableContainer sx={{ height: 700 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="h6">Host Player</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">Guest Player</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">Points</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">Date</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ overflowY: 'auto' }}>
          {matches?.map((match) => (
            <TableRow key={match.id}>
              <TableCell>
                <Link
                  component={NavLink}
                  underline="none"
                  color="inherit"
                  to={`/users/${match.host_player?.username}`}
                >
                  <Stack direction="row" alignItems="center">
                    <Avatar
                      sx={{
                        width: 30,
                        height: 30,
                        bgcolor: match.host_player?.profile_image
                          ? undefined
                          : stringToColor(match.host_player?.username ?? ''),
                      }}
                      src={match.host_player?.profile_image}
                    >
                      {match.host_player?.username?.slice(0, 2) ?? ''}
                    </Avatar>
                    <Typography
                      padding={1}
                      variant="body1"
                      sx={{
                        fontWeight:
                          match.result === 'host' ? 'bold' : undefined,
                      }}
                    >
                      {match.host_player?.username}
                    </Typography>
                  </Stack>
                </Link>
              </TableCell>
              <TableCell>
                <Link
                  component={NavLink}
                  underline="none"
                  color="inherit"
                  to={`/users/${match.guest_player?.username}`}
                >
                  <Stack direction="row" alignItems="center">
                    <Avatar
                      sx={{
                        width: 30,
                        height: 30,
                        bgcolor: match.guest_player?.profile_image
                          ? undefined
                          : stringToColor(match.guest_player?.username ?? ''),
                      }}
                      src={match.guest_player?.profile_image}
                    >
                      {match.guest_player?.username?.slice(0, 2) ?? ''}
                    </Avatar>
                    <Typography
                      padding={1}
                      variant="body1"
                      sx={{
                        fontWeight:
                          match.result === 'guest' ? 'bold' : undefined,
                      }}
                    >
                      {match.guest_player?.username}
                    </Typography>
                  </Stack>
                </Link>
              </TableCell>
              <TableCell>
                <Typography variant="body1">
                  {match.host_player_points} vs {match.guest_player_points}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1">
                  {format(new Date(match.end_at!), 'yyyy/MM/dd HH:mm')}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ScrollObserver
        onIntersect={fetchNextMatches}
        isActiveObserver={isActiveObserver}
      />
    </TableContainer>
  );
};

export default MatchHistory;
