import { Subject, Subscription } from "rxjs";
import { IngredientType } from "../../features/plate/plate.model";
import { DragDropService, Draggable } from "../../utils/dragdrop";

export class TrayView {
  private root: HTMLElement;

  private x: number;

  private reachedCustomer = new Subject<void>();
  public reachedCustomer$ = this.reachedCustomer.asObservable();

  private filled = new Subject<IngredientType[]>();
  public filled$ = this.filled.asObservable();

  private sub = new Subscription();
  private draggableSub?: Subscription;

  constructor(private container: HTMLElement, startX: number, expectedIngredients: IngredientType[], dragDropService: DragDropService) {
    this.root = document.createElement('div');
    this.root.classList.add('tray');

    const order = document.createElement('div');
    const lastIngredient = expectedIngredients[expectedIngredients.length - 1];
    if (lastIngredient === IngredientType.Avocado) {
      order.classList.add('order', 'order__regular-avocado');
    } else if (lastIngredient === IngredientType.Tuna) {
      order.classList.add('order', 'order__regular-tuna');
    } else {
      order.classList.add('order', 'order__regular-salmon');
    }
    this.root.appendChild(order);

    container.appendChild(this.root);

    this.x = startX;
    this.root.style.left = `${this.x}px`;

    this.sub.add(dragDropService.dragStarted$.subscribe(draggable => {
      if (draggable.type === Draggable.Plate) {
        this.draggableSub = dragDropService.dropped$.subscribe(ev => {
          const blah = this.root.getBoundingClientRect();
          const insideX = ev.clientX >= blah.left && ev.clientX <= blah.left + blah.width;
          const insideY = ev.clientY >= blah.top && ev.clientY <= blah.top + blah.height;
          if (insideX && insideY) {
            this.filled.next(ev.ingredients ?? []);
          }
        });
      }
    }));
  }

  public complete() {
    this.root.classList.add('tray--filled');
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
