export const ROOT_URL = '/';
export const HOME_URL = '/home';
export const CHAT_URL = '/chat';
export const CHANNELS_URL = `${CHAT_URL}/channels`;
export const PMS_URL = `${CHAT_URL}/pms`;
export const GAME_URL = '/pong';
export const SETTING_URL = '/settings';
export const SIGNIN_URL = '/signin';
export const TWO_FA_URL = '/2fa';
export const NOT_FOUND_URL = '/404';
export const INTERNAL_SERVER_ERROR_URL = '/500';

export const SOCKET_USERS = '/users';
export const SOCKET_CHANNELS = '/channels';
export const SOCKET_PMS = '/pms';
export const SOCKET_PONG = '/pong';

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

const CHAT_CHANNEL_TITLE_HEIGHT = 40;
const CHAT_MESSAGE_INPUT_HEIGHT = 54;
const CHAT_CONTENT_PADDING = 8 * 2;
export const CHAT_MESSAGE_CONTENT_HEIGHT = `calc(${CONTENT_HEIGHT} - ${
  CHAT_CHANNEL_TITLE_HEIGHT + CHAT_MESSAGE_INPUT_HEIGHT + CHAT_CONTENT_PADDING
}px)`;

export const X = 0;
export const Y = 1;
export const Z = 2;
export const STAGE_X = 7.6;
export const STAGE_Z = 20;
export const PADDLE_X = 2;
export const PADDLE_Z = 0.4;
export const PADDLE_SPEED = 0.2;