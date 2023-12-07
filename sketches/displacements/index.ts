import '../../src/shared-style.css';
import './style.css';
import Random from 'canvas-sketch-util/random';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { colorScheme } from '../../src/colors/full-pipe';
import chroma from 'chroma-js';

gsap.registerPlugin(Flip);

const { colors } = colorScheme(6, true);

const background = colors.pop()!;
const foreground = colors.filter((c: string) => {
  return chroma.contrast(background, c) > 1.25;
});

const noise = (color: string) => `
<svg
  xmlns="http://www.w3.org/2000/svg"
  version="1.1"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  xmlns:svgjs="http://svgjs.dev/svgjs"
  width="100%"
  height="100%"
>
  <defs>
    <filter
      id="nnnoise-filter"
      x="-20%"
      y="-20%"
      width="140%"
      height="140%"
      filterUnits="objectBoundingBox"
      primitiveUnits="userSpaceOnUse"
      color-interpolation-filters="linearRGB"
    >
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.102"
        numOctaves="4"
        seed="15"
        stitchTiles="stitch"
        x="0%"
        y="0%"
        width="100%"
        height="100%"
        result="turbulence"
      ></feTurbulence>
      <feSpecularLighting
        surfaceScale="15"
        specularConstant="0.75"
        specularExponent="20"
        lighting-color="${color}"
        x="0%"
        y="0%"
        width="100%"
        height="100%"
        in="turbulence"
        result="specularLighting"
      >
        <feDistantLight azimuth="3" elevation="100"></feDistantLight>
      </feSpecularLighting>
    </filter>
  </defs>
</svg>`;

const randomColor = () => Random.pick(foreground);

const gridStyles = (
  size: string,
  columns: number,
  rows: number,
  gap: string
) => ({
  display: 'grid',
  'background-color': background,
  'grid-template-columns': `repeat(${columns}, ${size})`,
  'grid-template-rows': `repeat(${rows}, ${size})`,
  'grid-gap': gap,
  'grid-auto-flow': 'dense',
  height: '100%',
  position: 'relative',
});

const gridItem = (w: number, h: number, x?: number, y?: number) => {
  const el = document.createElement('div');
  el.classList.add('item');
  el.setAttribute('data-flip-key', Math.random().toString());

  css(el, {
    'grid-area':
      x !== undefined && y !== undefined
        ? `${y} / ${x} / span ${h} / span ${w}`
        : `auto / auto / span ${h} / span ${w}`,
    'background-color': randomColor(),
  });

  return el;
};

const generateItems = (count: number, columns: number, rows: number) => {
  return Array.from({ length: count }).map(() => {
    const overlap = Random.chance(0.75);

    if (overlap) {
      const x = Random.rangeFloor(0, columns - 2);
      const y = Random.rangeFloor(0, rows - 2);

      return {
        x,
        y,
        w: Random.rangeFloor(2, columns - x),
        h: Random.rangeFloor(2, rows - y),
      };
    }

    return {
      w: Random.rangeFloor(2, columns),
      h: Random.rangeFloor(2, rows),
    };
  });
};

function sketch() {
  const rows = Random.rangeFloor(6, 12);
  const columns = Random.rangeFloor(6, 12);
  const size = '1fr';
  const gap = `${Random.rangeFloor(1, 4)}vw`;
  const count = Random.rangeFloor(4, 12);

  const root = document.querySelector<HTMLDivElement>('#app')!;
  css(root, {
    height: `calc(100dvh - ${gap} * 8)`,
    padding: `calc(4 * ${gap})`,
    // background: background,
  });

  const grid = document.createElement('div');
  css(grid, gridStyles(size, columns, rows, gap));
  root.appendChild(grid);

  const items = generateItems(count, columns, rows);
  const itemEls: HTMLElement[] = [];

  items.forEach((item) => {
    const itemEl = gridItem(item.w, item.h, item.x, item.y);
    grid.appendChild(itemEl);
    itemEls.push(itemEl);
  });

  const noiseEl = document.createElement('div');
  noiseEl.innerHTML = noise(background);
  css(noiseEl, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    filter: "url('#nnnoise-filter')",
    'background-blend-mode': 'hard-light',
  });
  grid.appendChild(noiseEl);

  window.setInterval(() => {
    const state = Flip.getState(itemEls);

    const newItems = generateItems(count, columns, rows);
    itemEls.forEach((el, idx) => {
      const { x, y, w, h } = newItems[idx];
      if (x !== undefined && y !== undefined) {
        el.style.setProperty(
          'grid-area',
          `${y} / ${x} / span ${h} / span ${w}`
        );
      } else {
        el.style.setProperty(
          'grid-area',
          `auto / auto / span ${y} / span ${x}`
        );
      }
    });

    Flip.from(state, {
      duration: 0.6,
      ease: 'power1.inOut',
      stagger: 0.1,
      absolute: true,
    });
  }, 3000);
}

window.onload = () => {
  sketch();
};

function css(element: HTMLElement, style: any) {
  for (const property in style) {
    element.style[property as string] = style[property];
  }
}
