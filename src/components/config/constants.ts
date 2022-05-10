export const ROOT_URL = '/';
export const HOME_URL = '/home';
export const CHAT_URL = '/chat';
export const GAME_URL = '/pong';
export const SETTING_URL = '/settings';
export const SIGNIN_URL = '/signin';
export const NOT_FOUND_URL = '/404';
export const INTERNAL_SERVER_ERROR_URL = '/500';

export const SOCKET_USERS = '/users';

export const EVENT = {
  // /
  PING: 'ping',
  PONG: 'pong',
  // /users
  USER_STATUS: 'userStatus',
};

export const FT_COLOR = '#00BABC';

const APPBAR_HEIGHT = 64;
export const FOOTER_HEIGHT = 40;
export const CONTENT_WITH_FOOTER_HEIGHT = `calc(100vh - ${APPBAR_HEIGHT}px)`;
export const CONTENT_HEIGHT = `calc(100vh - ${
  APPBAR_HEIGHT + FOOTER_HEIGHT
}px)`;

const GAME_PADDING = 16 * 2;
export const GAME_HEIGHT = `calc(100vh - ${
  APPBAR_HEIGHT + FOOTER_HEIGHT + GAME_PADDING
}px)`;