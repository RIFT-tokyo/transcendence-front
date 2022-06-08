import { Channel } from '../../../api/generated';

export type State = {
  name: string;
  password: string;
  showPassword: boolean;
  errorName: boolean;
  errorPassword: boolean;
  isPrivate: boolean;
  isRequesting: boolean;
  tabIndex: number;
  channels: Channel[];
};

export type Actions =
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_PASSWORD'; payload: string }
  | { type: 'TOGGLE_SHOW_PASSWORD' }
  | { type: 'SET_ERROR_NAME'; payload: boolean }
  | { type: 'SET_ERROR_PASSWORD'; payload: boolean }
  | { type: 'SET_IS_PRIVATE'; payload: boolean }
  | { type: 'SET_IS_REQUESTING'; payload: boolean }
  | { type: 'SET_TAB_INDEX'; payload: number }
  | { type: 'SET_CHANNELS'; payload: Channel[] }
  | { type: 'CLOSE_DIALOG' };

export const reducer = (state: State, action: Actions) => {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, name: action.payload };
    case 'SET_PASSWORD':
      return { ...state, password: action.payload };
    case 'TOGGLE_SHOW_PASSWORD':
      return { ...state, showPassword: !state.showPassword };
    case 'SET_ERROR_NAME':
      return { ...state, errorName: action.payload };
    case 'SET_ERROR_PASSWORD':
      return { ...state, errorPassword: action.payload };
    case 'SET_IS_PRIVATE':
      return { ...state, isPrivate: action.payload };
    case 'SET_IS_REQUESTING':
      return { ...state, isRequesting: action.payload };
    case 'SET_TAB_INDEX':
      return { ...state, tabIndex: action.payload };
    case 'SET_CHANNELS':
      return { ...state, channels: action.payload };
    case 'CLOSE_DIALOG':
      return {
        ...state,
        name: '',
        password: '',
        errorName: false,
        errorPassword: false,
      };
    default: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const exhaustivenessCheck: never = action;
      return state;
    }
  }
};
