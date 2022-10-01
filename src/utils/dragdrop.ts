import { Observable, Subject } from "rxjs";

export enum Draggable {
  Plate,
}

export enum DropTarget {
  ConveyorTray,
}


export class DragDropService {

  private dragStarted = new Subject<Draggable>();
  public dragStarted$: Observable<Draggable> = this.dragStarted.asObservable();


  private dropped = new Subject<void>();
  public dropped$ = this.dropped.asObservable();

  public drag() {
    this.dragStarted.next(Draggable.Plate);
  }

  public drop() {
    this.dropped.next();
  }

  public registerDropTarget() {
  }
}
