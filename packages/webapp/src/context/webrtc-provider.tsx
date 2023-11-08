import { ReactNode } from 'react';
import { WebRTCContext } from './webrtc-context';

export interface WebRTCProviderProps {
  children?: ReactNode;
}

export const WebRTCProvider: React.FC<WebRTCProviderProps> = ({ children }) => {
  return <WebRTCContext.Provider value={{}}>{children}</WebRTCContext.Provider>;
};
