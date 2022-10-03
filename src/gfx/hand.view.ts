import { fromEvent, Subscription } from "rxjs";
import { DragDropService } from "../utils/dragdrop";
import { View } from "./renderer";

export class HandView implements View {
  private root: HTMLElement;

  private sub = new Subscription();

  private mouseMoveSub?: Subscription;

  constructor(private container: HTMLElement, dragDropService: DragDropService) {
    this.root = document.createElement('div');
    this.root.classList.add('hand');
    this.root.style.display = 'none';

    this.container.appendChild(this.root);

    this.sub.add(dragDropService.dragStarted$.subscribe(startEvent => {
      this.root.style.left = `${startEvent.clientX - 40}px`;
      this.root.style.top = `${startEvent.clientY - 40}px`;
      this.root.style.display = 'block';

      this.mouseMoveSub = fromEvent<MouseEvent>(window, 'mousemove').subscribe(ev => {
        this.root.style.left = `${ev.clientX - 40}px`;
        this.root.style.top = `${ev.clientY - 40}px`;
      });
    }));

    this.sub.add(dragDropService.dropped$.subscribe(() => {
      this.mouseMoveSub?.unsubscribe();
      this.root.style.display = 'none';
    }));

  }

  public update() {
  }

  public destroy() {
    this.container.removeChild(this.root);
    this.sub.unsubscribe();
  }

}
