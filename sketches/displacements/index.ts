import '../../src/shared-style.css';
import './style.css';
import Random from 'canvas-sketch-util/random';
import { generateRandomColorRamp } from 'fettepalette';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { colorScheme } from '../../src/colors/perceptually-uniform';

gsap.registerPlugin(Flip);

// const clrs = generateRandomColorRamp({
//   total: 4,
//   centerHue: Random.range(0, 300),
//   hueCycle: Random.range(0.5, 1), //0.5,
//   curveMethod: 'lamé',
//   curveAccent: 0.2,
//   offsetTint: 0.251,
//   offsetShade: 0.01,
//   tintShadeHueShift: 0.0,
//   offsetCurveModTint: 0.03,
//   offsetCurveModShade: 0.03,
//   minSaturationLight: [0, 0],
//   maxSaturationLight: [1, 1],
// });

// const hsl = (c) => `hsl(${c[0]}, ${c[1] * 100}%, ${c[2] * 100}%)`;

// const bg = hsl(Random.pick(clrs.light));
// const colors = clrs.all.map(hsl).filter((c) => c !== bg);
// const randomColor = () => Random.pick(colors);

const clrs = colorScheme(6);
const bg = Random.pick(clrs);
const colors = clrs.filter((c) => c !== bg);
console.log(colors, bg);

const randomColor = () => Random.pick(colors);

const gridStyles = (
  size: string,
  columns: number,
  rows: number,
  gap: string
) => ({
  display: 'grid',
  'background-color': bg,
  'grid-template-columns': `repeat(${columns}, ${size})`,
  'grid-template-rows': `repeat(${rows}, ${size})`,
  'grid-gap': gap,
  // 'grid-auto-rows': size,
  // 'grid-auto-columns': size,
  'grid-auto-flow': 'dense',
  height: '100%',
});

const gridItem = (x: number, y: number) => {
  const el = document.createElement('div');
  el.classList.add('item');
  el.setAttribute('data-flip-key', Math.random().toString());

  css(el, {
    // @ts-ignore-next-line
    'grid-area': `auto / auto / span ${y} / span ${x}`,
    'background-color': randomColor(),
  });

  return el;
};

const generateItems = (count: number, columns: number, rows: number) => {
  return Array.from({ length: count }).map(() => ({
    x: Random.rangeFloor(1, Math.floor(columns * 0.75)),
    y: Random.rangeFloor(1, Math.floor(rows * 0.75)),
  }));
};

function sketch() {
  const rows = Random.rangeFloor(6, 12);
  const columns = Random.rangeFloor(6, 12);
  const size = '1fr';
  const gap = `${Random.rangeFloor(1, 4)}vw`;
  const count = Random.rangeFloor(4, 12);

  const root = document.querySelector<HTMLDivElement>('#app')!;
  css(root, {
    height: `calc(100dvh - ${gap} * 2)`,
    padding: gap,
    background: bg,
  });

  const grid = document.createElement('div');
  css(grid, gridStyles(size, columns, rows, gap));
  root.appendChild(grid);

  const items = generateItems(count, columns, rows);
  const itemEls: HTMLElement[] = [];

  items.forEach((item) => {
    const itemEl = gridItem(item.x, item.y);
    grid.appendChild(itemEl);
    itemEls.push(itemEl);
  });

  window.setInterval(() => {
    const state = Flip.getState(itemEls);

    const newItems = generateItems(count, columns, rows);
    itemEls.forEach((el, idx) => {
      const { x, y } = newItems[idx];
      el.style.setProperty('grid-area', `auto / auto / span ${y} / span ${x}`);
    });

    Flip.from(state, {
      duration: 1,
      ease: 'power1.inOut',
      stagger: 0.1,
      absolute: true,
    });
  }, 4000);
}

window.onload = () => {
  sketch();
};

function css(element: HTMLElement, style: Partial<CSSStyleDeclaration>) {
  for (const property in style) {
    element.style[property as string] = style[property];
  }
}
