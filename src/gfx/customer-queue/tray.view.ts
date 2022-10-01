import { Subject, Subscription } from "rxjs";
import { DragDropService, Draggable } from "../../utils/dragdrop";

export class TrayView {
  private root: HTMLElement;

  private x: number;

  private reachedCustomer = new Subject<void>();
  public reachedCustomer$ = this.reachedCustomer.asObservable();

  private filled = new Subject<void>();
  public filled$ = this.filled.asObservable();

  private sub = new Subscription();
  private draggableSub?: Subscription;

  constructor(private container: HTMLElement, startX: number, dragDropService: DragDropService) {
    this.root = document.createElement('div');
    this.root.classList.add('tray');

    container.appendChild(this.root);

    this.x = startX;
    this.root.style.left = `${this.x}px`;

    this.sub.add(dragDropService.dragStarted$.subscribe(draggable => {
      if (draggable === Draggable.Plate) {
        this.draggableSub = dragDropService.dropped$.subscribe(ev => {
          const blah = this.root.getBoundingClientRect();
          const insideX = ev.clientX >= blah.left && ev.clientX <= blah.left + blah.width;
          const insideY = ev.clientY >= blah.top && ev.clientY <= blah.top + blah.height;
          if (insideX && insideY) {
            this.filled.next();
            this.root.classList.add('tray--filled');
          }
        });
      }
    }));
  }

  public move(distance: number) {
    this.x += distance;
    this.root.style.left = `${this.x}px`;
    if (this.x <= -this.root.getBoundingClientRect().width) {
      this.reachedCustomer.next();
    }
  }

  public destroy() {
    this.draggableSub?.unsubscribe();
    this.sub.unsubscribe();
    this.container.removeChild(this.root);
  }

}