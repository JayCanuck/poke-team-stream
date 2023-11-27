import { createContext } from 'react';
import { AuthErrorCodes } from '../auth.types';
import { ReadyState, WebRTCActions, WebRTCState } from '../hooks/use-webrtc';

export class AuthError extends Error {
  code: AuthErrorCodes;

  constructor(message: string, code: AuthErrorCodes) {
    super(message);
    this.code = code;
  }
}

export interface ConnectionState extends Omit<WebRTCState, 'error'> {
  authenticated: boolean;
  error: AuthError | WebRTCState['error'];
}

export interface ConnectOptions {
  name?: string;
  password?: string;
  token?: string;
}

export interface ConnectionActions extends Omit<WebRTCActions, 'connect'> {
  connect: (options?: ConnectOptions) => void;
}

export { ReadyState };

export const ConnectionContext = createContext<[ConnectionState, ConnectionActions] | null>(null);
