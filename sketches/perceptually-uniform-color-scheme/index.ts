import '../../src/shared-style.css';
import 'tachyons';
import './style.css';
import { colorScheme } from '../../src/colors/perceptually-uniform';

const root = document.querySelector<HTMLDivElement>('#app')!;

for (let index = 0; index < 20; index++) {
  const { colors, background, foreground } = colorScheme(6);

  const el = document.createElement('div');
  el.innerHTML = `
  <div class="palette flex mw7 center mb4 pa3 shadow-2" style="background-color: ${background}">
    ${foreground
      .map(
        (c) =>
          `<div class="color h4 flex-auto" style="background-color: ${c}"></div>`
      )
      .join('')}
  </div>`;
  root.appendChild(el);
}
