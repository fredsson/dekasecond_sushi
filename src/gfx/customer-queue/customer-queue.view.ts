import { Subscription } from "rxjs";
import { CustomerOrderCorrectEvent, TrayAddedEvent } from "../../features/customer-queue/customer-queue.model";
import { DragDropService } from "../../utils/dragdrop";
import { EventService, GameTopic } from "../../utils/events";
import { View } from "../renderer";
import { ConveyorView } from "./conveyor.view";
import { CustomerView } from "./customer.view";

export class CustomerQueueView implements View {
  private conveyorView: ConveyorView;
  private customerView: CustomerView;
  private sub = new Subscription();

  constructor(container: HTMLElement, eventService: EventService, dragDropService: DragDropService) {
    this.conveyorView = new ConveyorView(container, dragDropService);
    this.customerView = new CustomerView(container, eventService);

    this.sub.add(this.conveyorView.trayRemoved$.subscribe(id => {
      eventService.emit(GameTopic.TrayRemoved, {id});
    }));

    this.sub.add(this.conveyorView.trayFilled$.subscribe(ev => {
      eventService.emit(GameTopic.TrayFilled, ev);
    }))

    this.sub.add(eventService.addEventListener<TrayAddedEvent>(GameTopic.TrayAdded, ev => {
      this.conveyorView.addTray(ev.id, ev.expectedIngredients);
    }));

    this.sub.add(eventService.addEventListener<CustomerOrderCorrectEvent>(GameTopic.CustomerOrderCorrect, ev => {
      this.conveyorView.completeTray(ev.trayId);
    }));

    this.sub.add(eventService.addEventListener(GameTopic.CustomerRushHourStarted, () => {
      this.conveyorView.startRushHour();
    }));

    this.sub.add(eventService.addEventListener(GameTopic.CustomerRushHourEnded, () => {
      this.conveyorView.endRushHour();
    }));
  }

  public update(dt: number) {
    this.conveyorView.update(dt);
  }

  public destroy() {
    this.sub.unsubscribe();
    this.conveyorView.destroy();
    this.customerView.destroy();
  }
}
