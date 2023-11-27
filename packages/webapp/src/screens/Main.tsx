import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useCallback, useState } from 'react';
import { MemberControls } from '../components/MemberControls';
import { PokeAutocomplete } from '../components/PokeAutocomplete';
// import { ReadyState, useConnection } from '../hooks/use-connection';
import { ResetButton } from '../components/ResetButton';
import { RosterControls } from '../components/RosterControls';
import { SpritePicker } from '../components/SpritePicker';
import { TeamRoster } from '../components/TeamRoster';
import { useConnection } from '../hooks/use-connection';
import { PokemonSpeciesName } from '../pokeapi.types';

export interface MainProps {
  onDisconnected: () => void;
}

export const Main: React.FC<MainProps> = ({ onDisconnected }) => {
  const [, { disconnect }] = useConnection();
  // todo: extract these state into a standalone hook which can communicate changes over useConnection()
  const [pkmn, setPkmn] = useState<PokemonSpeciesName | null>(null);
  const changePkmn = useCallback((value: PokemonSpeciesName | null) => setPkmn(value), [setPkmn]);

  const handleDisconnect = useCallback(() => {
    disconnect();
    onDisconnected();
  }, [disconnect, onDisconnected]);

  // todo: combine autocomplete and picker
  return (
    <div>
      <Button onClick={handleDisconnect}>Disconnect</Button>
      <PokeAutocomplete onChange={changePkmn} />
      <SpritePicker speciesId={pkmn?.pokemon_species_id} />
      <Box mt={6} mb={2}>
        <ResetButton />
        <h4 style={{ userSelect: 'none' }}>Team Layout:</h4>
        <RosterControls />
        <TeamRoster />
        <MemberControls />
      </Box>
    </div>
  );
};
