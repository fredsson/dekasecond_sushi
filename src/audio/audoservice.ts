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
  private nextBgm?: HTMLAudioElement;


  private orderSoundEffects: Map<IngredientType, HTMLAudioElement[]> = new Map();
  private rushHourBgm?: HTMLAudioElement;

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

    this.rushHourBgm = this.getAudioElement('bg_rush_hour');

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
        effects[index].play();
      }
    });

    eventService.addEventListener(GameTopic.CustomerRushHourStarted, () => {
      const rushHour = this.getAudioElement('rush_hour');
      if (rushHour) {
        this.nextBgm = this.rushHourBgm;
        setTimeout(() => rushHour.play(), 100);
      }
    });

    eventService.addEventListener(GameTopic.CustomerRushHourEnded, () => {
      const rushHour = this.getAudioElement('rush_hour_end')
      if (rushHour) {
        this.nextBgm = this.backgroundAudioElements[0];
        rushHour.play();
      }
    });
  }

  public update(dt: number) {
    if (this.nextBgm) {
      this.bgVolume -= dt * 0.05;
      if (this.bgVolume <= 0) {
        this.currentBgm?.pause();
        this.currentBgm = this.nextBgm;
        this.currentBgm.play();
        this.nextBgm = undefined;
      }
    } else if (this.bgVolume <= 0.3 && this.currentBgm) {
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
