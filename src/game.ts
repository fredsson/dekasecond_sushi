import { CustomerQueueModel } from "./features/customer-queue/customer-queue.model";
import { EventService, GameTopic } from "./utils/events";

export class Game {
  private customerQueue: CustomerQueueModel;

  constructor(eventService: EventService, restartCallback: () => void) {
    this.customerQueue = new CustomerQueueModel(eventService);

    this.customerQueue.fired$.subscribe(() => {
      eventService.emit(GameTopic.PlayerFired);
      restartCallback();
    });
  }

  public update(dt: number) {
    this.customerQueue.update(dt);
  }

  public destroy() {
    this.customerQueue.destroy();
  }
}
