import { EventService, GameTopic } from "../../utils/events";

export class CustomerQueueModel {
  private timeUntilNextCustomerInSec = 2;

  constructor(private eventService: EventService) {
  }

  public update(dt: number) {
    this.timeUntilNextCustomerInSec -= dt;
    if (this.timeUntilNextCustomerInSec < 0) {
      this.timeUntilNextCustomerInSec = 10;
      this.eventService.emit(GameTopic.TrayAdded);
    }
  }
}
