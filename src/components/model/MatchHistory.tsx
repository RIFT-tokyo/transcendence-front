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
} from '@mui/material';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Match, MatchApi } from '../../api/generated';
import stringToColor from '../../functions/stringToColor';

const MatchHistory = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const matchApi = new MatchApi();

  const fetchMatches = async () => {
    const { data } = await matchApi.getMatches({
      withCredentials: true,
    });
    setMatches(data);
  };

  useEffect(() => {
    fetchMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TableContainer sx={{ height: 900 }}>
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
          {matches.map((match) => (
            <TableRow key={match.id}>
              <TableCell>
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
                      fontWeight: match.result === 'host' ? 'bold' : undefined,
                    }}
                  >
                    {match.host_player?.username}
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell>
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
                      fontWeight: match.result === 'guest' ? 'bold' : undefined,
                    }}
                  >
                    {match.guest_player?.username}
                  </Typography>
                </Stack>
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
    </TableContainer>
  );
};

export default MatchHistory;
