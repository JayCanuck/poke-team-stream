import { SE_STORE_KEY_PREFIX } from './config';

const ELEMENT_ID = 'poke-team-stream';
const STORE_TEAM_KEY = `${SE_STORE_KEY_PREFIX}-team`;

export interface Sprite {
  url: string;
  source?: string;
  form?: string;
  gameSprite?: boolean;
}

export interface TeamState {
  sprites: Array<Sprite | null>;
  scales: number[];
  spacing: number;
  stagger: number;
}

let state: TeamState = {
  sprites: new Array<Sprite | null>(6).fill(null),
  scales: new Array<number>(6).fill(100),
  spacing: 1,
  stagger: 0
};

const applySpacing = (row: HTMLElement) => {
  row.style.gap = `${state.spacing}%`;
};

const applyStagger = (index: number, entry: HTMLElement) => {
  if (((index + 1) % 2 === 0 && state.stagger < 0) || ((index + 1) % 2 !== 0 && state.stagger >= 0)) {
    // even and scale<0, or odd and scale>=0
    entry.style.paddingTop = `${Math.abs(state.stagger)}%`;
  } else {
    // odd and scale<0, or even and scale>=0
    entry.style.paddingBottom = `${Math.abs(state.stagger)}%`;
  }
};

const spriteImage = (index: number) => {
  const sprite = state.sprites[index];
  if (sprite?.url) {
    const scale = state.scales[index];
    const img = document.createElement('img');

    img.style.height = `${sprite.url.includes('x-y') ? scale * 0.7 : scale}%`;
    img.style.width = `${sprite.url.includes('x-y') ? scale * 0.7 : scale}%`;

    img.onload = () => {
      if (sprite.gameSprite || (img.naturalWidth < img.clientWidth && img.naturalHeight < img.clientHeight)) {
        img.className = 'pixelated';
      } else {
        img.className = '';
      }
    };

    return img;
  }
};

function removeChildren(parent: Element) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

export const renderTeam = async () => {
  state = (await window.SE_API.store.get(STORE_TEAM_KEY)) || state;

  const team = document.createElement('main');
  team.id = ELEMENT_ID;

  const row = document.createElement('div');
  row.className = 'row';
  applySpacing(row);
  team.appendChild(row);

  for (let i = 0; i < state.sprites.length; i++) {
    const container = document.createElement('div');
    const outer = document.createElement('div');
    const inner = document.createElement('div');

    applyStagger(i, container);
    outer.className = 'container-outer';
    inner.className = 'container-inner';
    const img = spriteImage(i);
    if (img) inner.appendChild(img);

    outer.appendChild(inner);
    container.appendChild(outer);
    row.appendChild(container);
  }

  document.body.appendChild(team);
};

export const updateTeam = async (update: TeamState) => {
  state = update;

  const team = document.getElementById('main');
  if (!team) return;

  const row = <HTMLDivElement>team.children[0];
  applySpacing(row);

  for (let i = 0; i < state.sprites.length; i++) {
    const container = <HTMLDivElement>row.children[i];
    const inner = <HTMLDivElement>container.children[0].children[0];
    const img = spriteImage(i);

    applyStagger(i, container);
    if (img) {
      inner.appendChild(img);
    } else {
      removeChildren(inner);
    }
  }

  await window.SE_API.store.set(STORE_TEAM_KEY, state);
};
