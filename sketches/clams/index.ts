import '../../src/shared-style.css';
import './style.css';
import Random from 'canvas-sketch-util/random';
import { animate } from 'motion';
import { Color, genMethod } from 'do0dle-colors';

const circle = (
  width: number,
  gradient: string,
  alignment: 'top' | 'bottom' = 'bottom'
) => /* html */ `
  <div class="circle-${alignment}" style="width: ${
  width * 100
}%; background: ${gradient};"></div>
`;

const randomGradients = (count: number, style: genMethod) => {
  const gradients: string[] = [];

  for (let i = 0; i < count; i++) {
    const color = new Color(
      [
        Random.rangeFloor(100, 200),
        Random.rangeFloor(100, 200),
        Random.rangeFloor(100, 200),
      ],
      'rgb'
    );
    const colors = color.getColorScheme(4, style).map((c) => c.getCssOklch());

    gradients.push(`conic-gradient(from 0turn, ${colors.join(', ')})`);
  }

  return gradients;
};

const circleStack = (
  count: number,
  style: genMethod,
  direction: 'clockwise' | 'anti-clockwise',
  alignment: 'top' | 'bottom'
) => {
  const gradients = randomGradients(count, style);

  const pairEl = document.createElement('div');
  pairEl.classList.add('stack');

  pairEl.innerHTML = Array.from({ length: count })
    .map((_, idx) => circle(1 - idx / count, gradients[idx], alignment))
    .join('');

  const rotDelta = (360 / count) * (direction === 'clockwise' ? 1 : -1);

  const animOpts = (idx: number): any => ({
    delay: 1 + (idx / count) * 0.1,
    easing: [[0.16, 1, 0.3, 1], 'linear', [0.7, 0, 0.84, 0]],
    repeat: Infinity,
    duration: 8,
    offset: [0, 0.25, 0.5, 0.75, 1],
  });

  const transform = (angle: number) => `translateX(-50%) rotate(${angle}deg)`;

  if (alignment === 'top') {
    pairEl.querySelectorAll('.circle-top').forEach((el, idx) => {
      animate(
        el,
        {
          transform: [
            transform(0),
            transform(idx * rotDelta),
            transform(idx * rotDelta),
            transform(0),
            transform(0),
          ],
        },
        animOpts(idx)
      );
    });
  } else {
    pairEl.querySelectorAll('.circle-bottom').forEach((el, idx) => {
      animate(
        el,
        {
          transform: [
            transform(180),
            transform(180 - idx * rotDelta),
            transform(180 - idx * rotDelta),
            transform(180),
            transform(180),
          ],
        },
        animOpts(idx)
      );
    });
  }

  return pairEl;
};

function sketch() {
  const resolution = Random.rangeFloor(6, 12);
  const circleCount = Random.rangeFloor(8, 16);
  const size = 100 / resolution;
  const uniform = Random.chance(0.5);
  const gradientStyle = Random.pick([
    'analogous',
    'complimentary',
    'monochromatic',
    'quadratic',
    'split complimentary',
    'tetraidic',
    'triadic',
  ]);
  console.log({
    resolution,
    circleCount,
    size,
    uniform,
    gradientStyle,
  });

  const root = document.querySelector<HTMLDivElement>('#app')!;
  root.style.setProperty('--columns', resolution.toString());
  root.style.setProperty('--rows', resolution.toString());
  root.style.setProperty('--size', `${size}vmax`);

  for (let y = 0; y < resolution; y++) {
    for (let x = 0; x < resolution; x++) {
      const style = uniform
        ? gradientStyle
        : Random.pick([
            'analogous',
            'complimentary',
            'monochromatic',
            'quadratic',
            'split complimentary',
            'tetraidic',
            'triadic',
          ]);

      const pair = circleStack(
        circleCount,
        style,
        x % 2 ? 'clockwise' : 'anti-clockwise',
        y % 2 ? 'top' : 'bottom'
      );
      root.appendChild(pair);
    }
  }
}

window.onload = () => {
  sketch();
};
