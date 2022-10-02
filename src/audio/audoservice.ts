import { TrayAddedEvent } from "../features/customer-queue/customer-queue.model";
import { IngredientType } from "../features/plate/plate.model";
import { EventService, GameTopic } from "../utils/events";
import { isValueDefined } from "../utils/sanity";

function htmlElementIsAudioElement(element: HTMLElement | null | undefined): element is HTMLAudioElement {
  return isValueDefined((element as HTMLAudioElement)?.volume);
}

export class AudioService {
  private backgroundAudioElements: HTMLAudioElement[] = [];

  private soundEffects: Map<string, HTMLAudioElement> = new Map();

  private bgVolume = 0;

  private currentBgm?: HTMLAudioElement;


  private orderSoundEffects: Map<IngredientType, HTMLAudioElement[]> = new Map();

  constructor(eventService: EventService) {
    const bg1 = document.getElementById('bg1');
    if (htmlElementIsAudioElement(bg1)) {
      this.backgroundAudioElements.push(bg1 as HTMLAudioElement);
    }

    const placeIngredientEffect = this.getAudioElement('ingredients_on_plate');
    if (placeIngredientEffect) {
      this.soundEffects.set('ingredients_on_plate', placeIngredientEffect);
    }

    const orderSalmonEffects: HTMLAudioElement[] = [];
    const salmon1Effect = this.getAudioElement('order_salmon1');
    if (salmon1Effect) {
      orderSalmonEffects.push(salmon1Effect);
    }
    const salmon2Effect = this.getAudioElement('order_salmon2');
    if (salmon2Effect) {
      orderSalmonEffects.push(salmon2Effect);
    }

    const salmon3Effect = this.getAudioElement('order_salmon3');
    if (salmon3Effect) {
      orderSalmonEffects.push(salmon3Effect);
    }

    this.orderSoundEffects.set(IngredientType.Salmon, orderSalmonEffects);


    eventService.addEventListener(GameTopic.IngredientAdded, () => {
      const addTray = this.soundEffects.get('ingredients_on_plate');
      if (addTray) {
        addTray.volume = 0.5;
        addTray.play();
      }
    });

    eventService.addEventListener<TrayAddedEvent>(GameTopic.TrayAdded, ev => {
      const lastIngredient = ev.expectedIngredients[ev.expectedIngredients.length - 1];
      const effects = this.orderSoundEffects.get(lastIngredient);
      if (effects) {
        const index = Math.round(Math.random() * (effects.length - 1));
        console.log(index);
        effects[index].play();
      }
    });

  }

  public update(dt: number) {
    if (this.bgVolume <= 0.3 && this.currentBgm) {
      this.bgVolume += dt * 0.05;
      this.currentBgm.volume = this.bgVolume;
    }
  }

  public playRandomBackground() {
    this.currentBgm = this.backgroundAudioElements[0];
    this.bgVolume = 0;
    this.currentBgm.play();
  }


  private getAudioElement(name: string): HTMLAudioElement | undefined {
    const element = document.getElementById(name);
    if (!htmlElementIsAudioElement(element)) {
      return undefined;
    }

    return element;
  }
}
