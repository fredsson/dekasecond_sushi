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
  private readonly conveyorElementWidthWithOverlap = 299;

  private sub: Subscription;

  private root: HTMLElement;

  private elements: ConveyorItem[] = [];

  private endOfLastConveyor: number;

  constructor(private container: HTMLElement, dt$: Observable<number>) {
    this.root = document.createElement('div');
    container.appendChild(this.root);

    const containerWidth = container.getBoundingClientRect().width;
    const noOfConveyors = Math.ceil(containerWidth / this.conveyorElementWidthPx) + 1;
    this.endOfLastConveyor = (noOfConveyors - 1) * this.conveyorElementWidthWithOverlap;

    Array.from({length: noOfConveyors}).forEach((_, index) => this.spawnConveyor(container, index));

    this.sub = dt$.subscribe(dt => {
      this.moveConveyors(dt);
    });
  }

  public destroy() {
    this.container.removeChild(this.root);
    this.sub.unsubscribe();
  }

  private moveConveyors(dt: number) {
    this.elements.forEach(item => {
      item.x -= this.conveyorSpeed * dt;

      if (item.x < -this.conveyorElementWidthWithOverlap) {
        item.x = this.endOfLastConveyor;
      }

      // TODO: maybe use cool css animations here instead
      item.element.style.left = `${item.x}px`;
    });
  }

  private spawnConveyor(container: HTMLElement, position: number) {
    const elem = document.createElement('div');
    elem.classList.add('conveyor');
    elem.style.left = `${(position * this.conveyorElementWidthWithOverlap)}px`;
    elem.style.zIndex = `${position}`;

    this.elements.push({
      element: elem,
      x: position * this.conveyorElementWidthWithOverlap,
    });

    container.appendChild(elem);
  }
}
