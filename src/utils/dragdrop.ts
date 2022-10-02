import { debounceTime, defer, fromEvent, merge, Observable, Subject } from "rxjs";
import { IngredientType } from "../features/plate/plate.model";
import { isValueDefined } from "./sanity";

export enum Draggable {
  Plate,
  Ingredient
}

export enum DropTarget {
  ConveyorTray,
}

export interface DropEvent {
  clientX: number;
  clientY: number;
  ingredientType?: IngredientType;
  ingredients?: IngredientType[];
}

export interface DraggableItem {
  type: Draggable;
  ingredientType?: IngredientType;
}

export function eventIsTouchEvent(ev: MouseEvent | TouchEvent): ev is TouchEvent {
  const touches = (ev as TouchEvent).changedTouches;
  return  isValueDefined(touches);
}

export class DragDropService {

  private dragStarted = new Subject<DraggableItem>();
  public dragStarted$ = this.dragStarted.asObservable();


  private dropped = new Subject<DropEvent>();
  public dropped$ = this.dropped.asObservable();

  public startEvents(element: HTMLElement): Observable<MouseEvent | TouchEvent> {
    return defer(() => merge(
      fromEvent<MouseEvent>(element, 'mousedown'),
      fromEvent<TouchEvent>(element, 'touchstart'),
    ).pipe(debounceTime(0)))
  }

  public endEvents(element: HTMLElement): Observable<MouseEvent | TouchEvent> {
    return defer(() => merge(
      fromEvent<MouseEvent>(element, 'mouseup'),
      fromEvent<TouchEvent>(element, 'touchend'),
    ).pipe(debounceTime(0)))
  }

  public drag(item: DraggableItem) {
    this.dragStarted.next(item);
  }

  public drop(ev: DropEvent) {
    this.dropped.next(ev);
  }
}
