import { CustomerQueueModel } from "./features/customer-queue/customer-queue.model";
import { EventService } from "./utils/events";

export class Game {
  private customerQueue: CustomerQueueModel;

  constructor(eventService: EventService) {
    this.customerQueue = new CustomerQueueModel(eventService);

    this.customerQueue.fired$.subscribe(() => {
      alert('You failed to keep the customers happy!');
      location.reload();
    });
  }

  public update(dt: number) {
    this.customerQueue.update(dt);
  }
}
