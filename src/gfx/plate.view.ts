import { Subscription } from "rxjs";
import { DragDropService, Draggable } from "../utils/dragdrop";

export class PlateView {
  private root: HTMLElement;
  private sub = new Subscription();
  private dropSub?: Subscription;

  constructor(private container: HTMLElement, dragDropService: DragDropService) {
    this.root = document.createElement('div');
    this.root.classList.add('plate');

    this.sub.add(dragDropService.dragStarted$.subscribe(draggable => {
      if (draggable === Draggable.Plate) {
        this.root.style.display = 'none';
      }
    }));

    this.sub.add(dragDropService.dropped$.subscribe(() => {
      this.root.style.display = 'block';
    }));

    this.sub.add(dragDropService.fromEvent(this.root, 'mousedown').subscribe(() => {
      dragDropService.drag();
      this.dropSub = dragDropService.fromWindowEvent<MouseEvent>('mouseup').subscribe(ev => {
        this.dropSub?.unsubscribe();
        dragDropService.drop(ev);
      });
    }));

    container.appendChild(this.root);
  }

  public destroy() {
    this.sub.unsubscribe();
    this.container.removeChild(this.root);
  }
}
