import Container from '@mui/material/Container';
import { useCallback, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { LOCALSTORAGE_NAME_KEY, LOCALSTORAGE_TOKEN_KEY } from '../config';
import { Connect, SubmitValues } from '../screens/Connect';
import { Connecting } from '../screens/Connecting';
import { Main } from '../screens/Main';

enum ViewType {
  Connect = 'connect',
  Connecting = 'connecting',
  Main = 'main'
}

const hasToken = () =>
  Boolean(window.localStorage.getItem(LOCALSTORAGE_NAME_KEY) && window.localStorage.getItem(LOCALSTORAGE_TOKEN_KEY));

export const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>(hasToken() ? ViewType.Connecting : ViewType.Connect);
  const submitValues = useRef<SubmitValues>();
  const error = useRef<Error>();

  const transition = useCallback(
    (newView: ViewType) => {
      if (!document.startViewTransition) setActiveView(newView);

      document.startViewTransition(() => {
        flushSync(() => {
          setActiveView(newView);
        });
      });
    },
    [setActiveView]
  );

  const handleSubmit = useCallback(
    (values: SubmitValues) => {
      submitValues.current = values;
      transition(ViewType.Connecting);
    },
    [transition]
  );

  const handleError = useCallback(
    (err: Error) => {
      error.current = err;
      transition(ViewType.Connect);
    },
    [transition]
  );

  const handleConnected = useCallback(() => {
    if (submitValues.current?.password) submitValues.current.password = undefined;
    transition(ViewType.Main);
  }, [transition]);

  const View = useMemo(() => {
    switch (activeView) {
      case ViewType.Connect:
        return <Connect initial={submitValues.current} error={error.current} onSubmit={handleSubmit} />;
      case ViewType.Connecting:
        return <Connecting details={submitValues.current} onError={handleError} onConnected={handleConnected} />;
      case ViewType.Main:
        return <Main onDisconnected={() => transition(ViewType.Connect)} />;
    }
  }, [activeView, handleConnected, handleError, handleSubmit, transition]);

  return (
    <Container component='main' sx={{ height: '100%' }}>
      {View}
    </Container>
  );
};
