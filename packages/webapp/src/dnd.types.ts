// Drag and drop types for sprite dragging
import type { DragSourceMonitor as DragSourceMonitorBase, DropTargetMonitor as DropTargetMonitorBase } from 'react-dnd';
import type { Sprite } from './sprite.types';

export enum DragGroup {
  SPRITE = 'sprite-drag'
}

export interface DragObject {
  speciesId: number;
  sprite: Sprite;
}

export interface DropResult {
  index: number;
}

export interface DropCollectedProps {
  isOver: boolean;
  canDrop: boolean;
}

export interface DragCollectedProps {
  opacity: number;
}

export type DragSourceMonitor = DragSourceMonitorBase<DragObject, DropResult>;
export type DropTargetMonitor = DropTargetMonitorBase<DragObject, DropResult>;
