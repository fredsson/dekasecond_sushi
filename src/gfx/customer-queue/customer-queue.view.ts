import { Observable } from "rxjs";
import { EventService, GameTopic } from "../../utils/events";
import { ConveyorView } from "./conveyor.view";

export interface CustomerQueueEvents {
  trayAdded$: Observable<void>;
}

export class CustomerQueueView {
  conveyorView: ConveyorView;

  constructor(container: HTMLElement, eventService: EventService) {
    this.conveyorView = new ConveyorView(container);

    eventService.addEventListener(GameTopic.TrayAdded, () => {
      this.conveyorView.addTray();
    });
  }

  public update(dt: number) {
    this.conveyorView.update(dt);
  }

  public destroy() {
    this.conveyorView.destroy();
  }
}
