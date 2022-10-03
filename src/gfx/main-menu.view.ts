import { fromEvent, Subscription } from "rxjs";
import { EventService, GameTopic } from "../utils/events";
import { View } from "./renderer";

export class MainMenuView implements View {
  private root: HTMLElement;

  private sub: Subscription;

  constructor(private container: HTMLElement, eventService: EventService) {
    this.root = document.createElement('div');
    this.root.id = 'main-menu';

    container.appendChild(this.root);

    this.container.appendChild(this.root);

    this.sub = fromEvent(window, 'click').subscribe(() => {
      eventService.emit(GameTopic.GameStart);
    });
  }

  public update() {
  }

  public destroy(): void {
    this.sub.unsubscribe();
    this.container.removeChild(this.root);
  }
}
