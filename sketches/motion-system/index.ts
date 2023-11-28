import '../../src/shared-style.css';
import './style.css';
import Random from 'canvas-sketch-util/random';
import { animate, stagger } from 'motion';
import { generateHSLRamp } from '../../src/colors/rampensau';

const columnEl = (offset) => /* html */ `
  <div class="column">
    <div class="column-layer"></div>
    <div class="column-layer"></div>
    <div class="column-layer"></div>
  </div>
`;

function sketch() {
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

  let config = {
    columns: Random.rangeFloor(6, 24),
    gradient: `linear-gradient(0deg, ${cssHSL.join(', ')})`,
    waveLength: Random.rangeFloor(1, 4) * Math.PI,
  };

  const root = document.documentElement;
  root.style.setProperty('--columns', config.columns.toString());
  root.style.setProperty('--gradient', config.gradient);

  document.querySelector<HTMLDivElement>('#app')!.innerHTML = /* html */ `
  <div>
    <div class="grid">
      ${Array.from({ length: config.columns })
        .map((_, idx) =>
          columnEl(Math.sin((idx / config.columns) * config.waveLength))
        )
        .join('')}
    </div>
  </div>
`;

  document.querySelectorAll('.column').forEach((el, idx) => {
    const offset = Math.abs(
      Math.sin((idx / config.columns) * config.waveLength)
    );
    const y = `${offset * 100 + 100}vh`;

    animate(
      el,
      {
        // y: [`${-offset * 100}vh`, `${-offset * 100 + Math.sign(offset) * 100}vh`],
        y: '100vh',
      },
      {
        delay: Math.sin((idx / config.columns) * config.waveLength) * 0.5,
        duration: 2,
        repeat: Infinity,
      }
    );
  });
}

window.onload = () => {
  sketch();
};

window.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    console.log('Space');

    document.querySelector<HTMLDivElement>('#app')!.innerHTML = '';
    sketch();
  }
});
