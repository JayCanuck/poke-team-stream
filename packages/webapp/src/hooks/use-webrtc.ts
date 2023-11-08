import { useContext } from 'react';
import { WebRTCContext, WebRTCContextValues } from '../context/webrtc-context';

export const useWebRTCContext = (): WebRTCContextValues => {
  const context = useContext(WebRTCContext);

  if (context === null) {
    throw new Error('useWebRTCContext should be used with WebRTCProvider.');
  }

  return context;
};
