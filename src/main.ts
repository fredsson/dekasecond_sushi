import { ConveyorView } from './features/conveyor/conveyor';
import { Timer } from './timer';

let conveyorView: ConveyorView;

window.addEventListener('DOMContentLoaded', () => {
  console.log('Game started!');

  const mainContainer = document.getElementById('app');
  if (!mainContainer) {
    return;
  }

  const timer = new Timer();
  conveyorView = new ConveyorView(mainContainer, timer.dt$);
});
