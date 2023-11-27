import { useCallback, useEffect, useRef, useState } from 'react';
import { ReceivedAuthMessage } from '../auth.types';
import { LOCALSTORAGE_NAME_KEY, LOCALSTORAGE_TOKEN_KEY } from '../config';
import { ReadyState, useWebRTC } from '../hooks/use-webrtc';
import { AuthError, ConnectOptions, ConnectionActions, ConnectionContext } from './connection-context';

interface ConnectionProviderProps {
  children: React.ReactNode;
}

export const ConnectionProvider: React.FC<ConnectionProviderProps> = ({ children }) => {
  const [{ lastMessage, readyState, error: rtcError }, webRTCActions] = useWebRTC();
  const [authenticated, setAuthenticated] = useState(false);
  const options = useRef<ConnectOptions | null>(null);
  const [authError, setAuthError] = useState<AuthError | null>(null);

  useEffect(() => {
    if (!lastMessage || !lastMessage.type.startsWith('auth-')) return;

    const authMsg = lastMessage as ReceivedAuthMessage;

    switch (authMsg.type) {
      case 'auth-success': {
        setAuthenticated(true);
        break;
      }
      case 'auth-failure': {
        setAuthError(new AuthError(authMsg.message, authMsg.code));
        webRTCActions.disconnect();
        break;
      }
      case 'auth-new-token': {
        window.localStorage.setItem(LOCALSTORAGE_NAME_KEY, authMsg.name);
        window.localStorage.setItem(LOCALSTORAGE_TOKEN_KEY, authMsg.token);
        break;
      }
    }
  }, [lastMessage, webRTCActions]);

  useEffect(() => {
    if (readyState === ReadyState.Connected) {
      if (options.current?.token) {
        webRTCActions.sendMessage({ type: 'auth-token', token: options.current.token });
      } else if (options.current?.password) {
        webRTCActions.sendMessage({ type: 'auth-pwd', password: options.current.password });
      }
      options.current = null;
    } else if (readyState === ReadyState.Closed) {
      window.localStorage.removeItem(LOCALSTORAGE_TOKEN_KEY);
      setAuthenticated(false);
    }
  }, [readyState, webRTCActions]);

  useEffect(() => {
    if (rtcError) setAuthenticated(false);
  }, [rtcError]);

  const connect = useCallback(
    (opts: ConnectOptions = {}) => {
      options.current = opts;
      const name = (opts.name || window.localStorage.getItem(LOCALSTORAGE_NAME_KEY))!;
      const token = opts.token || window.localStorage.getItem(LOCALSTORAGE_TOKEN_KEY) || undefined;
      const { password } = opts;
      options.current = { name, token, password };
      webRTCActions.connect(name);
    },
    [webRTCActions]
  );

  const sendMessage = useCallback(
    (message: Parameters<ConnectionActions['sendMessage']>[0]) => {
      if (authenticated) {
        webRTCActions.sendMessage(message);
      }
    },
    [authenticated, webRTCActions]
  );

  return (
    <ConnectionContext.Provider
      value={[
        { lastMessage: authenticated ? lastMessage : null, readyState, error: authError || rtcError, authenticated },
        { ...webRTCActions, connect, sendMessage }
      ]}
    >
      {children}
    </ConnectionContext.Provider>
  );
};
