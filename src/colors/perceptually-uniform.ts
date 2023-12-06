import { Hsluv } from 'hsluv';
import Random from 'canvas-sketch-util/random';

// Based on https://programmingdesignsystems.com/color/color-schemes/index.html

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

export function colorScheme(count: number = 3, debug = false) {
  // Which color values should we start with?
  const start = {
    h: Random.rangeFloor(0, 360),
    s: Random.rangeFloor(40, 100),
    l: Random.rangeFloor(0, 60),
  };

  // How much should each color change?
  const delta = {
    h: Random.rangeFloor(10, 120),
    s: Random.rangeFloor(15, 40),
    l: Random.rangeFloor(15, 80 - start.l), //40),
  };

  let hsluvColors = [];

  // Generate the colors
  for (let i = 0; i < count; i++) {
    var hsluv = new Hsluv();

    hsluv.hsluv_h = start.h + i * delta.h;
    hsluv.hsluv_s = start.s; // + i * delta.s;
    hsluv.hsluv_l = start.l + i * delta.l;
    hsluvColors.push(hsluv);
  }

  // Sort by lightness
  hsluvColors.sort((a, b) => b.hsluv_l - a.hsluv_l);

  // Filter out colors that don't have enough contrast with the lightest color
  const lightest = hsluvColors[0];

  hsluvColors = hsluvColors.filter((c, index) => {
    if (index === 0) return true;
    const ratio = contrastRatio(c.hsluv_l, lightest.hsluv_l);
    // return ratio < 0.222; // 4.5:1
    return ratio < 0.2; // 5:1
  });

  const colors = hsluvColors.map((c) => {
    const hsluv = `hslv(${c.hsluv_h}, ${c.hsluv_s}, ${c.hsluv_l}))`;
    c.hsluvToLch();
    return {
      lch: `lch(${c.lch_l}, ${c.lch_c}, ${c.lch_h})`,
      hsluv,
    };
  });

  const lchClrs = colors.map((c) => c.lch);

  const background = Random.pick(lchClrs);
  const foreground = lchClrs.filter((c) => c !== background);

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
