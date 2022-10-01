import { TrayAddedEvent } from "../../features/customer-queue/customer-queue.model";
import { EventService, GameTopic } from "../../utils/events";
import { ConveyorView } from "./conveyor.view";

export class CustomerQueueView {
  conveyorView: ConveyorView;

  constructor(container: HTMLElement, eventService: EventService) {
    this.conveyorView = new ConveyorView(container);

    this.conveyorView.trayRemoved$.subscribe(id => {
      eventService.emit(GameTopic.TrayRemoved, {id});
    });

    eventService.addEventListener<TrayAddedEvent>(GameTopic.TrayAdded, ev => {
      this.conveyorView.addTray(ev.id);
    });
  }

  public update(dt: number) {
    this.conveyorView.update(dt);
  }

  public destroy() {
    this.conveyorView.destroy();
  }
}
