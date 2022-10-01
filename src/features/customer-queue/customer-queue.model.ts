import { Subject, Subscription } from "rxjs";
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

  private waitingCustomers: number[] = [];
  private unhappyCustomers = 0;

  private fired = new Subject<void>();
  public fired$ = this.fired.asObservable();

  private sub = new Subscription();

  constructor(private eventService: EventService) {
    this.sub.add(eventService.addEventListener<TrayRemovedEvent>(GameTopic.TrayRemoved, ({id}) => {
      const unhappy = this.waitingCustomers.includes(id);
      if (unhappy) {
        this.unhappyCustomers++;
      }
      if (this.unhappyCustomers >= 3) {
        this.fired.next();
      }
    }));
    this.sub.add(eventService.addEventListener<any>(GameTopic.TrayFilled, ({id, ingredients}) => {
      console.log('filled with', ingredients);
      this.waitingCustomers = this.waitingCustomers.filter(v => v !== id);
    }));
  }

  public update(dt: number) {
    this.timeUntilNextCustomerInSec -= dt;
    if (this.timeUntilNextCustomerInSec < 0) {
      const id = this.nextTrayId++;
      this.timeUntilNextCustomerInSec = 10;
      this.waitingCustomers.push(id);
      this.eventService.emit<TrayAddedEvent>(GameTopic.TrayAdded, {id});
    }
  }

  public destroy() {
    this.sub.unsubscribe();
  }
}
