import { Subscription } from "rxjs";
import { TrayAddedEvent } from "../../features/customer-queue/customer-queue.model";
import { EventService, GameTopic } from "../../utils/events";
import { ConveyorView } from "./conveyor.view";

export class CustomerQueueView {
  private conveyorView: ConveyorView;
  private sub = new Subscription();

  constructor(container: HTMLElement, eventService: EventService) {
    this.conveyorView = new ConveyorView(container);

    this.conveyorView.trayRemoved$.subscribe(id => {
      eventService.emit(GameTopic.TrayRemoved, {id});
    });

    this.sub.add(eventService.addEventListener<TrayAddedEvent>(GameTopic.TrayAdded, ev => {
      this.conveyorView.addTray(ev.id);
    }));
  }

  public update(dt: number) {
    this.conveyorView.update(dt);
  }

  public destroy() {
    this.sub.unsubscribe();
    this.conveyorView.destroy();
  }
}
