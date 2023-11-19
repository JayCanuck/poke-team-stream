import { useContext } from 'react';
import { ConnectionActions, ConnectionContext, ConnectionState, ReadyState } from '../context/connection-context';

export type { ConnectionState, ConnectionActions };
export { ReadyState };

export const useConnection = (): [ConnectionState, ConnectionActions] => {
  const context = useContext(ConnectionContext);

  if (context === null) {
    throw new Error('useConnection should be used with ConnectionProvider.');
  }

  return context;
};
