export const EVENT = {
  // /users
  USER_STATUS_SET: 'user-status:set',
  USER_STATUS_RECEIVE: 'user-status:receive',
  // /channels
  MESSAGE_SEND: 'message:send',
  MESSAGE_RECEIVE: 'message:receive',
  MESSAGE_RECEIVE_ALL: 'message:receive-all',
  CHANNEL_JOIN: 'channel:join',
  CHANNEL_LEAVE: 'channel:leave',
  // /pms
  PRIVATE_MESSAGE_SEND: 'private-message:send',
  PRIVATE_MESSAGE_RECEIVE: 'private-message:receive',
  PRIVATE_MESSAGE_RECEIVE_ALL: 'private-message:receive-all',
  PM_JOIN: 'pm:join',
  PM_LEAVE: 'pm:leave',
  // /pong
  MATCH_CREATE: 'match:create',
  MATCH_AUTO: 'match:auto',
  MATCH_JOIN: 'match:join',
  MATCH_READY: 'match:ready',
  MATCH_START: 'match:start',
  MATCH_GAIN_POINT: 'match:gain-point',
  MATCH_STATUS: 'match:status',
  MATCH_FINISH: 'match:finish',
};
