import { createContext } from 'react';

export interface WebRTCContextValues {
  // todo
}

export const WebRTCContext = createContext<WebRTCContextValues | null>(null);
