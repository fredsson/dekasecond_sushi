import { TrayView } from "./tray.view";

interface ConveyorItem {
  element: HTMLElement;
  x: number;
}

export class ConveyorView {
  private readonly conveyorSpeed = 60;
  private readonly conveyorElementWidthPx = 300;

  private root: HTMLElement;

  private conveyorItem: ConveyorItem;
  private trayItems: TrayView[] = [];

  constructor(private container: HTMLElement) {
    this.root = document.createElement('div');
    container.appendChild(this.root);

    const containerWidth = container.getBoundingClientRect().width;
    const noOfConveyors = Math.ceil(containerWidth / this.conveyorElementWidthPx) + 1;

    this.conveyorItem = this.spawnConveyor(container, noOfConveyors);
  }

  public addTray() {
    this.trayItems.push(new TrayView(this.root, this.container.getBoundingClientRect().width));
  }

  public update(dt: number) {
    this.moveConveyor(dt);
    this.trayItems.forEach(i => i.move(-(this.conveyorSpeed * dt)));
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
