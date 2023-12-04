import { useCallback, useEffect, useReducer } from 'react';
import { useThrottledCallback } from 'use-debounce';
import { ConnectionActions, useConnection } from '../hooks/use-connection';
import { Sprite } from '../sprite.types';
import { TeamContext, TeamState } from './team-context';

const initialState = (): TeamState => ({
  sprites: new Array<Sprite | null>(6).fill(null),
  scales: new Array<number>(6).fill(100),
  spacing: 1,
  stagger: 0
});

export type TeamReducerActions = (
  | { type: 'init'; value: TeamState }
  | { type: 'update-sprite'; index: number; value: Sprite }
  | { type: 'update-scale'; index: number; value: number }
  | { type: 'zoom-in'; index: number }
  | { type: 'zoom-out'; index: number }
  | { type: 'update-spacing'; value: number }
  | { type: 'update-stagger'; value: number }
  | { type: 'reset' }
) & { sendMessage: ConnectionActions['sendMessage'] };

const scaleStepPercent = 10; // 10% per scale step
const validScale = (scale: number) => Math.min(Math.max(scale, 0), 200);

const reducer = (state: TeamState, action: TeamReducerActions): TeamState => {
  const newState = { ...state, sprites: [...state.sprites], scales: [...state.scales] };

  switch (action.type) {
    case 'init':
      return action.value;
    case 'update-sprite':
      newState.sprites[action.index] = action.value;
      break;
    case 'update-scale':
      newState.scales[action.index] = validScale(action.value);
      break;
    case 'zoom-in':
      newState.scales[action.index] = validScale(newState.scales[action.index] + scaleStepPercent);
      break;
    case 'zoom-out':
      newState.scales[action.index] = validScale(newState.scales[action.index] - scaleStepPercent);
      break;
    case 'update-spacing':
      newState.spacing = action.value;
      break;
    case 'update-stagger':
      newState.stagger = action.value;
      break;
    case 'reset':
      Object.assign(newState, initialState());
      break;
    default:
      return state;
  }

  action.sendMessage(newState);
  return newState;
};

interface TeamProviderProps {
  children: React.ReactNode;
}

export const TeamProvider: React.FC<TeamProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState());
  const [{ lastMessage }, { sendMessage }] = useConnection();

  const throttledSendMessage = useThrottledCallback(sendMessage, 1000);

  const update = useCallback(
    (type: TeamReducerActions['type'], params: Omit<TeamReducerActions, 'type' | 'sendMessage'> = {}) => {
      dispatch({ type, ...params, sendMessage: throttledSendMessage } as TeamReducerActions);
    },
    [throttledSendMessage, dispatch]
  );

  const init = useCallback((value: TeamState) => update('init', { value }), [update]);
  const updateSprite = useCallback(
    (index: number, value: Sprite) => update('update-sprite', { index, value }),
    [update]
  );
  const updateScale = useCallback((index: number, value: number) => update('update-scale', { index, value }), [update]);
  const zoomIn = useCallback((index: number) => update('zoom-in', { index }), [update]);
  const zoomOut = useCallback((index: number) => update('zoom-out', { index }), [update]);
  const updateSpacing = useCallback((value: number) => update('update-spacing', { value }), [update]);
  const updateStagger = useCallback((value: number) => update('update-stagger', { value }), [update]);
  const reset = useCallback(() => update('reset'), [update]);

  useEffect(() => {
    if (lastMessage?.type === 'team') {
      init(lastMessage?.state);
    }
  }, [init, lastMessage]);

  return (
    <TeamContext.Provider
      value={[state, { updateSprite, updateScale, zoomIn, zoomOut, updateSpacing, updateStagger, reset }]}
    >
      {children}
    </TeamContext.Provider>
  );
};
