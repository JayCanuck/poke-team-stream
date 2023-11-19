import { useWebRTC } from '../hooks/use-webrtc';
import { ConnectionContext } from './connection-context';

const hasAuthToken = () => false;

interface ConnectionProviderProps {
  children: React.ReactNode;
}

export const ConnectionProvider: React.FC<ConnectionProviderProps> = ({ children }) => {
  const [webRTCState, webRTCActions] = useWebRTC();
  // todo: auth handling

  return (
    <ConnectionContext.Provider value={[webRTCState, { ...webRTCActions, hasAuthToken }]}>
      {children}
    </ConnectionContext.Provider>
  );
};
