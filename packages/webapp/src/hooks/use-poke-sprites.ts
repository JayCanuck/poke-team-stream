import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { POKEAPI_LANGUAGE, POKEAPI_TIMEOUT } from '../config';
import { FailureResponse, ParsedSprites, SpritesQueryResponse } from '../pokeapi.types';

export const usePokeSprites = (speciesId?: number) => {
  const query = useQuery({
    queryKey: ['pokemon', 'sprites', speciesId],
    queryFn: () =>
      axios
        .post<SpritesQueryResponse | FailureResponse>(
          'https://beta.pokeapi.co/graphql/v1beta',
          {
            query: `
              query pokeAPISpritesQuery {
                pokemon_v2_pokemon(where: {pokemon_species_id: {_eq: ${speciesId}}}) {
                  id
                  name
                  pokemon_v2_pokemonsprites {
                    sprites
                  }
                  pokemon_v2_pokemonforms(order_by: {form_order: asc}) {
                    is_mega
                    is_battle_only
                    is_default
                    pokemon_v2_pokemonformnames(where: {pokemon_v2_language: {name: {_eq: "${POKEAPI_LANGUAGE}"}}}) {
                      name
                    }
                    pokemon_id
                  }
                }
              }
            `
          },
          {
            timeout: POKEAPI_TIMEOUT
          }
        )
        .then(res => {
          if ((res.data as FailureResponse).errors) {
            throw new Error((res.data as FailureResponse).errors[0].message);
          }

          const pokemon = (res.data as SpritesQueryResponse).data.pokemon_v2_pokemon;
          pokemon.forEach(pkmn => {
            // Parse JSON string blocks; in future may not be needed
            // https://github.com/PokeAPI/pokeapi/issues/614
            pkmn.pokemon_v2_pokemonsprites[0].sprites = JSON.parse(
              pkmn.pokemon_v2_pokemonsprites[0].sprites as string
            ) as ParsedSprites;

            // SpeciesID 1011-1017 don't have updated sprite blocks
            // For now, they only have 1 front-facing image anyway, so just hardcode the resolved form PokemonID:
            // https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/<pokemonID>.png
            if (speciesId! >= 1011 && pkmn.pokemon_v2_pokemonsprites[0].sprites.front_default === null) {
              pkmn.pokemon_v2_pokemonsprites[0].sprites.front_default =
                'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + pkmn.id + '.png';
            }
          });
          return pokemon;
        }),
    enabled: typeof speciesId === 'number'
  });

  return query;
};
