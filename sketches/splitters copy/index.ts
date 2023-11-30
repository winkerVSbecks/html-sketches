import '../../src/shared-style.css';
import './style.css';
import Random from 'canvas-sketch-util/random';
import { animate } from 'motion';
import { generateHSLRamp } from '../../src/colors/rampensau';

const columnEl = (offset) => /* html */ `
  <div class="column">
    <div class="column-layer"></div>
    <div class="column-layer"></div>
    <div class="column-layer"></div>
  </div>
`;

const randomGradient = () => {
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
  return `linear-gradient(0deg, ${cssHSL.join(', ')})`;
};

const randomConfig = () => ({
  columns: Random.rangeFloor(6, 24),
  gradient: randomGradient(),
  waveLength: Random.rangeFloor(1, 4) * Math.PI,
});

function vertical(fullWidth?: boolean) {
  let config = randomConfig();

  const root = document.createElement('div');
  // if (fullWidth) {
  //   root.classList.add('full-width');
  // }
  root.setAttribute('id', Math.random().toString());
  root.style.setProperty('height', '100%');
  root.style.setProperty('overflow', 'hidden');
  root.style.setProperty('--columns', config.columns.toString());
  root.style.setProperty('--gradient', config.gradient);

  root.innerHTML = /* html */ `
    <div class="grid">
      ${Array.from({ length: config.columns })
        .map((_, idx) =>
          columnEl(Math.sin((idx / config.columns) * config.waveLength))
        )
        .join('')}
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

function top() {
  const wrapper = document.createElement('div');
  wrapper.style.display = 'grid';
  wrapper.style.overflow = 'hidden';
  wrapper.style.height = '100%';

  const newSplit = vertical(true);
  const toWrap = document.querySelector<HTMLDivElement>('#app > *')!;

  document.querySelector<HTMLDivElement>('#app')!.insertBefore(wrapper, toWrap);
  wrapper.appendChild(toWrap);
  wrapper.prepend(newSplit);

  // const originalHTML =
  //   document.querySelector<HTMLDivElement>('#app')!.innerHTML;

  // wrapper.innerHTML = `<div>${originalHTML}</div>`;

  // wrapper.prepend(newSplit);

  // document.querySelector<HTMLDivElement>('#app')!.innerHTML = '';
  // document.querySelector<HTMLDivElement>('#app')!.appendChild(wrapper);
}

function right() {
  const root = vertical();
  document.querySelector<HTMLDivElement>('#app')!.appendChild(root);
}

function bottom() {
  const root = vertical(true);
  document.querySelector<HTMLDivElement>('#app')!.appendChild(root);
}

function left() {
  const root = vertical();
  document.querySelector<HTMLDivElement>('#app')!.prepend(root);
}

window.addEventListener('keydown', (event) => {
  if (event.code === 'ArrowRight') {
    right();
  } else if (event.code === 'ArrowLeft') {
    left();
  } else if (event.code === 'ArrowUp') {
    top();
  } else if (event.code === 'ArrowDown') {
    bottom();
  }
});

window.onload = () => {
  right();
};
