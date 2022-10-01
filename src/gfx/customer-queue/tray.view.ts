
export class TrayView {
  private root: HTMLElement;

  private x: number;

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
  }

  public destroy() {
    this.container.removeChild(this.root);
  }

}
