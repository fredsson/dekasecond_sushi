import { Subscription } from "rxjs";
import { EventService, GameTopic } from "../utils/events";
import { View } from "./renderer";

export class ScoreView implements View {
  private root: HTMLElement;
  private sub = new Subscription();

  private score = 0;
  private scoreMultiplier = 1;

  constructor(private container: HTMLElement, eventService: EventService) {
    this.root = document.createElement('div');
    this.root.id = 'score-container';

    this.container.appendChild(this.root);

    this.sub.add(eventService.addEventListener(GameTopic.CustomerRushHourStarted, () => {
      this.scoreMultiplier = 5;
    }));

    this.sub.add(eventService.addEventListener(GameTopic.CustomerRushHourEnded, () => {
      this.scoreMultiplier = 1;
    }));

    this.sub.add(eventService.addEventListener(GameTopic.CustomerOrderCorrect, () => {
      this.score += 100 * this.scoreMultiplier;
      this.updateScore();
    }));

    this.updateScore();

  }

  public update() {
  }

  public destroy() {
    this.sub.unsubscribe();
    this.score = 0;
    this.scoreMultiplier = 1;
    this.container.removeChild(this.root);
  }

  private updateScore() {
    this.root.innerText = `Score: ${this.score}`;
  }
}
