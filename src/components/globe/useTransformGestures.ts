import { useMemo, useRef } from 'react';
import { PanResponder, type GestureResponderEvent, type PanResponderGestureState } from 'react-native';

interface TransformCallbacks {
  /** One finger drag: pixel delta since the previous event. */
  onDrag: (dx: number, dy: number) => void;
  /** Two finger pinch: scale factor since the previous event (>1 zoom in). */
  onPinch: (factor: number) => void;
  /** Claim the touch immediately (no taps needed underneath), e.g. preview globes. */
  captureTouches?: boolean;
}

const touchDistance = (event: GestureResponderEvent): number | null => {
  const touches = event.nativeEvent.touches;
  if (touches.length < 2) return null;
  const dx = touches[0].pageX - touches[1].pageX;
  const dy = touches[0].pageY - touches[1].pageY;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Drag + pinch gestures for the globe and the map. Taps are NOT captured, so
 * SVG markers underneath still receive `onPress`.
 */
export function useTransformGestures(callbacks: TransformCallbacks) {
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  return useMemo(() => {
    let last = { dx: 0, dy: 0 };
    let lastDistance: number | null = null;

    return PanResponder.create({
      onStartShouldSetPanResponder: () => Boolean(callbacksRef.current.captureTouches),
      onMoveShouldSetPanResponder: (event: GestureResponderEvent, g: PanResponderGestureState) =>
        event.nativeEvent.touches.length >= 2 || Math.abs(g.dx) > 8 || Math.abs(g.dy) > 8, // slack so a slightly shaky tap is not taken as a drag
      onPanResponderTerminationRequest: () => false,
      onPanResponderTerminate: () => {
        last = { dx: 0, dy: 0 };
        lastDistance = null;
      },
      onPanResponderGrant: () => {
        last = { dx: 0, dy: 0 };
        lastDistance = null;
      },
      onPanResponderMove: (event: GestureResponderEvent, g: PanResponderGestureState) => {
        const distance = touchDistance(event);
        if (distance !== null) {
          if (lastDistance) callbacksRef.current.onPinch(distance / lastDistance);
          lastDistance = distance;
          last = { dx: g.dx, dy: g.dy };
          return;
        }
        lastDistance = null;
        callbacksRef.current.onDrag(g.dx - last.dx, g.dy - last.dy);
        last = { dx: g.dx, dy: g.dy };
      },
    }).panHandlers;
  }, []);
}
