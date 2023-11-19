import { useContext } from 'react';
import { TeamActions, TeamContext, TeamState } from '../context/team-context';

export type { TeamState, TeamActions };

export const useTeam = (): [TeamState, TeamActions] => {
  const context = useContext(TeamContext);

  if (context === null) {
    throw new Error('useTeam should be used with TeamProvider.');
  }

  return context;
};
