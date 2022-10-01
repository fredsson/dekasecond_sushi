import { fromEvent, Observable, Subject } from "rxjs";

export enum Draggable {
  Plate,
}

export enum DropTarget {
  ConveyorTray,
}

export interface DropEvent {
  clientX: number;
  clientY: number;
}


export class DragDropService {

  private dragStarted = new Subject<Draggable>();
  public dragStarted$: Observable<Draggable> = this.dragStarted.asObservable();


  private dropped = new Subject<DropEvent>();
  public dropped$ = this.dropped.asObservable();

  public drag() {
    this.dragStarted.next(Draggable.Plate);
  }

  public drop(ev: MouseEvent) {
    this.dropped.next({ clientX: ev.clientX, clientY: ev.clientY});
  }

  public registerDropTarget() {
  }

  public fromWindowEvent<T>(eventName: string): Observable<T> {
    return fromEvent<T>(window, eventName);
  }

  public fromEvent<T>(element: HTMLElement, eventName: string): Observable<T> {
    return fromEvent<T>(element, eventName);
  }
}
