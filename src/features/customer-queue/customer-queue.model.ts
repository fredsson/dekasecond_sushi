import { Subject, Subscription } from "rxjs";
import { EventService, GameTopic } from "../../utils/events";
import { isValueDefined } from "../../utils/sanity";
import { IngredientType } from "../plate/plate.model";

export interface TrayAddedEvent {
  id: number;
}

export interface TrayRemovedEvent {
  id: number;
}

interface Customer {
  id: number;
  expectedIngredients: IngredientType[];
}

export class CustomerQueueModel {
  private nextTrayId = 1;

  private timeUntilNextCustomerInSec = 2;

  private waitingCustomers: Customer[] = [];
  private unhappyCustomers = 0;

  private fired = new Subject<void>();
  public fired$ = this.fired.asObservable();

  private sub = new Subscription();

  constructor(private eventService: EventService) {
    this.sub.add(eventService.addEventListener<TrayRemovedEvent>(GameTopic.TrayRemoved, ({id}) => {
      const unhappy = this.waitingCustomers.find(customer => customer.id === id);
      if (isValueDefined(unhappy)) {
        this.unhappyCustomers++;
      }
      if (this.unhappyCustomers >= 3) {
        this.fired.next();
      }
    }));
    this.sub.add(eventService.addEventListener<any>(GameTopic.TrayFilled, ({id, ingredients}) => {
      this.waitingCustomers = this.waitingCustomers.filter(v => {
        if (v.id !== id) {
          return true;
        }

        return !this.compareIngredients(v.expectedIngredients, ingredients);
      });
    }));
  }

  public update(dt: number) {
    this.timeUntilNextCustomerInSec -= dt;
    if (this.timeUntilNextCustomerInSec < 0) {
      const id = this.nextTrayId++;
      this.timeUntilNextCustomerInSec = 10;
      this.waitingCustomers.push({id, expectedIngredients: [IngredientType.Rice, IngredientType.Salmon]});
      this.eventService.emit<TrayAddedEvent>(GameTopic.TrayAdded, {id});
    }
  }

  public destroy() {
    this.sub.unsubscribe();
  }

  private compareIngredients(expected: IngredientType[], actual: IngredientType[]) {
    return expected.every((e, index) => {
      const a = actual[index];
      return e === a;
    })
  }
}
