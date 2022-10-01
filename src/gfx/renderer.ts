import { EventService } from "../utils/events";
import { CustomerQueueView } from "./customer-queue/customer-queue.view";

export class Renderer {
  customerQueueView: CustomerQueueView;

  constructor(container: HTMLElement, eventService: EventService) {
    this.customerQueueView = new CustomerQueueView(container, eventService);
  }

  public update(dt: number) {
    this.customerQueueView.update(dt);
  }

  public destroy() {
    this.customerQueueView.destroy();
  }
}
