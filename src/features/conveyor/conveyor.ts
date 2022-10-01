import { Observable, Subscription } from "rxjs";

export class Conveyor {
}

interface ConveyorItem {
  element: HTMLElement;
  x: number;
}

export class ConveyorView {
  private readonly conveyorSpeed = 60;
  private readonly conveyorElementWidthPx = 300;

  private sub: Subscription;

  private root: HTMLElement;

  private conveyorItem: ConveyorItem;

  constructor(private container: HTMLElement, dt$: Observable<number>) {
    this.root = document.createElement('div');
    container.appendChild(this.root);

    const containerWidth = container.getBoundingClientRect().width;
    const noOfConveyors = Math.ceil(containerWidth / this.conveyorElementWidthPx) + 1;

    this.conveyorItem = this.spawnConveyor(container, noOfConveyors);

    this.sub = dt$.subscribe(dt => {
      this.moveConveyor(dt);
    });
  }

  public destroy() {
    this.container.removeChild(this.root);
    this.sub.unsubscribe();
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
