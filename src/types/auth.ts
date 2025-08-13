
export enum AuthState {
  IDLE = 'idle',
  LOADING = 'loading',
  LOGGING_IN = 'logging_in',
  LOGGING_OUT = 'logging_out',
  AUTHENTICATED = 'authenticated',
  ERROR = 'error'
}

export interface AuthStateData {
  state: AuthState;
  error?: string;
}
