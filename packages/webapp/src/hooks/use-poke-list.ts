import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { POKEAPI_LANGUAGE, POKEAPI_TIMEOUT } from '../config';
import { FailureResponse, ListQueryResponse } from '../pokeapi.types';

export const usePokeList = () => {
  const query = useQuery({
    queryKey: ['pokemon', 'list'],
    queryFn: () =>
      axios
        .post<ListQueryResponse | FailureResponse>(
          'https://beta.pokeapi.co/graphql/v1beta',
          {
            query: `
              query pokeAPIListQuery {
                pokemon_v2_pokemonspeciesname(where: {pokemon_v2_language: {name: {_eq: "${POKEAPI_LANGUAGE}"}}},
                    order_by: {pokemon_species_id: asc}) {
                  name
                  pokemon_species_id
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
          return (res.data as ListQueryResponse).data.pokemon_v2_pokemonspeciesname;
        })
  });

  return query;
};
