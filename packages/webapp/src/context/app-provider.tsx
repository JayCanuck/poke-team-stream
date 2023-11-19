import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ConnectionProvider } from './connection-provider';
import { QueryProvider } from './query-provider';
import { TeamProvider } from './team-provider';
import { ThemeProvider } from './theme-provider';

interface AppProviderProps {
  children: React.ReactNode;
}

// Collects all app-level providers together
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => (
  <ThemeProvider>
    <QueryProvider>
      <ConnectionProvider>
        <TeamProvider>
          <DndProvider backend={HTML5Backend}>{children}</DndProvider>
        </TeamProvider>
      </ConnectionProvider>
    </QueryProvider>
  </ThemeProvider>
);
