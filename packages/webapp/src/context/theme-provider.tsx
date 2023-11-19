import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MaterialThemeProvider, StyledEngineProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({});

interface ThemeProviderProps {
  children: React.ReactNode;
}
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => (
  <StyledEngineProvider injectFirst>
    <MaterialThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MaterialThemeProvider>
  </StyledEngineProvider>
);
