import { Subject, Subscription } from "rxjs";
import { IngredientType } from "../../features/plate/plate.model";
import { DragDropService } from "../../utils/dragdrop";
import { TrayView } from "./tray.view";

interface ConveyorItem {
  element: HTMLElement;
  x: number;
}

interface TrayItem {
  trayId: number;
  tray: TrayView;
  reachedCustomerSub: Subscription;
}

export class ConveyorView {
  private readonly defaultConveyorSpeed;
  private conveyorSpeed : number;
  private readonly conveyorElementWidthPx = 300;

  private root: HTMLElement;
  private trayContainer: HTMLElement;

  private conveyorItem: ConveyorItem;
  private trayItems: TrayItem[] = [];

  private trayRemoved = new Subject<number>();
  public trayRemoved$ = this.trayRemoved.asObservable();

  private trayFilled = new Subject<{id: number, ingredients: IngredientType[]}>();
  public trayFilled$ = this.trayFilled.asObservable();

  private containerWidth: number;

  constructor(private container: HTMLElement, private dragDropService: DragDropService) {
    this.root = document.createElement('div');
    this.root.id = 'conveyor-container';
    container.appendChild(this.root);

    this.trayContainer = document.createElement('div');
    this.trayContainer.id = 'tray-container';
    this.root.appendChild(this.trayContainer);

    this.containerWidth = container.getBoundingClientRect().width;
    const noOfConveyors = Math.ceil(this.containerWidth / this.conveyorElementWidthPx) + 1;

    this.defaultConveyorSpeed = this.calculateConveyorSpeed();
    this.conveyorSpeed = this.defaultConveyorSpeed;
    console.log(this.defaultConveyorSpeed);

    this.conveyorItem = this.spawnConveyor(this.root, noOfConveyors);
  }

  public addTray(id: number, expectedIngredients: IngredientType[]) {
    const tray = new TrayView(this.trayContainer, this.container.getBoundingClientRect().width, expectedIngredients, this.dragDropService);
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
      trayId: id,
      tray,
      reachedCustomerSub: sub
    });
  }

  public completeTray(trayId: number) {
    const trayItem = this.trayItems.find(i => i.trayId === trayId);
    if (trayItem) {
      trayItem.tray.complete();
    }
  }

  public startRushHour() {
    const speed = this.defaultConveyorSpeed / 3;
    const modifier = 1 + Math.round(Math.random() * 2);

    this.conveyorSpeed = this.defaultConveyorSpeed + (speed * modifier);
  }

  public endRushHour() {
    this.conveyorSpeed = this.defaultConveyorSpeed;
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

  private calculateConveyorSpeed() {
    return 80 + (40 * (this.containerWidth / 300));
  }
}
