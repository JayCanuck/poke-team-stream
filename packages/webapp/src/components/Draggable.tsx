import { useDrag } from 'react-dnd';
import { DragCollectedProps, DragObject, DragSourceMonitor, DropResult } from '../dnd.types';

type DragTargetDivElement = Omit<React.HTMLAttributes<HTMLDivElement>, 'onDragEnd'>;
interface DraggableProps extends DragTargetDivElement {
  type: string | symbol;
  item: DragObject;
  onDragEnd: (item: DragObject, monitor: DragSourceMonitor) => void;
  children: React.ReactNode;
}

export const Draggable: React.FC<DraggableProps> = ({ type, item, onDragEnd, children }) => {
  const [{ opacity }, drag] = useDrag<DragObject, DropResult, DragCollectedProps>(
    () => ({
      type,
      item,
      end: onDragEnd,
      collect: monitor => ({
        opacity: monitor.isDragging() ? 0.4 : 1
      })
    }),
    [type, item, onDragEnd]
  );

  return (
    <div ref={drag} style={{ opacity, transform: 'translate(0, 0)' }}>
      {children}
    </div>
  );
};
