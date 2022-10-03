import { Subscription } from "rxjs";
import { IngredientType } from "../features/plate/plate.model";
import { DragDropService, Draggable } from "../utils/dragdrop";
import { EventService, GameTopic } from "../utils/events";
import { getClientCoordinatesFromEvent, isValueDefined } from "../utils/sanity";
import { IngredientView } from "./ingredients/ingredient.view";
import { View } from "./renderer";

export class PlateView implements View {
  private root: HTMLElement;
  private sub = new Subscription();
  private dropSub?: Subscription;

  private ingredients: IngredientType[] = [];

  private ingredientViews: IngredientView[]  = [];

  constructor(private container: HTMLElement, eventService: EventService, dragDropService: DragDropService) {
    this.root = document.createElement('div');
    this.root.classList.add('plate');

    this.sub.add(dragDropService.dragStarted$.subscribe(draggable => {
      if (draggable.type === Draggable.Plate) {
        this.root.style.display = 'none';
      }
    }));

    this.sub.add(dragDropService.dropped$.subscribe(ev => {
      if (isValueDefined(ev.ingredientType) && this.isInside(ev.clientX, ev.clientY)) {
        eventService.emit(GameTopic.IngredientAdded);
        this.ingredients.push(ev.ingredientType);
        this.ingredientViews.push(new IngredientView(this.root, ev.ingredientType));
      }
      this.root.style.display = 'block';
    }));

    this.sub.add(dragDropService.startEvents(this.root).subscribe(startEvent => {
      dragDropService.drag({
        type: Draggable.Plate,
        ...getClientCoordinatesFromEvent(startEvent)
      });

      this.dropSub = dragDropService.endEvents((window as any)).subscribe(ev => {
        this.dropSub?.unsubscribe();
        const clientCoordinates = getClientCoordinatesFromEvent(ev);
        dragDropService.drop({
          ...clientCoordinates,
          ingredients: this.ingredients.slice(0),
        });
        this.ingredients = [];
        this.ingredientViews.forEach(v => v.destroy());
        this.ingredientViews = [];
      });
    }));

    container.appendChild(this.root);
  }

  public update() {
  }

  public destroy() {
    this.sub.unsubscribe();
    this.container.removeChild(this.root);
  }

  private isInside(clientX: number, clientY: number) {
    const boundedRects = this.root.getBoundingClientRect();

    const insideX = clientX >= boundedRects.left && clientX <= boundedRects.left + boundedRects.width;
    const insideY = clientY >= boundedRects.top && clientY <= boundedRects.top + boundedRects.height;
    return insideX && insideY;
  }
}
