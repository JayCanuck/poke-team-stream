import { createTheme, ThemeProvider as MaterialThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { StyleSheetManager } from 'styled-components';

// Hack for MUI5 and StyledComponents 6.
// See https://github.com/mui/material-ui/issues/36651
const shouldNotForwardProp: string[] = ['inputComponent', 'inputProps', 'ownerState'];
const styledComponents6HackForMui5 = (prop: string): boolean => {
  return shouldNotForwardProp.indexOf(prop) === -1;
};

const theme = createTheme({});

interface ThemeProviderProps {
  children: React.ReactNode;
}
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => (
  <MaterialThemeProvider theme={theme}>
    {/* Otherwise styled components are loaded first and are overwritten by material design */}
    <StyledEngineProvider injectFirst>
      <StyleSheetManager shouldForwardProp={styledComponents6HackForMui5}>{children}</StyleSheetManager>
    </StyledEngineProvider>
  </MaterialThemeProvider>
);
