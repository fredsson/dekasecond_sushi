import { Game } from './game';
import { Renderer } from './gfx/renderer';
import { Timer } from './timer';
import { DragDropService } from './utils/dragdrop';
import { EventService } from './utils/events';

window.addEventListener('DOMContentLoaded', () => {
  console.log('Game started!');

  const mainContainer = document.getElementById('app');
  if (!mainContainer) {
    return;
  }

  const timer = new Timer();
  const eventService = new EventService();
  const dragDropService = new DragDropService();


  const restartCallback = () => {
    game.destroy();
    renderer.destroy();

    alert('You failed to keep the customers happy!');

    game = new Game(eventService, restartCallback);
    renderer = new Renderer(mainContainer, eventService, dragDropService);
  };

  let game = new Game(eventService, restartCallback);
  let renderer = new Renderer(mainContainer, eventService, dragDropService);

  timer.dt$.subscribe(dt => {
    game.update(dt);

    renderer.update(dt);
  });
});
