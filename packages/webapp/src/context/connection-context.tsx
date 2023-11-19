import { createContext } from 'react';
import { ReadyState, WebRTCActions, WebRTCState } from '../hooks/use-webrtc';

// In future will be extended with additional state values/actions
export type ConnectionState = WebRTCState;
export type ConnectionActions = WebRTCActions & { hasAuthToken: () => boolean };
export { ReadyState };

export const ConnectionContext = createContext<[ConnectionState, ConnectionActions] | null>(null);
