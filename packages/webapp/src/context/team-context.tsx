import { createContext } from 'react';
import { Sprite } from '../sprite.types';

// In future will be extended with additional state values/actions
export interface TeamState {
  sprites: Array<Sprite | null>;
  scales: number[];
  spacing: number;
  stagger: number;
}

export interface TeamActions {
  updateSprite: (index: number, value: Sprite) => void;
  updateScale: (index: number, value: number) => void;
  zoomIn: (index: number) => void;
  zoomOut: (index: number) => void;
  updateSpacing: (value: number) => void;
  updateStagger: (value: number) => void;
  reset: () => void;
}

export const TeamContext = createContext<[TeamState, TeamActions] | null>(null);
