
export function isValueDefined<T>(value?: T): value is T {
  return value !== null && value !== undefined;
}

export function eventIsTouchEvent(ev: MouseEvent | TouchEvent): ev is TouchEvent {
  const touches = (ev as TouchEvent).changedTouches;
  return  isValueDefined(touches);
}

export function getClientCoordinatesFromEvent(event: MouseEvent | TouchEvent): {clientX: number, clientY: number} {
  if (eventIsTouchEvent(event)) {
    return {
      clientX: event.changedTouches[0] ? event.changedTouches[0].clientX : 0,
      clientY: event.changedTouches[0] ? event.changedTouches[0].clientY : 0,
    };
  } else {
    return {
      clientX: event.clientX,
      clientY: event.clientY,
    };
  }
}
