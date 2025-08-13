import {useSensors, useSensor, PointerSensor, KeyboardSensor, MouseSensor, TouchSensor} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

/**
 * Unified DnD sensors for web and mobile.
 * - Uses Pointer events when available
 * - Falls back to Touch + Mouse when Pointer is not supported
 * - Adds sensible activation constraints to avoid scroll conflicts on mobile
 */
export default function useDndSensors() {
  const hasPointer = typeof window !== 'undefined' && 'PointerEvent' in window;

  const sensorList: any[] = [];

  if (hasPointer) {
    sensorList.push(
      useSensor(PointerSensor, {
        activationConstraint: { distance: 8 },
      })
    );
  } else {
    // Fallback for older mobile browsers without PointerEvents
    sensorList.push(
      useSensor(TouchSensor, {
        activationConstraint: { delay: 200, tolerance: 5 },
      }),
      useSensor(MouseSensor, {
        activationConstraint: { distance: 8 },
      })
    );
  }

  // Keyboard accessibility
  sensorList.push(
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return useSensors(...sensorList);
}
