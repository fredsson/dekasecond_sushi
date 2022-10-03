import { Subscription } from "rxjs";
import { IngredientType } from "../../features/plate/plate.model";
import { DragDropService, Draggable } from "../../utils/dragdrop";
import { getClientCoordinatesFromEvent } from "../../utils/sanity";
import { View } from "../renderer";



export class IngredientView implements View {
  private static readonly ingredientTypeToStyle: Map<IngredientType, string> = new Map([
    [IngredientType.Rice, 'ingredient__rice'],
    [IngredientType.Salmon, 'ingredient__salmon'],
    [IngredientType.Avocado, 'ingredient__avocado'],
    [IngredientType.Tuna, 'ingredient__tuna'],
  ]);

  private root: HTMLElement;

  private sub = new Subscription();
  private dropSub?: Subscription;

  constructor(private container: HTMLElement, private type: IngredientType, dragDropService?: DragDropService) {
    this.root = document.createElement('div');
    if (dragDropService) {
      this.root.classList.add('ingredient', IngredientView.ingredientTypeToStyle.get(type) ?? 'ingredient__unknown');
    } else {
      this.root.classList.add(
        'ingredient',
        IngredientView.ingredientTypeToStyle.get(type) ?? 'ingredient__unknown',
        (IngredientView.ingredientTypeToStyle.get(type) ?? 'ingredient__unknown') + '--placed'
      );
    }
    container.appendChild(this.root);
    if (dragDropService) {
      this.setupDragAndDrop(dragDropService);
    }
  }

  public update() {
  }

  public destroy() {
    this.container.removeChild(this.root);
  }

  private setupDragAndDrop(dragDropService: DragDropService) {
    this.sub.add(dragDropService.dragStarted$.subscribe(draggable => {
      if (draggable.type === Draggable.Ingredient && draggable.ingredientType === this.type) {
        this.root.style.display = 'none';
      }
    }));

    this.sub.add(dragDropService.dropped$.subscribe(() => {
      this.root.style.display = 'block';
    }));

    this.sub.add(dragDropService.startEvents(this.root).subscribe(startEvent => {
      dragDropService.drag({
        type: Draggable.Ingredient,
        ingredientType: this.type,
        ...getClientCoordinatesFromEvent(startEvent),
      });

      this.dropSub = dragDropService.endEvents((window as any)).subscribe(ev => {
        this.dropSub?.unsubscribe();
        const clientCoordinates = getClientCoordinatesFromEvent(ev);
        dragDropService.drop({
          ...clientCoordinates,
          ingredientType: this.type
        });
      });
    }));
  }
}
