import { Hsluv } from 'hsluv';
import Random from 'canvas-sketch-util/random';
import chroma from 'chroma-js';

// Based on https://programmingdesignsystems.com/color/color-schemes/index.html

// oklch( [ lightness = <percentage (0%-100%)> ] [ chroma <number> (0-0.37) ] [ hue <degrees> (0deg-360deg) ]

export function lightnessToLuminance(l: number) {
  if (l <= 8) {
    return (1.0 * l) / 903.2962962;
  } else {
    return 1.0 * Math.pow((l + 16) / 116, 3);
  }
}

export function contrastRatio(l1: number, l2: number) {
  l1 = lightnessToLuminance(l1);
  l2 = lightnessToLuminance(l2);
  return (l1 + 0.05) / (l2 + 0.05);
}

// interface HSLPart {
//   range: [number, number];
//   easing: (x: number) => number;
// }

// interface Hue {
//   start: number;
//   cycles: number;
//   easing: (x: number) => number;
// }

// interface GenerateHSLRampOptions {
//   total: number;
//   hue: Hue;
//   saturation: HSLPart;
//   lightness: HSLPart;
// }

// export function generateHSLRamp({
//   total = 9,
//   hue: h,
//   saturation: s,
//   lightness: l,
// }: GenerateHSLRampOptions) {
//   const lDelta: number = l.range[1] - l.range[0];
//   const sDelta: number = s.range[1] - s.range[0];

//   return new Array(total).fill(0).map((_, idx) => {
//     const relI = idx / (total - 1);

//     return [
//       (360 + h.start + (1 - h.easing(relI)) * (360 * h.cycles)) % 360,
//       s.range[0] + sDelta * s.easing(relI),
//       l.range[0] + lDelta * l.easing(relI),
//     ];
//   });
// }

/*  let hsluvColors = generateHSLRamp({
    total: count,
    hue: {
      start: Random.rangeFloor(0, 360),
      easing: (x: number) => Math.pow(x, 2),
      cycles: 1,
    },
    saturation: {
      range: [40, 35],
      easing: (x: number) => Math.pow(x, 2),
    },
    lightness: {
      range: [Random.range(10, 40), 90],
      easing: (x: number) => Math.pow(x, 1.5),
    },
  }) */

interface HSLPart {
  range: [number, number];
  easing: (x: number) => number;
}

interface GenerateHSLRampOptions {
  total: number;
  hue: HSLPart & { cycles: number };
  saturation: HSLPart;
  lightness: HSLPart;
}

export function generateHSLRamp({
  total = 9,
  hue: h,
  saturation: s,
  lightness: l,
}: GenerateHSLRampOptions) {
  const lDelta: number = l.range[1] - l.range[0];
  const sDelta: number = s.range[1] - s.range[0];

  return new Array(total).fill(0).map((_, idx) => {
    const relI = idx / (total - 1);

    return [
      // h.range[0] + idx * h.range[1],
      (360 + h.range[0] + (1 - h.easing(relI)) * (360 * h.cycles)) % 360,
      s.range[0] + sDelta * s.easing(relI),
      // s.range[0], // + i * range[1],
      // l.range[0] + relI * l.range[1],
      l.range[0] + lDelta * l.easing(relI),
    ];
  });
}

export function colorScheme(count: number = 3, debug = false) {
  let colors = generateHSLRamp({
    total: count,
    hue: {
      range: [Random.rangeFloor(0, 360), Random.rangeFloor(10, 120)],
      easing: (x: number) => Math.pow(x, 2),
      cycles: Random.rangeFloor(1, 4),
    },
    saturation: {
      range: [Random.rangeFloor(30, 40), Random.rangeFloor(60, 100)],
      easing: (x: number) => Math.pow(x, 2),
    },
    lightness: {
      range: [Random.rangeFloor(0, 10), Random.rangeFloor(40, 90)],
      easing: (x: number) => Math.pow(x, 1.5),
    },
  })
    .map((c) => {
      var hsluv = new Hsluv();
      hsluv.hsluv_h = c[0];
      hsluv.hsluv_s = c[1];
      hsluv.hsluv_l = c[2];
      hsluv.hsluvToRgb();

      return chroma.gl(hsluv.rgb_r, hsluv.rgb_g, hsluv.rgb_b).css('hsl');
    })
    // Sort by lightness
    .sort((a, b) => chroma(b).luminance() - chroma(a).luminance());

  const background = Random.pick(colors);
  // Filter out colors that don't have enough contrast with the background
  const foreground = colors.filter((c: string) => {
    if (c === background) return false;
    return chroma.contrast(background, c) > 1.25;
  });

  if (debug) {
    console.log('background');
    console.log(`%c ${background}`, `background: ${background}; color: #fff`);

    console.log('foreground');
    foreground.forEach((c) => {
      console.log(`%c ${c}`, `background: ${c}; color: #fff`);
    });
  }

  return { colors, background, foreground };
}
