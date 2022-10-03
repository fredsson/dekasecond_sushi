import { Subscription } from "rxjs";
import { EventService, GameTopic } from "../../utils/events";
import { View } from "../renderer";

interface CustomerItem {
  element: HTMLElement;
  happy: boolean;
}

export class CustomerView implements View {
  private customers: CustomerItem[];

  private root: HTMLElement;

  private sub = new Subscription();

  constructor(private container: HTMLElement, eventService: EventService) {
    this.root = document.createElement('div');
    this.root.id = 'customer-container';

    this.customers = [
      this.addCustomer(),
      this.addCustomer(),
      this.addCustomer()
    ]

    this.sub.add(eventService.addEventListener(GameTopic.CustomerUnhappy, () => {
      const happyCustomers = this.customers.filter(v => v.happy);
      if (happyCustomers.length) {
        happyCustomers[0].element.classList.add('customer--angry');
        happyCustomers[0].happy = false;
      }
    }));


    container.appendChild(this.root);
  }

  public update() {
  }

  public destroy() {
    this.container.removeChild(this.root);
  }

  private addCustomer(): CustomerItem {
    const element = document.createElement('div');
    element.classList.add('customer');

    this.root.appendChild(element);

    return {
      element,
      happy: true
    };
  }

}
