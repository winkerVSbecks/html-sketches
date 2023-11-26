import './style.css';
import { generateHSLRamp } from '../../src/colors/rampensau';
import Random from 'canvas-sketch-util/random';

const colors = generateHSLRamp({
  total: 4, // number of colors in the ramp
  hStart: Math.random() * 360, // hue at the start of the ramp
  hCycles: 1, // number of full hue cycles
  // (.5 = 180°, 1 = 360°, 2 = 720°, etc.)
  sRange: [0.4, 0.35], // saturation range
  sEasing: (x) => Math.pow(x, 2), // saturation easing function

  lRange: [Math.random() * 0.1, 0.9], // lightness range
  lEasing: (x) => Math.pow(x, 1.5), // lightness easing function
});
const cssHSL = colors.map(
  (color) => `hsl(${color[0]}, ${color[1] * 100}%, ${color[2] * 100}%)`
);

const randomColor = () => Random.pick(cssHSL);

const columns = Random.rangeFloor(6, 24);

const root = document.documentElement;
root.style.setProperty('--columns', columns);

document.querySelector<HTMLDivElement>('#app')!.innerHTML = /* html */ `
  <div>
    <div class="grid">
      ${Array.from({ length: columns })
        .map(
          () => /* html */ `
            <div
              class="column"
              style="background-color: ${randomColor()};"
            ></div>
          `
        )
        .join('')}
    </div>
  </div>
`;
