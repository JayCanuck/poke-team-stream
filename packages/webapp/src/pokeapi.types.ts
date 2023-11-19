// Types of server responses from PokeAPI
// Names based on GraphQL values for consistency and transparency
export interface GameSpritesAbstract {
  front_default?: string | null;
  front_female?: string | null;
  front_shiny?: string | null;
  front_shiny_female?: string | null;
  front_transparent?: string | null;
  front_shiny_transparent?: string | null;
  back_default?: string | null;
  back_female?: string | null;
  back_shiny?: string | null;
  back_shiny_female?: string | null;
  back_transparent?: string | null;
  back_shiny_transparent?: string | null;
}
export interface GenerationSpritesAbstract {
  [k: string]: GameSpritesAbstract;
}

export interface VersionSpritesAbstract {
  [k: string]: GenerationSpritesAbstract;
}

export interface ParsedSprites {
  back_default: string | null;
  back_female: string | null;
  back_shiny: string | null;
  back_shiny_female: string | null;
  front_default: string | null;
  front_female: string | null;
  front_shiny: string | null;
  front_shiny_female: string | null;
  other: {
    'dream_world': {
      front_default: string | null;
      front_female: string | null;
    };
    'home': {
      front_default: string | null;
      front_female: string | null;
      front_shiny: string | null;
      front_shiny_female: string | null;
    };
    'official-artwork': {
      front_default: string | null;
      front_shiny: string | null;
    };
  };
  versions: {
    'generation-i': {
      'red-blue': {
        front_default: string | null;
        front_gray: string | null;
        back_default: string | null;
        back_gray: string | null;
        front_transparent: string | null;
        back_transparent: string | null;
      };
      'yellow': {
        front_default: string | null;
        front_gray: string | null;
        back_default: string | null;
        back_gray: string | null;
        front_transparent: string | null;
        back_transparent: string | null;
      };
    };
    'generation-ii': {
      crystal: {
        front_default: string | null;
        front_shiny: string | null;
        back_default: string | null;
        back_shiny: string | null;
        front_transparent: string | null;
        front_shiny_transparent: string | null;
        back_transparent: string | null;
        back_shiny_transparent: string | null;
      };
      gold: {
        front_default: string | null;
        front_shiny: string | null;
        back_default: string | null;
        back_shiny: string | null;
        front_transparent: string | null;
      };
      silver: {
        front_default: string | null;
        front_shiny: string | null;
        back_default: string | null;
        back_shiny: string | null;
        front_transparent: string | null;
      };
    };
    'generation-iii': {
      'emerald': {
        front_default: string | null;
        front_shiny: string | null;
      };
      'firered-leafgreen': {
        front_default: string | null;
        front_shiny: string | null;
        back_default: string | null;
        back_shiny: string | null;
      };
      'ruby-sapphire': {
        front_default: string | null;
        front_shiny: string | null;
        back_default: string | null;
        back_shiny: string | null;
      };
    };
    'generation-iv': {
      'diamond-pearl': {
        front_default: string | null;
        front_female: string | null;
        front_shiny: string | null;
        front_shiny_female: string | null;
        back_default: string | null;
        back_female: string | null;
        back_shiny: string | null;
        back_shiny_female: string | null;
      };
      'heartgold-soulsilver': {
        front_default: string | null;
        front_female: string | null;
        front_shiny: string | null;
        front_shiny_female: string | null;
        back_default: string | null;
        back_female: string | null;
        back_shiny: string | null;
        back_shiny_female: string | null;
      };
      'platinum': {
        front_default: string | null;
        front_female: string | null;
        front_shiny: string | null;
        front_shiny_female: string | null;
        back_default: string | null;
        back_female: string | null;
        back_shiny: string | null;
        back_shiny_female: string | null;
      };
    };
    'generation-v': {
      'black-white': {
        front_default: string | null;
        front_female: string | null;
        front_shiny: string | null;
        front_shiny_female: string | null;
        back_default: string | null;
        back_female: string | null;
        back_shiny: string | null;
        back_shiny_female: string | null;
        animated: {
          front_default: string | null;
          front_female: string | null;
          front_shiny: string | null;
          front_shiny_female: string | null;
          back_default: string | null;
          back_female: string | null;
          back_shiny: string | null;
          back_shiny_female: string | null;
        };
      };
    };
    'generation-vi': {
      'omegaruby-alphasapphire': {
        front_default: string | null;
        front_female: string | null;
        front_shiny: string | null;
        front_shiny_female: string | null;
      };
      'x-y': {
        front_default: string | null;
        front_female: string | null;
        front_shiny: string | null;
        front_shiny_female: string | null;
      };
    };
    'generation-vii': {
      'ultra-sun-ultra-moon': {
        front_default: string | null;
        front_female: string | null;
        front_shiny: string | null;
        front_shiny_female: string | null;
      };
      'icons': {
        front_default: string | null;
        front_female: string | null;
      };
    };
    'generation-viii': {
      icons: {
        front_default: string | null;
        front_female: string | null;
      };
    };
  };
}

export interface PokemonSprites {
  sprites: string | ParsedSprites;
}

export interface PokemonFormNames {
  name: string;
}

interface PokemonFormsDefault {
  pokemon_id: number;
  is_default: true;
  is_mega: boolean;
  is_battle_only: boolean;
  pokemon_v2_pokemonformnames: never[];
}

interface PokemonFormsNonDefault {
  pokemon_id: number;
  is_default: false;
  is_mega: boolean;
  is_battle_only: boolean;
  pokemon_v2_pokemonformnames: PokemonFormNames[];
}

export type PokemonForms = PokemonFormsDefault | PokemonFormsNonDefault;

export interface Pokemon {
  id: number;
  name: string;
  pokemon_v2_pokemonsprites: PokemonSprites[];
  pokemon_v2_pokemonforms: PokemonForms[];
}

export interface SpritesQueryResponse {
  data: {
    pokemon_v2_pokemon: Pokemon[];
  };
}

export interface PokemonSpeciesName {
  name: string;
  pokemon_species_id: number;
}

export interface ListQueryResponse {
  data: {
    pokemon_v2_pokemonspeciesname: PokemonSpeciesName[];
  };
}

export interface FailureResponse {
  errors: {
    message: string;
    extensions: { code: string; path: string };
  }[];
}
