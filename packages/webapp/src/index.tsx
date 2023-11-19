import 'pokegotypes/css/pokegotypes.css';
import ReactDOM from 'react-dom/client';
import 'typeface-open-sans';
import { App } from './app/App.tsx';
import { AppProvider } from './context/app-provider.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AppProvider>
    <App />
  </AppProvider>
);
