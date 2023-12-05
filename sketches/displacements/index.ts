import '../../src/shared-style.css';
import './style.css';
import Random from 'canvas-sketch-util/random';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { colorScheme } from '../../src/colors/perceptually-uniform';

gsap.registerPlugin(Flip);

const { background, foreground } = colorScheme(6, true);

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
    x: Random.rangeFloor(2, Math.floor(columns * 0.75)),
    y: Random.rangeFloor(2, Math.floor(rows * 0.75)),
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
    background: background,
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

function css(element: HTMLElement, style: Partial<CSSStyleDeclaration>) {
  for (const property in style) {
    element.style[property as string] = style[property];
  }
}
