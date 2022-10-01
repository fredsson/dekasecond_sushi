import { Subject } from "rxjs";

export class TrayView {
  private root: HTMLElement;

  private x: number;

  private reachedCustomer = new Subject<void>();
  public reachedCustomer$ = this.reachedCustomer.asObservable();

  constructor(private container: HTMLElement, startX: number) {
    this.root = document.createElement('div');
    this.root.classList.add('tray');

    container.appendChild(this.root);

    this.x = startX;
    this.root.style.left = `${this.x}px`;
  }

  public move(distance: number) {
    this.x += distance;
    this.root.style.left = `${this.x}px`;
    if (this.x <= -this.root.getBoundingClientRect().width) {
      this.reachedCustomer.next();
    }
  }

  public destroy() {
    this.container.removeChild(this.root);
  }

}
