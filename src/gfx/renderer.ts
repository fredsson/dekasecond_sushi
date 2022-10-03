import { IngredientType } from "../features/plate/plate.model";
import { DragDropService } from "../utils/dragdrop";
import { EventService, GameTopic } from "../utils/events";
import { CustomerQueueView } from "./customer-queue/customer-queue.view";
import { HandView } from "./hand.view";
import { IngredientView } from "./ingredients/ingredient.view";
import { MainMenuView } from "./main-menu.view";
import { PlateView } from "./plate.view";

export interface View {
  update(dt: number): void;
  destroy(): void;
}

export class Renderer {
  views: View[] = [];

  mainMenu: MainMenuView;

  constructor(container: HTMLElement, eventService: EventService, dragDropService: DragDropService) {
    this.mainMenu = new MainMenuView(container, eventService);

    eventService.addEventListener(GameTopic.GameStart, () => {
      this.mainMenu.destroy();
      this.views.push(new CustomerQueueView(container, eventService, dragDropService));
      this.views.push(new PlateView(container, eventService, dragDropService));
      this.views.push(new IngredientView(container, IngredientType.Rice, dragDropService));
      this.views.push(new IngredientView(container, IngredientType.Salmon, dragDropService));
      this.views.push(new IngredientView(container, IngredientType.Avocado, dragDropService));
      this.views.push(new IngredientView(container, IngredientType.Tuna, dragDropService));
      this.views.push(new HandView(container, dragDropService))
    });
  }

  public update(dt: number) {
    this.views.forEach(v => v.update(dt));
  }

  public destroy() {
    this.mainMenu.destroy();
    this.views.forEach(v => v.destroy());
    this.views = [];
  }
}
