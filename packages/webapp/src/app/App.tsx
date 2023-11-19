import Container from '@mui/material/Container';
import { useCallback, useState } from 'react';
import { Connect } from '../screens/Connect';
import { Main } from '../screens/Main';

export const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = useCallback(() => setLoggedIn(true), [setLoggedIn]);
  const handleLogout = useCallback(() => setLoggedIn(false), [setLoggedIn]);

  return (
    <Container component='main' sx={{ height: '100%' }}>
      {!loggedIn ? <Connect onLogin={handleLogin} /> : <Main onLogout={handleLogout} />}
    </Container>
  );
};
