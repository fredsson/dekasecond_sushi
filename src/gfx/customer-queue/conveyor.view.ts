import { Subject, Subscription } from "rxjs";
import { IngredientType } from "../../features/plate/plate.model";
import { DragDropService } from "../../utils/dragdrop";
import { TrayView } from "./tray.view";

interface ConveyorItem {
  element: HTMLElement;
  x: number;
}

interface TrayItem {
  tray: TrayView;
  reachedCustomerSub: Subscription;
}

export class ConveyorView {
  private readonly conveyorSpeed = 60;
  private readonly conveyorElementWidthPx = 300;

  private root: HTMLElement;

  private conveyorItem: ConveyorItem;
  private trayItems: TrayItem[] = [];

  private trayRemoved = new Subject<number>();
  public trayRemoved$ = this.trayRemoved.asObservable();

  private trayFilled = new Subject<{id: number, ingredients: IngredientType[]}>();
  public trayFilled$ = this.trayFilled.asObservable();

  constructor(private container: HTMLElement, private dragDropService: DragDropService) {
    this.root = document.createElement('div');
    this.root.id = 'conveyor-container';
    container.appendChild(this.root);

    const containerWidth = container.getBoundingClientRect().width;
    const noOfConveyors = Math.ceil(containerWidth / this.conveyorElementWidthPx) + 1;

    this.conveyorItem = this.spawnConveyor(this.root, noOfConveyors);
  }

  public addTray(id: number) {
    const tray = new TrayView(this.root, this.container.getBoundingClientRect().width, this.dragDropService);
    const sub = tray.reachedCustomer$.subscribe(() => {
      tray.destroy();
      this.trayItems = this.trayItems.filter(v => v.tray !== tray);
      sub.unsubscribe();
      this.trayRemoved.next(id);
    });
    sub.add(tray.filled$.subscribe(ingredients => {
      this.trayFilled.next({id, ingredients});
    }));

    this.trayItems.push({
      tray,
      reachedCustomerSub: sub
    });
  }

  public update(dt: number) {
    this.moveConveyor(dt);
    this.trayItems.forEach(i => i.tray.move(-(this.conveyorSpeed * dt)));
  }

  public destroy() {
    this.trayItems.forEach(i => i.tray.destroy());
    this.container.removeChild(this.root);
  }

  private moveConveyor(dt: number) {
    this.conveyorItem.x -= this.conveyorSpeed * dt;

    if (this.conveyorItem.x < -this.conveyorElementWidthPx) {
      this.conveyorItem.x = 0;
    }
    // TODO: maybe use cool css animations here instead
    this.conveyorItem.element.style.left = `${this.conveyorItem.x}px`;
  }

  private spawnConveyor(container: HTMLElement, noOfConveyorsNeeded: number) {
    const elem = document.createElement('div');
    elem.classList.add('conveyor');
    elem.style.width = `${this.conveyorElementWidthPx * noOfConveyorsNeeded}px`

    container.appendChild(elem);
    return {
      element: elem,
      x: 0,
    };
  }
}
