import '../../src/shared-style.css';
import './style.css';
import Random from 'canvas-sketch-util/random';
import { animate } from 'motion';
import { generateHSLRamp } from '../../src/colors/rampensau';

type Direction = 'vertical' | 'horizontal';

const columnEl = () => /* html */ `
  <div class="column">
    <div class="column-layer"></div>
    <div class="column-layer"></div>
    <div class="column-layer"></div>
  </div>
`;
const rowEl = () => /* html */ `
  <div class="row">
    <div class="row-layer"></div>
    <div class="row-layer"></div>
    <div class="row-layer"></div>
  </div>
`;

const randomGradient = (rotation = 0) => {
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
  return `linear-gradient(${rotation}deg, ${cssHSL.join(', ')})`;
};

const randomConfig = (rotation = 0) => ({
  columns: Random.rangeFloor(6, 24),
  gradient: randomGradient(rotation),
  waveLength: Random.rangeFloor(1, 4) * Math.PI,
});

function vertical() {
  let config = randomConfig();

  const root = document.createElement('div');
  root.setAttribute('id', Math.random().toString());
  root.style.height = '100%';
  root.style.width = '100%';
  root.style.setProperty('overflow', 'hidden');
  root.style.setProperty('--columns', config.columns.toString());
  root.style.setProperty('--gradient', config.gradient);

  root.innerHTML = /* html */ `
    <div class="v-grid">
      ${Array.from({ length: config.columns }).map(columnEl).join('')}
    </div>
`;

  root.querySelectorAll('.column').forEach((el, idx) => {
    animate(
      el,
      {
        y: '100%',
      },
      {
        delay: Math.sin((idx / config.columns) * config.waveLength) * 0.5,
        duration: 2,
        repeat: Infinity,
      }
    );
  });

  return root;
}

function horizontal() {
  let config = randomConfig(90);

  const root = document.createElement('div');
  root.setAttribute('id', Math.random().toString());
  root.style.height = '100%';
  root.style.width = '100%';
  root.style.setProperty('overflow', 'hidden');
  root.style.setProperty('--rows', config.columns.toString());
  root.style.setProperty('--gradient', config.gradient);

  root.innerHTML = /* html */ `
    <div class="h-grid">
      ${Array.from({ length: config.columns }).map(rowEl).join('')}
    </div>
`;

  root.querySelectorAll('.row').forEach((el, idx) => {
    animate(
      el,
      {
        x: '100%',
      },
      {
        delay: Math.sin((idx / config.columns) * config.waveLength) * 0.5,
        duration: 2,
        repeat: Infinity,
      }
    );
  });

  return root;
}

function top(direction: Direction) {
  const wrapper = document.createElement('div');
  wrapper.style.display = 'flex';
  wrapper.style.flexDirection = 'column';
  wrapper.style.overflow = 'hidden';
  wrapper.style.height = '100%';
  wrapper.style.width = '100%';

  const newSplit = direction === 'vertical' ? vertical() : horizontal();
  const toWrap = document.querySelector<HTMLDivElement>('#app > *')!;

  document.querySelector<HTMLDivElement>('#app')!.insertBefore(wrapper, toWrap);
  wrapper.appendChild(toWrap);
  wrapper.prepend(newSplit);
}

function right(direction: Direction) {
  const wrapper = document.createElement('div');
  wrapper.style.display = 'flex';
  wrapper.style.overflow = 'hidden';
  wrapper.style.height = '100%';
  wrapper.style.width = '100%';

  const newSplit = direction === 'vertical' ? vertical() : horizontal();
  const toWrap = document.querySelector<HTMLDivElement>('#app > *')!;

  document.querySelector<HTMLDivElement>('#app')!.insertBefore(wrapper, toWrap);
  wrapper.appendChild(toWrap);
  wrapper.appendChild(newSplit);
}

function bottom(direction: Direction) {
  const wrapper = document.createElement('div');
  wrapper.style.display = 'flex';
  wrapper.style.flexDirection = 'column';
  wrapper.style.overflow = 'hidden';
  wrapper.style.height = '100%';
  wrapper.style.width = '100%';

  const newSplit = direction === 'vertical' ? vertical() : horizontal();
  const toWrap = document.querySelector<HTMLDivElement>('#app > *')!;

  document.querySelector<HTMLDivElement>('#app')!.insertBefore(wrapper, toWrap);
  wrapper.appendChild(toWrap);
  wrapper.appendChild(newSplit);
}

function left(direction: Direction) {
  const wrapper = document.createElement('div');
  wrapper.style.display = 'flex';
  wrapper.style.overflow = 'hidden';
  wrapper.style.height = '100%';
  wrapper.style.width = '100%';

  const newSplit = direction === 'vertical' ? vertical() : horizontal();
  const toWrap = document.querySelector<HTMLDivElement>('#app > *')!;

  document.querySelector<HTMLDivElement>('#app')!.insertBefore(wrapper, toWrap);
  wrapper.appendChild(toWrap);
  wrapper.prepend(newSplit);
}

window.addEventListener('keydown', (event) => {
  let direction: Direction = 'vertical';

  if (event.shiftKey) {
    direction = 'horizontal';
  }

  if (event.code === 'ArrowRight') {
    right(direction);
  } else if (event.code === 'ArrowLeft') {
    left(direction);
  } else if (event.code === 'ArrowUp') {
    top(direction);
  } else if (event.code === 'ArrowDown') {
    bottom(direction);
  }
});

window.onload = () => {
  const root = vertical();
  document.querySelector<HTMLDivElement>('#app')!.appendChild(root);
};
