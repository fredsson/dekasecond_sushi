import { Subscription } from "rxjs";
import { IngredientType } from "../../features/plate/plate.model";
import { DragDropService, Draggable, eventIsTouchEvent } from "../../utils/dragdrop";
import { View } from "../renderer";



export class IngredientView implements View {
  private static readonly ingredientTypeToStyle: Map<IngredientType, string> = new Map([
    [IngredientType.Rice, 'ingredient__rice'],
    [IngredientType.Salmon, 'ingredient__salmon'],
  ]);

  private root: HTMLElement;
  private sub = new Subscription();
  private dropSub?: Subscription;

  constructor(private container: HTMLElement, private type: IngredientType, dragDropService: DragDropService) {
    this.root = document.createElement('div');
    this.root.classList.add('ingredient', IngredientView.ingredientTypeToStyle.get(type) ?? 'ingredient__unknown');
    container.appendChild(this.root);

    this.sub.add(dragDropService.dragStarted$.subscribe(draggable => {
      if (draggable.type === Draggable.Ingredient && draggable.ingredientType === type) {
        this.root.style.display = 'none';
      }
    }));

    this.sub.add(dragDropService.dropped$.subscribe(() => {
      this.root.style.display = 'block';
    }));

    this.sub.add(dragDropService.startEvents(this.root).subscribe(() => {
      dragDropService.drag({type: Draggable.Ingredient, ingredientType: this.type});

      this.dropSub = dragDropService.endEvents((window as any)).subscribe(ev => {
        this.dropSub?.unsubscribe();
        if (eventIsTouchEvent(ev)) {
          dragDropService.drop({
            clientX: ev.changedTouches[0] ? ev.changedTouches[0].clientX : 0,
            clientY: ev.changedTouches[0] ? ev.changedTouches[0].clientY : 0,
            ingredientType: this.type
          });
        } else {
          dragDropService.drop({
            clientX: ev.clientX,
            clientY: ev.clientY,
            ingredientType: this.type
          });
        }
      });
    }));
  }

  public update() {
  }

  public destroy() {
    this.container.removeChild(this.root);
  }
}