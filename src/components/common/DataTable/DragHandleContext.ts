import { createContext } from 'react';
import type { DraggableSyntheticListeners } from '@dnd-kit/core';

export const DragHandleContext = createContext<DraggableSyntheticListeners | undefined>(undefined);
