import Autocomplete, { AutocompleteRenderInputParams } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { matchSorter } from 'match-sorter';
import { SyntheticEvent, useCallback } from 'react';
import { usePokeList } from '../hooks/use-poke-list';
import { PokemonSpeciesName } from '../pokeapi.types';

const filterOptions = (options: PokemonSpeciesName[], state: { inputValue: string }) =>
  state.inputValue
    ? matchSorter(options, state.inputValue, {
        keys: ['name'],
        baseSort: (a, b) => (a.item.pokemon_species_id < b.item.pokemon_species_id ? -1 : 1)
      })
    : options;

const renderInput = (params: AutocompleteRenderInputParams) => <TextField {...params} label='Add a pokemon...' />;

const renderOption = (
  props: React.HTMLAttributes<HTMLLIElement>,
  option: PokemonSpeciesName,
  state: { inputValue: string }
) => {
  const matches = match(option.name, state.inputValue, { insideWords: true });
  const parts = parse(option.name, matches);

  return (
    <li {...props}>
      <div>
        {parts.map((part, index) => (
          <span
            key={index}
            style={{
              fontWeight: part.highlight ? 700 : 400
            }}
          >
            {part.text}
          </span>
        ))}
      </div>
    </li>
  );
};

interface PokeAutocompleteProps {
  onChange?: (newValue: PokemonSpeciesName | null) => void;
}

export const PokeAutocomplete: React.FC<PokeAutocompleteProps> = ({ onChange }) => {
  const { data, isLoading, error } = usePokeList();

  const handleChange = useCallback(
    (_ev: SyntheticEvent<Element, Event>, newValue: PokemonSpeciesName | null) => onChange?.(newValue),
    [onChange]
  );

  return (
    <Autocomplete
      disablePortal
      options={data || []}
      getOptionLabel={option => option.name}
      noOptionsText='No Pokemon found'
      filterOptions={filterOptions}
      loading={isLoading}
      renderInput={renderInput}
      renderOption={renderOption}
      disabled={Boolean(isLoading || !data || error)}
      onChange={handleChange}
    />
  );
};
