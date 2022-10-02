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

  constructor(eventService: EventService) {
    const bg1 = document.getElementById('bg1');
    if (htmlElementIsAudioElement(bg1)) {
      this.backgroundAudioElements.push(bg1 as HTMLAudioElement);
    }

    const addIngredient = document.getElementById('ingredients_on_plate');
    if (htmlElementIsAudioElement(addIngredient)) {
      this.soundEffects.set('ingredients_on_plate', addIngredient);
    }

    eventService.addEventListener(GameTopic.IngredientAdded, () => {
      const addTray = this.soundEffects.get('ingredients_on_plate');
      if (addTray) {
        addTray.volume = 0.5;
        addTray.play();
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
}
