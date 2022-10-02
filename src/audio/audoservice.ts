import { isValueDefined } from "../utils/sanity";

function htmlElementIsAudioElement(element: HTMLElement | null | undefined): element is HTMLAudioElement {
  return isValueDefined((element as HTMLAudioElement)?.volume);
}

export class AudioService {
  private backgroundAudioElements: HTMLAudioElement[] = [];

  private bgVolume = 0;

  private currentBgm?: HTMLAudioElement;

  constructor() {
    const bg1 = document.getElementById('bg1');
    if (htmlElementIsAudioElement(bg1)) {
      this.backgroundAudioElements.push(bg1 as HTMLAudioElement);
    }
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
