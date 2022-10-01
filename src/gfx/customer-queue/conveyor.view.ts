import { Subject, Subscription } from "rxjs";
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

  constructor(private container: HTMLElement) {
    this.root = document.createElement('div');
    container.appendChild(this.root);

    const containerWidth = container.getBoundingClientRect().width;
    const noOfConveyors = Math.ceil(containerWidth / this.conveyorElementWidthPx) + 1;

    this.conveyorItem = this.spawnConveyor(container, noOfConveyors);
  }

  public addTray(id: number) {
    const tray = new TrayView(this.root, this.container.getBoundingClientRect().width);
    const sub = tray.reachedCustomer$.subscribe(() => {
      this.trayRemoved.next(id);
      tray.destroy();
      this.trayItems.filter(v => v.tray !== tray);
      sub.unsubscribe();
    });
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
