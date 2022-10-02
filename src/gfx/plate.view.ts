import { Subscription } from "rxjs";
import { IngredientType } from "../features/plate/plate.model";
import { DragDropService, Draggable, eventIsTouchEvent } from "../utils/dragdrop";
import { isValueDefined } from "../utils/sanity";
import { IngredientView } from "./ingredients/ingredient.view";
import { View } from "./renderer";

export class PlateView implements View {
  private root: HTMLElement;
  private sub = new Subscription();
  private dropSub?: Subscription;

  private ingredients: IngredientType[] = [];

  private ingredientViews: IngredientView[]  = [];

  constructor(private container: HTMLElement, dragDropService: DragDropService) {
    this.root = document.createElement('div');
    this.root.classList.add('plate');

    this.sub.add(dragDropService.dragStarted$.subscribe(draggable => {
      if (draggable.type === Draggable.Plate) {
        this.root.style.display = 'none';
      }
    }));

    this.sub.add(dragDropService.dropped$.subscribe(ev => {
      if (isValueDefined(ev.ingredientType)) {
        this.ingredients.push(ev.ingredientType);
        this.ingredientViews.push(new IngredientView(this.root, ev.ingredientType));
      }
      this.root.style.display = 'block';
    }));

    this.sub.add(dragDropService.startEvents(this.root).subscribe(() => {
      dragDropService.drag({type: Draggable.Plate});
      this.dropSub = dragDropService.endEvents((window as any)).subscribe(ev => {
        this.dropSub?.unsubscribe();
        if (eventIsTouchEvent(ev)) {
          dragDropService.drop({
            clientX: ev.changedTouches[0] ? ev.changedTouches[0].clientX : 0,
            clientY: ev.changedTouches[0] ? ev.changedTouches[0].clientY : 0,
            ingredients: this.ingredients.slice(0),
          });
        } else {
          dragDropService.drop({
            clientX: ev.clientX,
            clientY: ev.clientY,
            ingredients: this.ingredients.slice(0),
          });
        }
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
}
