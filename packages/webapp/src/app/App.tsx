import { useState } from 'react';
import { ThemeProvider } from '../context/theme-provider';
import { WebRTCProvider } from '../context/webrtc-provider';
import { Connect } from '../screens/Connect';
import { Main } from '../screens/Main';

function App() {
  const [isConnected] = useState(true);

  return (
    <ThemeProvider>
      <WebRTCProvider>{!isConnected ? <Connect /> : <Main />}</WebRTCProvider>
    </ThemeProvider>
  );
}

export default App;
