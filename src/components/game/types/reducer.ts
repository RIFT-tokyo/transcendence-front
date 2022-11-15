import { User } from '../../../api/generated';

export type GameStatus =
  | 'entrance'
  | 'friend_match'
  | 'watch_match'
  | 'host'
  | 'join'
  | 'waiting'
  | 'play'
  | 'watch'
  | 'end';

export type Vector = [number, number, number];

export type GameState = {
  gameStatus: GameStatus;
  isHost: boolean;
  roomId: string;
  hostPlayer: User | null;
  guestPlayer: User | null;
  hostPoints: number;
  guestPoints: number;
  hostPosition: Vector;
  guestPosition: Vector;
  ballPosition: Vector;
};

export type Actions =
  | { type: 'SET_GAME_STATUS'; payload: GameStatus }
  | { type: 'SET_IS_HOST'; payload: boolean }
  | { type: 'SET_ROOM_ID'; payload: string }
  | { type: 'SET_HOST_PLAYER'; payload: User | null }
  | { type: 'SET_GUEST_PLAYER'; payload: User | null }
  | { type: 'SET_POINTS'; payload: { hostPoints: number; guestPoints: number } }
  | { type: 'AUTO_MATCHING' }
  | { type: 'CREATE_ROOM'; payload: string }
  | { type: 'CLEAR_STATE' }
  | { type: 'SET_HOST_POSITION'; payload: Vector }
  | { type: 'SET_GUEST_POSITION'; payload: Vector }
  | { type: 'SET_BALL_POSITION'; payload: Vector };

export const reducer = (state: GameState, action: Actions): GameState => {
  switch (action.type) {
    case 'SET_GAME_STATUS':
      return {
        ...state,
        gameStatus: action.payload,
      };
    case 'SET_IS_HOST':
      return {
        ...state,
        isHost: action.payload,
      };
    case 'SET_ROOM_ID':
      return {
        ...state,
        roomId: action.payload,
      };
    case 'SET_HOST_PLAYER':
      return {
        ...state,
        hostPlayer: action.payload,
      };
    case 'SET_GUEST_PLAYER':
      return {
        ...state,
        guestPlayer: action.payload,
      };
    case 'SET_POINTS':
      return {
        ...state,
        hostPoints: action.payload.hostPoints,
        guestPoints: action.payload.guestPoints,
      };
    case 'AUTO_MATCHING':
      return {
        ...state,
        gameStatus: 'waiting' as GameStatus,
        roomId: '',
      };
    case 'CREATE_ROOM':
      return {
        ...state,
        gameStatus: 'waiting' as GameStatus,
        roomId: action.payload,
      };
    case 'CLEAR_STATE':
      return {
        gameStatus: 'entrance' as GameStatus,
        isHost: true,
        roomId: '',
        hostPlayer: null,
        guestPlayer: null,
        hostPoints: 0,
        guestPoints: 0,
        hostPosition: [0, 0, 9.5],
        guestPosition: [0, 0, -9.5],
        ballPosition: [0, -0.1, 0],
      };
    case 'SET_HOST_POSITION':
      return {
        ...state,
        hostPosition: action.payload,
      };
    case 'SET_GUEST_POSITION':
      return {
        ...state,
        guestPosition: action.payload,
      };
    case 'SET_BALL_POSITION':
      return {
        ...state,
        ballPosition: action.payload,
      };
    default:
      return state;
  }
};
