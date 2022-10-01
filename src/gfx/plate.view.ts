import { DragDropService, Draggable } from "../utils/dragdrop";

export class PlateView {
  private root: HTMLElement

  constructor(private container: HTMLElement, dragDropService: DragDropService) {
    this.root = document.createElement('div');
    this.root.classList.add('plate');

    dragDropService.dragStarted$.subscribe(draggable => {
      if (draggable === Draggable.Plate) {
        this.root.style.display = 'none';
      }
    });

    dragDropService.dropped$.subscribe(() => {
      this.root.style.display = 'block';
    })

    this.root.addEventListener('mousedown',() => {
      console.log('click!!');
      dragDropService.drag();
      // add shadow element here!
      document.addEventListener('mouseup', event => {
        dragDropService.drop();
        console.log('mouseup!!', event.target);
        // remove shadow element, find what was dropped on!
      });
    });

    container.appendChild(this.root);
  }

  public destroy() {
    this.container.removeChild(this.root);
  }
}
