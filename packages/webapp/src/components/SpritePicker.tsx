import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DragGroup, DragObject, DragSourceMonitor } from '../dnd.types';
import { usePokeSprites } from '../hooks/use-poke-sprites';
import { useTeam } from '../hooks/use-team';
import { GameSpritesAbstract, ParsedSprites, VersionSpritesAbstract } from '../pokeapi.types';
import { Sprite } from '../sprite.types';
import { CenterContent } from './CenterContent';
import { Draggable } from './Draggable';
import { SpriteImage } from './SpriteImage';

const generationKeys = [
  'generation-i',
  'generation-ii',
  'generation-iii',
  'generation-iv',
  'generation-v',
  'generation-vi',
  'generation-vii',
  'generation-viii'
];
const gameKeys = [
  ['red-blue', 'yellow'],
  ['gold', 'silver', 'crystal'],
  ['ruby-sapphire', 'emerald', 'firered-leafgreen'],
  ['diamond-pearl', 'platinum', 'heartgold-soulsilver'],
  ['black-white'],
  ['x-y', 'omegaruby-alphasapphire'],
  [/* 'icons', */ 'ultra-sun-ultra-moon'],
  [] // ['icons']
];
const gameNames = [
  ['Red & Blue', 'Yellow'],
  ['Gold', 'Silver', 'Crystal'],
  ['Ruby & Sapphire', 'Emerald', 'FireRed & LeafGreen'],
  ['Diamond & Pearl', 'Platinum', 'HeartGold & SoulSilver'],
  ['Black & White'],
  ['X & Y', 'OmegaRuby & AlphaSapphire'],
  [/* 'Gen 6 Icon', */ 'UltraSun & UltraMoon'],
  [] // ['Gen 7 Icon']
];

export interface SpritePickerProps {
  speciesId?: number;
}

export const SpritePicker: React.FC<SpritePickerProps> = ({ speciesId }) => {
  const [, { updateSprite }] = useTeam();
  const [open, setOpen] = useState(false);
  const { data } = usePokeSprites(speciesId);
  const [shiny, setShiny] = useState(false);

  // returns string array of src urls in form [male, female] with female optional
  const collect = useCallback(
    (obj: GameSpritesAbstract) => {
      const collected: Array<string | null | undefined> = [];
      if (obj.front_transparent) {
        collected.push(shiny ? obj.front_shiny_transparent : obj.front_transparent);
      } else {
        if (shiny) {
          collected.push(obj.front_shiny, obj.front_shiny_female);
        } else {
          collected.push(obj.front_default, obj.front_female);
        }
      }
      return collected.filter(Boolean) as string[];
    },
    [shiny]
  );

  const sprites = useMemo(() => {
    const arr: Sprite[] = [];
    if (data) {
      data.forEach((pkmn, formIndex) => {
        const form = pkmn.pokemon_v2_pokemonforms[0];
        const formName = formIndex === 0 ? undefined : form.is_mega ? 'Mega' : form.pokemon_v2_pokemonformnames[0].name;
        const formNamePrefix = formName ? formName + ' ' : '';
        const { versions, other, ...defaults } = pkmn.pokemon_v2_pokemonsprites[0].sprites as ParsedSprites;

        const artwork = collect(other['official-artwork']).map<Sprite>((url, i, a) => ({
          url,
          source: 'Official Artwork',
          form: a.length === 2 ? formNamePrefix + (i === 0 ? 'Male' : 'Female') : formName
        }));

        const appearances = generationKeys.reduce<Sprite[]>((formSprites, key, i) => {
          const generation = (versions as VersionSpritesAbstract)[key];

          return [
            ...formSprites,
            ...gameKeys[i].reduce<Sprite[]>((gameSprites, gameKey, j) => {
              const game = generation[gameKey];

              return [
                ...gameSprites,
                ...collect(game).map<Sprite>((url, k, a) => ({
                  url,
                  source: gameNames[i][j],
                  form: a.length === 2 ? formNamePrefix + (k === 0 ? 'Male' : 'Female') : formName,
                  gameSprite: true
                }))
              ];
            }, [])
          ];
        }, []);

        const home = collect(other.home).map<Sprite>((url, i, a) => ({
          url,
          source: 'Home',
          form: a.length === 2 ? formNamePrefix + (i === 0 ? 'Male' : 'Female') : formName
        }));

        // No version game sprites for this form, use default
        if (appearances.length === 0) {
          appearances.push(
            ...collect(defaults).map<Sprite>((url, i, a) => ({
              url,
              source: artwork.length > 0 || home.length > 0 ? 'Game Sprite' : undefined,
              form: a.length === 2 ? formNamePrefix + (i === 0 ? 'Male' : 'Female') : formName
            }))
          );
        }

        arr.push(...artwork, ...appearances, ...home);
      });
    }
    return arr;
  }, [collect, data]);

  useEffect(() => {
    setOpen(Boolean(data && speciesId));
  }, [data, speciesId]);

  const hasFormText = useMemo(() => Boolean(sprites.find(sprite => sprite.form)), [sprites]);
  const hasSourceText = useMemo(() => Boolean(sprites.find(sprite => sprite.source)), [sprites]);

  const handleShinyToggle = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setShiny(ev.target.checked);
    },
    [setShiny]
  );

  const handleDragEnd = useCallback(
    (item: DragObject, monitor: DragSourceMonitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        updateSprite(dropResult.index, item.sprite);
      }
    },
    [updateSprite]
  );

  // future: fixed size tiles, better alignments, loading spinner, shiny
  return (
    <Collapse in={open}>
      <Box
        sx={{
          overflowX: 'hidden',
          backgroundColor: 'lightblue',
          mx: 1,
          borderBottomLeftRadius: '8px',
          borderBottomRightRadius: '8px'
          //minHeight: 'max(100px, 8vw)'
        }}
      >
        <FormControlLabel
          control={<Checkbox value={shiny} onChange={handleShinyToggle} />}
          label='Shiny'
          sx={{ mx: 2, display: 'none' }}
        />
        <Stack direction='row' spacing={2} sx={{ overflowX: 'auto', p: 1 }}>
          {typeof speciesId === 'number' &&
            sprites.map((sprite, i) => (
              <div key={`sprite-${speciesId}-${i}`} style={{ textAlign: 'center' }}>
                {hasFormText && (
                  <Typography variant='caption' display='block' sx={{ fontWeight: 'bold' }}>
                    {sprite.form || '\u00A0'}
                  </Typography>
                )}
                <Draggable type={DragGroup.Sprite} item={{ speciesId, sprite }} onDragEnd={handleDragEnd}>
                  <CenterContent width='8vw' height='8vw' minHeight='100px' minWidth='100px'>
                    <SpriteImage src={sprite.url} gameSprite={sprite.gameSprite} />
                  </CenterContent>
                </Draggable>
                {hasSourceText && (
                  <Typography variant='caption' display='block' sx={{ fontWeight: 'bold' }}>
                    {sprite.source || '\u00A0'}
                  </Typography>
                )}
              </div>
            ))}
        </Stack>
      </Box>
    </Collapse>
  );
};
