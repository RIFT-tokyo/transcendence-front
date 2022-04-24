import { Table, TableContainer, Paper, TableHead, TableRow, TableCell, TableBody, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Match, MatchApi } from '../../api/generated';

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
  }, [])

  return (
    <TableContainer
      component={Paper}
      sx={{height: '85vh'}}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Host Player</TableCell>
            <TableCell>Guest Player</TableCell>
            <TableCell>Points</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ overflowY: 'auto' }}>
          {matches.map((match) => (
            <TableRow key={match.id}>
              <TableCell>
                <Typography
                  color={match.result === 'host' ? 'primary': undefined}
                  sx={{fontWeight: match.result === 'host' ? 'bold' : undefined}}
                >
                  {match.host_player?.username}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  color={match.result === 'guest' ? 'primary': undefined}
                  sx={{fontWeight: match.result === 'guest' ? 'bold' : undefined}}
                >
                  {match.guest_player?.username}
                </Typography>
              </TableCell>
              <TableCell>{match.host_player_points} vs {match.guest_player_points}</TableCell>
              <TableCell>{match.end_at}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default MatchHistory;