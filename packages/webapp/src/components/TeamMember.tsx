import Box, { BoxProps } from '@mui/material/Box';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { DragGroup, DragObject, DropCollectedProps, DropResult } from '../dnd.types';
import { useTeam } from '../hooks/use-team';
import { CenterContent } from './CenterContent';
import { SpriteImage, SpriteImageProps } from './SpriteImage';

const scaleThreshold = 100; // wheel deltaY threshold for a 10% scaling event

function dragStyles(isActive: boolean, canDrop: boolean) {
  if (isActive) {
    return { border: '1px solid gray', boxShadow: 'inset 0px 0px 10px rgba(0,0,0,0.25)' };
  } else if (canDrop) {
    return { border: '1px dashed gray' };
  } else {
    return {};
  }
}

interface TeamMemberProps extends Omit<BoxProps, 'height' | 'width' | 'position'> {
  index: number;
}

export const TeamMember: React.FC<TeamMemberProps> = ({ index, ...rest }) => {
  const [{ sprites, scales }, { zoomIn, zoomOut }] = useTeam();
  const imgProps = useMemo(
    (): SpriteImageProps | null =>
      sprites[index]
        ? {
            src: sprites[index]?.url,
            gameSprite: sprites[index]?.gameSprite,
            scale: scales[index]
          }
        : null,
    [index, sprites, scales]
  );
  const spriteContainer = useRef<HTMLDivElement>(null);
  const [deltaY, setDeltaY] = useState(0);
  const [{ canDrop, isOver }, drop] = useDrop<DragObject, DropResult, DropCollectedProps>(
    () => ({
      accept: DragGroup.Sprite,
      drop: () => ({
        index
      }),
      collect: monitor => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
      })
    }),
    [index]
  );

  useEffect(() => {
    const currRef = spriteContainer.current;
    const handler = (ev: Event) => {
      const netDeltaY = deltaY + (ev as WheelEvent).deltaY;
      if (Math.abs(netDeltaY) >= scaleThreshold) {
        if (netDeltaY > 0) {
          zoomOut(index);
        } else {
          zoomIn(index);
        }
      } else {
        setDeltaY(netDeltaY);
      }
      ev.preventDefault();
      ev.stopPropagation();
      return false;
    };
    if (currRef) {
      currRef.addEventListener('mousewheel', handler);
      return () => currRef.removeEventListener('mousewheel', handler);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sprites[index], index]);

  return (
    <Box position='absolute' height='100%' width='100%' ref={drop}>
      <Box
        sx={{
          borderRadius: '100%',
          height: '100%',
          width: '100%',
          position: 'absolute',
          transition: 'border 0.25s, box-shadow 0.1s',
          zIndex: -1,
          ...dragStyles(canDrop && isOver, canDrop)
        }}
        {...rest}
      />
      {imgProps && (
        <CenterContent position='absolute' overflow='visible' ref={spriteContainer}>
          <SpriteImage {...imgProps} />
        </CenterContent>
      )}
    </Box>
  );
};
