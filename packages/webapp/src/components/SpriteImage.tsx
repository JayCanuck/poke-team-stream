import styled from '@mui/system/styled';
import { forwardRef, useCallback, useRef, useState } from 'react';

interface SpriteImageBaseProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'onLoad'> {
  pixelated?: boolean;
  scale?: number;
}

const SpriteImageBase = styled(
  forwardRef<HTMLImageElement, SpriteImageBaseProps>(({ pixelated, scale, ...rest }, ref) => (
    <img {...rest} ref={ref} />
  ))
)`
  ${({ pixelated }) =>
    pixelated
      ? `
        image-rendering: optimizeSpeed;              /* STOP SMOOTHING, GIVE ME SPEED  */
        image-rendering: -moz-crisp-edges;           /* Firefox                        */
        image-rendering: -o-crisp-edges;             /* Opera                          */
        image-rendering: -webkit-optimize-contrast;  /* Chrome (and eventually Safari) */
        image-rendering: pixelated;                  /* Universal support since 2021   */
        image-rendering: optimize-contrast;          /* CSS3 Proposed                  */
        -ms-interpolation-mode: nearest-neighbor;    /* IE8+                           */
      `
      : ''}
  width: ${({ scale = 100, src }) => (src.includes('x-y') ? scale * 0.7 : scale)}%;
  height: ${({ scale = 100, src }) => (src.includes('x-y') ? scale * 0.7 : scale)}%;
  object-fit: contain;
`;

export interface SpriteImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'onLoad' | 'ref'> {
  gameSprite?: boolean;
  scale?: number;
}

export const SpriteImage: React.FC<SpriteImageProps> = ({ gameSprite, scale, ...rest }) => {
  const [pixelated, setPixelated] = useState(gameSprite);
  const ref = useRef<HTMLImageElement>(null);

  const handleLoad = useCallback(() => {
    if (ref.current) {
      const naturalWidth = ref.current.naturalWidth;
      const naturalHeight = ref.current.naturalHeight;
      const renderedWidth = ref.current.clientWidth;
      const renderedHeight = ref.current.clientHeight;
      // if image has been scaled up, we want to set pixelated to true
      setPixelated(gameSprite || (naturalWidth < renderedWidth && naturalHeight < renderedHeight));
    }
  }, [gameSprite, setPixelated]);

  return <SpriteImageBase {...rest} onLoad={handleLoad} pixelated={pixelated} scale={scale} ref={ref} />;
};
