import { Subject } from "rxjs";
import { EventService, GameTopic } from "../../utils/events";

export interface TrayAddedEvent {
  id: number;
}

export interface TrayRemovedEvent {
  id: number;
}

export class CustomerQueueModel {
  private nextTrayId = 1;

  private timeUntilNextCustomerInSec = 2;

  private unhappyCustomers = 0;

  private fired = new Subject<void>();
  public fired$ = this.fired.asObservable();

  constructor(private eventService: EventService) {
    eventService.addEventListener<TrayRemovedEvent>(GameTopic.TrayRemoved, () => {
      this.unhappyCustomers++;
      if (this.unhappyCustomers >= 3) {
        this.fired.next();
      }
    });
  }

  public update(dt: number) {
    this.timeUntilNextCustomerInSec -= dt;
    if (this.timeUntilNextCustomerInSec < 0) {
      this.timeUntilNextCustomerInSec = 10;
      this.eventService.emit<TrayAddedEvent>(GameTopic.TrayAdded, { id: this.nextTrayId++ });
    }
  }
}
