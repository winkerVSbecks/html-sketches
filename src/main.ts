import 'tachyons';

const sketches = [
  { name: 'Motion System', path: '/sketches/motion-system/' },
  { name: 'Splitters', path: '/sketches/splitters/' },
  { name: 'Magnetic', path: '/sketches/magnetic/' },
  { name: 'Clams', path: '/sketches/clams/' },
  {
    name: 'Perceptually Uniform Color Scheme',
    path: '/sketches/perceptually-uniform-color-scheme/',
  },
  { name: 'Full Pipe', path: '/sketches/full-pipe/' },
  { name: 'Displacements', path: '/sketches/displacements/' },
];

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="pa4 mt6 sans-serif">
    <div class="mw6 center">
      <h1 class="fw6 f6 lh-copy mb2 ma0 ttu tracked mid-gray ph2">Sketches</h1>
      <ul class="pa0 ma0 bt b--moon-gray">
      ${sketches
        .map(
          (sketch) => /* html */ `
          <li class="list bb b--moon-gray">
            <a class="db pa2 f5 lh-solid link black bg-animate hover-light-purple hover-bg-near-white" href="${sketch.path}">${sketch.name}</a>
          </li>
        `
        )
        .join('')}
      </ul>
    </div>
  </div>
`;
