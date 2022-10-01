import { animationFrames, defer, map, Observable } from "rxjs";

export class Timer {
  public dt$: Observable<number>

  private previousFrameStart: number = 0;

  constructor() {
    this.dt$ = defer(() => animationFrames().pipe(
      map(({timestamp}) => {
        const dt = (timestamp - this.previousFrameStart) / 1000
        this.previousFrameStart = timestamp;
        return dt;
      }),
    ));
  }
}
