import { Stack, Typography } from '@mui/material';
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { FollowApi, User } from '../../api/generated/api';
import useUsersUserStatus from '../../api/websocket/useUsersUserStatus';
import ScrollObserver from '../ui/ScrollObserver';
import FollowerStatus from './FollowerStatus';

type Props = {
  ownerId: number;
};

const followApi = new FollowApi();

const FollowingList: React.VFC<Props> = ({ ownerId }: Props) => {
  const [offset, setOffset] = useState(0);
  const [isActiveObserver, setIsActiveObserver] = useState(true);
  const [followings, setFollowings] = useState<User[]>([]);
  const { subscribeUserStatus, unsubscribeUserStatus } = useUsersUserStatus();

  useEffect(() => {
    const updateFollowingsStatus = (data: {
      status: string;
      userID: number;
    }) => {
      const updatedFollowings = followings?.map((following) => {
        if (following.id === data.userID) {
          return { ...following, status: data.status } as User;
        }
        return following;
      });
      setFollowings(updatedFollowings);
    };

    if (followings && followings?.length > 0) {
      subscribeUserStatus(updateFollowingsStatus);
    }
    return () => {
      if (followings && followings?.length > 0) {
        unsubscribeUserStatus(updateFollowingsStatus);
      }
    };
  }, [followings, subscribeUserStatus, unsubscribeUserStatus]);

  const fetchNextFollowings = useCallback(async () => {
    const { data } = await followApi.getUsersUserIDFollowing(
      ownerId,
      undefined,
      offset,
      {
        withCredentials: true,
      },
    );
    if (data.has_next === false) {
      setIsActiveObserver(false);
    }
    setOffset((prev) => prev + 10);
    setFollowings((prev) => [...prev, ...(data.entries || [])]);
  }, [ownerId, offset]);

  return (
    <Stack>
      <Typography sx={{ fontWeight: 'bold' }} variant="h5">
        Followings
      </Typography>
      <Stack maxHeight={256} sx={{ overflowY: 'auto' }}>
        {followings?.map((following) => (
          <FollowerStatus key={following.id} user={following} />
        ))}
        <ScrollObserver
          onIntersect={fetchNextFollowings}
          isActiveObserver={isActiveObserver}
        />
      </Stack>
    </Stack>
  );
};

export default FollowingList;
