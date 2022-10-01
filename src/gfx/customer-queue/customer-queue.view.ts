import { Subscription } from "rxjs";
import { TrayAddedEvent } from "../../features/customer-queue/customer-queue.model";
import { DragDropService } from "../../utils/dragdrop";
import { EventService, GameTopic } from "../../utils/events";
import { View } from "../renderer";
import { ConveyorView } from "./conveyor.view";

export class CustomerQueueView implements View {
  private conveyorView: ConveyorView;
  private sub = new Subscription();

  constructor(container: HTMLElement, eventService: EventService, dragDropService: DragDropService) {
    this.conveyorView = new ConveyorView(container, dragDropService);

    this.sub.add(this.conveyorView.trayRemoved$.subscribe(id => {
      eventService.emit(GameTopic.TrayRemoved, {id});
    }));

    this.sub.add(this.conveyorView.trayFilled$.subscribe(ev => {
      eventService.emit(GameTopic.TrayFilled, ev);
    }))

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
