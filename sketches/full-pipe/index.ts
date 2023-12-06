import '../../src/shared-style.css';
import 'tachyons';
import './style.css';
import { colorScheme } from '../../src/colors/full-pipe';

const root = document.querySelector<HTMLDivElement>('#app')!;

const { colors } = colorScheme(9);

const discrete = `
  <div id="discrete" class="w-50 flex flex-column">
    ${colors
      .map(
        (c) =>
          `<div class="flex-auto flex justify-center items-center tc" style="background-color: ${c}">${c}</div>`
      )
      .join('')}
  </div>`;

const gradient = `<div id="gradient" class="w-50" style="background: linear-gradient(${colors
  .map((c) => c)
  .join(', ')});"></div>
  </div>`;

const circles = `
  <div id="circles" class="flex flex-column absolute absolute--fill">
    ${colors
      .map(
        (c, idx) =>
          `<div class="br-100 absolute" style="background-color: ${c}; width: ${
            ((colors.length - (idx + 1)) / colors.length) * 50
          }vmin; aspect-ratio: 1 / 1; top: 50%; left: 50%; transform: translate(-50%, -50%);"></div>`
      )
      .join('')}
  </div>`;

const el = document.createElement('div');
el.innerHTML = `
  <div class="flex vh-100 sans-serif">
    ${discrete}
    ${gradient}
    ${circles}
  </div>`;
root.appendChild(el);
