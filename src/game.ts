import { CustomerQueueModel } from "./features/customer-queue/customer-queue.model";
import { EventService } from "./utils/events";

export class Game {
  private customerQueue: CustomerQueueModel;

  constructor(eventService: EventService) {
    this.customerQueue = new CustomerQueueModel(eventService);
  }

  public update(dt: number) {
    this.customerQueue.update(dt);
  }
}
