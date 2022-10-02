import { Subject, Subscription } from "rxjs";

export enum GameTopic {
  TrayAdded,
  TrayRemoved,
  TrayFilled,
  CustomerOrderCorrect,
  IngredientAdded
}

export class EventService {
  private topicSubscriptions = new Map<GameTopic, Subject<any>>();

  public addEventListener<T>(topic: GameTopic, callback: (t: T) => void): Subscription {
    const subs = this.topicSubscriptions.get(topic);
    if (!subs) {
      const l = new Subject();
      this.topicSubscriptions.set(topic, l);
      return l.subscribe((t: any) => callback(t));
    }
    return subs.subscribe((t: any) => callback(t));
  }

  public emit<T>(topic: GameTopic, t?: T) {
    const subs = this.topicSubscriptions.get(topic);
    if (subs) {
      subs.next(t);
    }
  }
}
