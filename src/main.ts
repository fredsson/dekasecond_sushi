import { ConveyorView } from './features/conveyor/conveyor';
import { Timer } from './timer';

window.addEventListener('DOMContentLoaded', () => {
  console.log('Game started!');

  const mainContainer = document.getElementById('app');
  if (!mainContainer) {
    return;
  }

  const timer = new Timer();
});
