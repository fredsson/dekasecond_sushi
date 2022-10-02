import { Subject, Subscription } from "rxjs";
import { EventService, GameTopic } from "../../utils/events";
import { isValueDefined } from "../../utils/sanity";
import { IngredientType } from "../plate/plate.model";

export interface TrayAddedEvent {
  expectedIngredients: IngredientType[];
  id: number;
}

export interface TrayRemovedEvent {
  id: number;
}

export interface CustomerOrderCorrectEvent {
  trayId: number;
}

interface Customer {
  trayId: number;
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
      const unhappy = this.waitingCustomers.find(customer => customer.trayId === id);
      if (isValueDefined(unhappy)) {
        this.unhappyCustomers++;
      }
      if (this.unhappyCustomers >= 3) {
        this.fired.next();
      }
    }));
    this.sub.add(eventService.addEventListener<any>(GameTopic.TrayFilled, ({id, ingredients}) => {
      const customer = this.waitingCustomers.find(c => c.trayId === id);
      if (!customer) {
        return;
      }

      const ingredientsMatches = this.compareIngredients(customer.expectedIngredients, ingredients);
      if (!ingredientsMatches) {
        return;
      }
      this.waitingCustomers = this.waitingCustomers.filter(v => v.trayId !== customer.trayId);
      this.eventService.emit<CustomerOrderCorrectEvent>(GameTopic.CustomerOrderCorrect, {trayId: id});
    }));
  }

  public update(dt: number) {
    this.timeUntilNextCustomerInSec -= dt;
    if (this.timeUntilNextCustomerInSec < 0) {
      const id = this.nextTrayId++;
      this.timeUntilNextCustomerInSec = 10;
      const expectedIngredients = this.generateExpectedIngredients();
      this.waitingCustomers.push({trayId: id, expectedIngredients});
      this.eventService.emit<TrayAddedEvent>(GameTopic.TrayAdded, {id, expectedIngredients});
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

  private generateExpectedIngredients(): IngredientType[] {
    const ingredients = [IngredientType.Rice];

    const v = Math.random();

    const isAvocado = v > 0.3 && v <= 0.6;
    const isTuna = v > 0.6;
    if (isAvocado) {
      ingredients.push(IngredientType.Avocado);
    } else if (isTuna) {
      ingredients.push(IngredientType.Tuna);
    } else {
      ingredients.push(IngredientType.Salmon);
    }

    return ingredients;
  }
}
