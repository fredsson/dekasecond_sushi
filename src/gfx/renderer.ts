import { DragDropService } from "../utils/dragdrop";
import { EventService } from "../utils/events";
import { CustomerQueueView } from "./customer-queue/customer-queue.view";
import { PlateView } from "./plate.view";

export class Renderer {
  private customerQueueView: CustomerQueueView;
  private plateView: PlateView;

  constructor(container: HTMLElement, eventService: EventService, dragDropService: DragDropService) {
    this.customerQueueView = new CustomerQueueView(container, eventService, dragDropService);
    this.plateView = new PlateView(container, dragDropService);
  }

  public update(dt: number) {
    this.customerQueueView.update(dt);
  }

  public destroy() {
    this.customerQueueView.destroy();
    this.plateView.destroy();
  }
}
