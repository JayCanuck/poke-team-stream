import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect } from 'react';
import { CenterContent } from '../components/CenterContent';
import { ConnectOptions } from '../context/connection-context';
import { useConnection } from '../hooks/use-connection';

export interface ConnectingProps {
  details?: ConnectOptions;
  onConnected: () => void;
  onError: (err: Error) => void;
}

export const Connecting: React.FC<ConnectingProps> = ({ details, onConnected, onError }) => {
  const [{ authenticated, error }, { connect }] = useConnection();

  useEffect(() => {
    connect(details);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (authenticated) {
      // can do async transition animation here then:
      onConnected();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated]);

  useEffect(() => {
    if (error) onError(error);
  }, [error, onError]);

  // todo: pokeball animation on connect attempt
  // todo: if has
  return (
    <CenterContent>
      <Box width='250px' maxWidth='90%' pb={4}>
        <CircularProgress />
      </Box>
    </CenterContent>
  );
};
