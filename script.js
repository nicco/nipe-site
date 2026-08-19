const SVG_NS = "http://www.w3.org/2000/svg";
const svg = document.querySelector("#signal");
const ribbon = document.querySelector("#signal-ribbon");
const texture = document.querySelector("#signal-texture");
const glow = document.querySelector("#signal-glow");
const pixelPattern = document.querySelector("#signal-pixels");
const flowLinesGroup = document.querySelector("#flow-lines");
const shockDropsGroup = document.querySelector("#shock-drops");
const morseStream = document.querySelector("#morse-stream");
const root = document.documentElement;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const debugEnabled = new URLSearchParams(window.location.search).has("debug");
const debugState = { events: [], latest: null, samples: [] };
window.__nipeDebug = debugState;

// Centerline skeleton extracted from the supplied font's combined nipe vector.
const FONT_ROUTE = [
  [0, 0.3679], [0.03249, 0.31114], [0.07826, 0.19651], [0.09687, 0.15393],
  [0.10425, 0.14083], [0.10868, 0.13537], [0.1137, 0.13319], [0.11991, 0.13755],
  [0.12345, 0.14847], [0.12552, 0.15939], [0.13024, 0.22052], [0.13467, 0.35699],
  [0.13703, 0.36135], [0.14028, 0.35699], [0.14265, 0.34389], [0.14708, 0.30349],
  [0.16125, 0.14738], [0.16923, 0.07751], [0.17838, 0.0262], [0.18547, 0.00218],
  [0.18931, 0], [0.19167, 0.00328], [0.19374, 0.01201], [0.19787, 0.05568],
  [0.20142, 0.12773], [0.20496, 0.24454], [0.20762, 0.29803], [0.20998, 0.32751],
  [0.21559, 0.3679], [0.2215, 0.39083], [0.22652, 0.40393], [0.23715, 0.41812],
  [0.24749, 0.4214], [0.26344, 0.41594], [0.28086, 0.39956], [0.30272, 0.369],
  [0.329, 0.32205], [0.3671, 0.23908], [0.3863, 0.20415], [0.399, 0.18996],
  [0.4111, 0.18559], [0.41229, 0.18996], [0.41553, 0.18122], [0.41731, 0.18013],
  [0.41553, 0.18122], [0.41229, 0.18996], [0.41051, 0.22271], [0.39929, 0.29148],
  [0.39338, 0.33952], [0.39102, 0.36354], [0.38895, 0.39956], [0.38866, 0.42795],
  [0.38925, 0.44323], [0.39102, 0.46507], [0.39368, 0.48144], [0.39752, 0.49563],
  [0.40343, 0.50764], [0.41317, 0.51638], [0.43562, 0.51419], [0.45747, 0.49891],
  [0.48671, 0.46834], [0.525, 0.448], [0.56, 0.416], [0.592, 0.372],
  [0.619, 0.316], [0.641, 0.246], [0.658, 0.17], [0.67425, 0.09607],
  [0.68074, 0.08297], [0.6899, 0.07642], [0.69167, 0.08515], [0.69285, 0.11245],
  [0.69197, 0.17467], [0.68813, 0.26638], [0.67838, 0.42576], [0.6775, 0.46616],
  [0.67395, 0.49563], [0.67041, 0.5524], [0.667, 0.62], [0.661, 0.7],
  [0.654, 0.79], [0.648, 0.865], [0.644, 0.915], [0.642, 0.945],
  [0.643, 0.962], [0.647, 0.973], [0.653, 0.975], [0.659, 0.968],
  [0.663, 0.95], [0.665, 0.918], [0.666, 0.87], [0.668, 0.8],
  [0.672, 0.72], [0.677, 0.63], [0.681, 0.55], [0.687, 0.46],
  [0.68695, 0.45415], [0.70378, 0.36245], [0.71973, 0.28384], [0.73272, 0.22707],
  [0.74808, 0.17358], [0.7531, 0.16921], [0.75399, 0.1714], [0.75458, 0.19105],
  [0.75369, 0.20852], [0.74424, 0.29913], [0.72327, 0.45961], [0.72239, 0.47926],
  [0.71855, 0.49236], [0.71618, 0.51201], [0.71234, 0.52511], [0.71116, 0.54803],
  [0.70171, 0.6048], [0.69669, 0.62555], [0.69315, 0.62882], [0.69108, 0.62664],
  [0.69019, 0.619], [0.69079, 0.59498], [0.69256, 0.57642], [0.69669, 0.55022],
  [0.70437, 0.52293], [0.7088, 0.51965], [0.70703, 0.53057], [0.7091, 0.52074],
  [0.71087, 0.51965], [0.71264, 0.52511], [0.71618, 0.51201], [0.71855, 0.49236],
  [0.72239, 0.47926], [0.72475, 0.48908], [0.73095, 0.4869], [0.75399, 0.45742],
  [0.79149, 0.40393], [0.84141, 0.32205], [0.87212, 0.25], [0.88157, 0.23144],
  [0.88777, 0.22271], [0.89604, 0.21725], [0.89959, 0.20742], [0.90018, 0.17249],
  [0.90313, 0.12227], [0.9052, 0.10044], [0.91051, 0.06332], [0.91494, 0.04803],
  [0.9176, 0.04694], [0.92144, 0.05131], [0.9238, 0.06114], [0.92558, 0.07424],
  [0.92646, 0.09061], [0.92646, 0.1179], [0.92469, 0.14192], [0.91967, 0.17467],
  [0.91317, 0.19651], [0.90756, 0.20633], [0.90018, 0.2107], [0.89959, 0.20742],
  [0.90018, 0.20961], [0.90165, 0.27729], [0.9049, 0.32424], [0.90815, 0.34825],
  [0.91465, 0.37227], [0.92203, 0.38319], [0.92942, 0.38428], [0.93798, 0.381],
  [0.94802, 0.37118], [0.9619, 0.35153], [0.97312, 0.33188], [0.99793, 0.2762],
  [1, 0.27511],
];

// Half-width sampled from the font outline's distance field at each route point.
const FONT_RADII = [
  0.00916, 0.00959, 0.00917, 0.00938, 0.01025, 0.01047, 0.01199, 0.01112,
  0.01397, 0.01548, 0.02183, 0.01592, 0.01614, 0.01331, 0.01156, 0.01156,
  0.01047, 0.01199, 0.01157, 0.01352, 0.01375, 0.01439, 0.01615, 0.02074,
  0.0262, 0.024, 0.01833, 0.01527, 0.01112, 0.0107, 0.01112, 0.01069,
  0.01092, 0.01026, 0.01025, 0.00938, 0.00959, 0.01112, 0.01439, 0.01724,
  0.02377, 0.02903, 0.02183, 0.02074, 0.02183, 0.02903, 0.02377, 0.02398,
  0.02398, 0.02398, 0.02509, 0.02466, 0.024, 0.02268, 0.0214, 0.01832,
  0.01592, 0.01375, 0.01308, 0.01287, 0.01265, 0.01156, 0.00959, 0.01025,
  0.00938, 0.01069, 0.00917, 0.01157, 0.01178, 0.01638, 0.01898, 0.02183,
  0.02293, 0.02465, 0.026, 0.028, 0.03, 0.03, 0.029, 0.028,
  0.027, 0.025, 0.023, 0.021, 0.019, 0.017, 0.015, 0.013,
  0.012, 0.011, 0.011, 0.012, 0.013, 0.014, 0.016, 0.015,
  0.01112, 0.00851, 0.00851, 0.00938, 0.01157, 0.01636, 0.01702, 0.01638,
  0.01724, 0.02311, 0.02377, 0.02336, 0.02159, 0.02159, 0.02051, 0.02159,
  0.01832, 0.01439, 0.01462, 0.01527, 0.01396, 0.01352, 0.01199, 0.01004,
  0.01004, 0.01178, 0.0075, 0.01157, 0.01724, 0.0216, 0.02159, 0.02159,
  0.02336, 0.01636, 0.01156, 0.01156, 0.01178, 0.00872, 0.01091, 0.01069,
  0.01069, 0.01352, 0.02423, 0.02248, 0.02137, 0.02072, 0.01834, 0.01396,
  0.01332, 0.01223, 0.01091, 0.01025, 0.01047, 0.01069, 0.01069, 0.01091,
  0.01178, 0.01199, 0.0253, 0.02423, 0.02509, 0.02182, 0.02028, 0.02072,
  0.01832, 0.01484, 0.0131, 0.01092, 0.00959, 0.00872, 0.00872, 0.01025,
  0.00872,
];

const SAMPLE_COUNT = 200;
const FRAME_INTERVAL = 1000 / 24;
const FLOW_LINE_OFFSETS = [-0.72, -0.48, -0.24, 0.24, 0.48, 0.72];
const ROUTE_ASPECT = 3.6965;
const MORSE_MESSAGE = "Simplicity is the ultimate sophistication.";
const MORSE_SYMBOL_GAP = 2;
const MORSE_LETTER_GAP = 3;
const MORSE_WORD_GAP = 7;
const MORSE_WIDTH_RATIO = 0.3;
const SHOCK_DROP_SPEED = 0.22;
const SHOCK_DROP_LIFETIME = 2.2;
const MORSE_CODE = {
  a: ".-", b: "-...", c: "-.-.", d: "-..", e: ".", f: "..-.", g: "--.",
  h: "....", i: "..", j: ".---", k: "-.-", l: ".-..", m: "--", n: "-.",
  o: "---", p: ".--.", q: "--.-", r: ".-.", s: "...", t: "-", u: "..-",
  v: "...-", w: ".--", x: "-..-", y: "-.--", z: "--..", ",": "--..--",
  ".": ".-.-.-",
};
const pulses = [];
const guidePoints = [];
const points = [];
const upper = [];
const lower = [];
const flowLines = [];
const morseMarks = [];
const shockDrops = [];

let morseTotalUnits = 1;
let width = window.innerWidth;
let height = window.innerHeight;
let pointerX = width * 0.5;
let pointerY = height * 0.5;
let smoothPointerX = pointerX;
let smoothPointerY = pointerY;
let pointerActive = false;
let previousTimestamp = 0;
let morseLayoutCache = null;
let lastSecondaryFrame = -1;
let lastDebugLogTime = -Infinity;
let nextAmbientDropTime = 0;

function recordDebugEvent(type, details = {}) {
  const event = { type, time: performance.now(), ...details };
  debugState.events.push(event);
  if (debugState.events.length > 80) debugState.events.shift();
  if (debugEnabled) console.debug("[nipe:event]", event);
}

function createSvgElement(name, attributes = {}) {
  const element = document.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
  return element;
}

function smoothStepRange(value, start, end) {
  const position = Math.max(0, Math.min(1, (value - start) / (end - start)));
  return position * position * (3 - 2 * position);
}

function signalNoise(value) {
  const noise = Math.sin(value * 12.9898 + 78.233) * 43758.5453;
  return noise - Math.floor(noise);
}

function buildMorseMarks(message) {
  const characters = message.toLowerCase().split("");
  const marks = [];
  let cursor = 0;
  characters.forEach((character, characterIndex) => {
    const code = MORSE_CODE[character];
    if (!code) return;
    code.split("").forEach((symbol, symbolIndex) => {
      const duration = symbol === "." ? 1 : 3;
      marks.push({
        kind: symbol === "." ? "dot" : "dash",
        center: cursor + duration * 0.5,
        duration,
      });
      cursor += duration;
      const finalSymbol = symbolIndex === code.length - 1;
      const nextCharacter = characters[characterIndex + 1];
      const messageEnd = characterIndex === characters.length - 1;
      const gap = finalSymbol
        ? (nextCharacter === " " || messageEnd ? MORSE_WORD_GAP : MORSE_LETTER_GAP)
        : MORSE_SYMBOL_GAP;
      marks[marks.length - 1].gapAfter = gap;
      cursor += gap;
    });
  });
  return { marks, totalUnits: cursor };
}

function mapFontPoint([x, y], index) {
  const compactViewport = width < 720;
  const naturalWidth = Math.min(
    width * (compactViewport ? 0.98 : 0.78),
    height * (compactViewport ? 3.1 : 2.72),
  );
  const wordWidth = naturalWidth * (compactViewport ? 0.96 : 0.91);
  const wordHeight = naturalWidth / ROUTE_ASPECT * (compactViewport ? 1.2 : 1);
  const compression = 0.055;
  const transition = Math.max(0, Math.min(1, (x - 0.46) / 0.2));
  const easedTransition = transition * transition * (3 - 2 * transition);
  const tightenedX = x + compression * 0.5 - compression * easedTransition;
  const groupedSpacing = (
    smoothStepRange(x, 0.34, 0.42) * 0.018
    + smoothStepRange(x, 0.57, 0.69) * 0.025
    + smoothStepRange(x, 0.74, 0.84) * 0.018
  );
  const groupedX = tightenedX + 0.0305 - groupedSpacing;
  const iInward = Math.max(0, 1 - Math.abs(index - 43) / 8) * 0.026;
  const pBowlEntry = smoothStepRange(index, 95, 101);
  const pBowlExit = 1 - smoothStepRange(index, 127, 135);
  const pBowlInfluence = Math.min(pBowlEntry, pBowlExit);
  const pBowlLift = pBowlInfluence * 0.058;
  const pBowlWiden = Math.max(0, x - 0.686) * 0.32 * pBowlInfluence;
  const eLoopEntry = smoothStepRange(index, 136, 141);
  const eLoopExit = 1 - smoothStepRange(index, 152, 157);
  const eLoopInfluence = Math.min(eLoopEntry, eLoopExit);
  const expandedEX = 0.909 + (x - 0.909) * 1.35;
  const expandedEY = 0.14 + (y - 0.14) * 1.25;
  const eX = x + (expandedEX - x) * eLoopInfluence;
  const eY = y + (expandedEY - y) * eLoopInfluence;
  return {
    x: (width - wordWidth) * 0.5
      + (groupedX + (eX - x) + pBowlWiden - iInward) * wordWidth,
    y: (height - wordHeight) * 0.5 + (eY - pBowlLift) * wordHeight,
    radius: Math.max(0.0075, FONT_RADII[index]) * wordHeight * 1.16,
  };
}

function cubicPoint(start, controlOne, controlTwo, end, t) {
  const inverse = 1 - t;
  return {
    x: inverse ** 3 * start.x
      + 3 * inverse ** 2 * t * controlOne.x
      + 3 * inverse * t ** 2 * controlTwo.x
      + t ** 3 * end.x,
    y: inverse ** 3 * start.y
      + 3 * inverse ** 2 * t * controlOne.y
      + 3 * inverse * t ** 2 * controlTwo.y
      + t ** 3 * end.y,
  };
}

function cubicValue(start, controlOne, controlTwo, end, t) {
  const inverse = 1 - t;
  return inverse ** 3 * start
    + 3 * inverse ** 2 * t * controlOne
    + 3 * inverse * t ** 2 * controlTwo
    + t ** 3 * end;
}

function softenPointChain(source, passes = 3, amount = 0.21) {
  let softened = source.map((point) => ({ ...point }));
  for (let pass = 0; pass < passes; pass += 1) {
    const nextPass = [{ ...softened[0] }];
    for (let index = 0; index < softened.length - 1; index += 1) {
      const start = softened[index];
      const end = softened[index + 1];
      nextPass.push({
        x: start.x * (1 - amount) + end.x * amount,
        y: start.y * (1 - amount) + end.y * amount,
        radius: start.radius * (1 - amount) + end.radius * amount,
      });
      nextPass.push({
        x: start.x * amount + end.x * (1 - amount),
        y: start.y * amount + end.y * (1 - amount),
        radius: start.radius * amount + end.radius * (1 - amount),
      });
    }
    nextPass.push({ ...softened[softened.length - 1] });
    softened = nextPass;
  }
  return softened;
}

// Turn the extracted point chain into one continuous centerline before
// calculating its outline. This keeps the ribbon, glow and dots on the same
// curve instead of smoothing several independent polygon edges afterwards.
function sampleSpline(source, subdivisions = 4) {
  const spline = [];
  for (let index = 0; index < source.length - 1; index += 1) {
    const previous = source[Math.max(0, index - 1)];
    const current = source[index];
    const next = source[index + 1];
    const following = source[Math.min(source.length - 1, index + 2)];
    const controlOne = {
      x: current.x + (next.x - previous.x) / 6,
      y: current.y + (next.y - previous.y) / 6,
      radius: current.radius + (next.radius - previous.radius) / 6,
    };
    const controlTwo = {
      x: next.x - (following.x - current.x) / 6,
      y: next.y - (following.y - current.y) / 6,
      radius: next.radius - (following.radius - current.radius) / 6,
    };

    for (let step = 0; step < subdivisions; step += 1) {
      const t = step / subdivisions;
      const point = cubicPoint(current, controlOne, controlTwo, next, t);
      point.radius = Math.max(0.5, cubicValue(
        current.radius,
        controlOne.radius,
        controlTwo.radius,
        next.radius,
        t,
      ));
      spline.push(point);
    }
  }
  spline.push({ ...source[source.length - 1] });
  return spline;
}

function buildGuide() {
  const compactViewport = width < 720;
  const fontSource = FONT_ROUTE.map(mapFontPoint);
  const first = fontSource[0];
  const second = fontSource[1];
  const last = fontSource[fontSource.length - 1];
  const late = fontSource[fontSource.length - 6];
  const leftSpan = first.x + 2;
  const rightSpan = width + 2 - last.x;
  const entryLength = Math.hypot(second.x - first.x, second.y - first.y) || 1;
  const entryTangentX = (second.x - first.x) / entryLength;
  const entryTangentY = (second.y - first.y) / entryLength;
  const exitLength = Math.hypot(last.x - late.x, last.y - late.y) || 1;
  const exitTangentX = (last.x - late.x) / exitLength;
  const exitTangentY = (last.y - late.y) / exitLength;
  const entryHandle = Math.min(leftSpan * 0.44, height * 0.1);
  const exitHandle = Math.min(rightSpan * 0.46, height * 0.11);
  const entryStart = {
    x: -2,
    y: first.y + (compactViewport ? Math.min(height * 0.014, 12) : Math.min(height * 0.072, 56)),
  };
  const entryControlOne = {
    x: leftSpan * 0.34,
    y: entryStart.y + (compactViewport ? Math.min(height * 0.006, 5) : Math.min(height * 0.034, 26)),
  };
  const entryControlTwo = {
    x: first.x - entryTangentX * entryHandle,
    y: first.y - entryTangentY * entryHandle,
  };
  const exitEnd = {
    x: width + 2,
    y: last.y + (compactViewport ? Math.min(height * 0.012, 10) : Math.min(height * 0.058, 46)),
  };
  const exitControlOne = {
    x: last.x + exitTangentX * exitHandle,
    y: last.y + exitTangentY * exitHandle,
  };
  const exitControlTwo = {
    x: width + 2 - rightSpan * 0.3,
    y: exitEnd.y + (compactViewport ? Math.min(height * 0.006, 5) : Math.min(height * 0.03, 24)),
  };
  const source = [];

  for (let step = 0; step < 16; step += 1) {
    const t = step / 16;
    const point = cubicPoint(entryStart, entryControlOne, entryControlTwo, first, t);
    point.radius = first.radius * (0.7 + t * 0.3);
    source.push(point);
  }
  source.push(...fontSource);
  for (let step = 1; step <= 16; step += 1) {
    const t = step / 16;
    const point = cubicPoint(last, exitControlOne, exitControlTwo, exitEnd, t);
    point.radius = last.radius * (1 - t * 0.3);
    source.push(point);
  }
  const pathSource = sampleSpline(softenPointChain(source), 3);
  const lengths = [0];
  for (let index = 1; index < pathSource.length; index += 1) {
    lengths.push(lengths[index - 1] + Math.hypot(
      pathSource[index].x - pathSource[index - 1].x,
      pathSource[index].y - pathSource[index - 1].y,
    ));
  }

  guidePoints.length = 0;
  let sourceIndex = 1;
  const sampleCount = width < 720 ? 150 : SAMPLE_COUNT;
  for (let index = 0; index < sampleCount; index += 1) {
    const target = lengths[lengths.length - 1] * index / (sampleCount - 1);
    while (sourceIndex < lengths.length - 1 && lengths[sourceIndex] < target) sourceIndex += 1;
    const startLength = lengths[sourceIndex - 1];
    const sectionLength = lengths[sourceIndex] - startLength || 1;
    const mix = (target - startLength) / sectionLength;
    const start = pathSource[sourceIndex - 1];
    const end = pathSource[sourceIndex];
    guidePoints.push({
      x: start.x + (end.x - start.x) * mix,
      y: start.y + (end.y - start.y) * mix,
      radius: start.radius + (end.radius - start.radius) * mix,
      u: index / (sampleCount - 1),
    });
  }

  for (let pass = 0; pass < 4; pass += 1) {
    const coordinates = guidePoints.map((point) => ({ x: point.x, y: point.y }));
    for (let index = 1; index < guidePoints.length - 1; index += 1) {
      guidePoints[index].x = (
        coordinates[index - 1].x
        + coordinates[index].x * 4
        + coordinates[index + 1].x
      ) / 6;
      guidePoints[index].y = (
        coordinates[index - 1].y
        + coordinates[index].y * 4
        + coordinates[index + 1].y
      ) / 6;
    }
  }

  for (let pass = 0; pass < 3; pass += 1) {
    const radii = guidePoints.map((point) => point.radius);
    guidePoints.forEach((point, index) => {
      const twoBefore = radii[Math.max(0, index - 2)];
      const before = radii[Math.max(0, index - 1)];
      const after = radii[Math.min(radii.length - 1, index + 1)];
      const twoAfter = radii[Math.min(radii.length - 1, index + 2)];
      point.radius = (twoBefore + before * 2 + radii[index] * 3 + after * 2 + twoAfter) / 9;
    });
  }
}

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  buildGuide();
  morseLayoutCache = null;
  lastSecondaryFrame = -1;
}

function curveThrough(list, moveTo = true) {
  if (!list.length) return "";
  let path = moveTo ? `M ${list[0].x.toFixed(2)} ${list[0].y.toFixed(2)}` : "";
  for (let index = 0; index < list.length - 1; index += 1) {
    const previous = list[Math.max(0, index - 1)];
    const current = list[index];
    const next = list[index + 1];
    const following = list[Math.min(list.length - 1, index + 2)];
    const controlOneX = current.x + (next.x - previous.x) / 6;
    const controlOneY = current.y + (next.y - previous.y) / 6;
    const controlTwoX = next.x - (following.x - current.x) / 6;
    const controlTwoY = next.y - (following.y - current.y) / 6;
    path += ` C ${controlOneX.toFixed(2)} ${controlOneY.toFixed(2)},`;
    path += ` ${controlTwoX.toFixed(2)} ${controlTwoY.toFixed(2)},`;
    path += ` ${next.x.toFixed(2)} ${next.y.toFixed(2)}`;
  }
  return path;
}

function polygonThrough(upperEdge, lowerEdge, centerline) {
  if (!upperEdge.length || !lowerEdge.length) return "";
  const reversedLower = lowerEdge.slice().reverse();
  const end = centerline[centerline.length - 1];
  const start = centerline[0];
  let path = curveThrough(upperEdge);
  path += ` Q ${end.x.toFixed(2)} ${end.y.toFixed(2)},`;
  path += ` ${reversedLower[0].x.toFixed(2)} ${reversedLower[0].y.toFixed(2)}`;
  path += curveThrough(reversedLower, false);
  path += ` Q ${start.x.toFixed(2)} ${start.y.toFixed(2)},`;
  path += ` ${upperEdge[0].x.toFixed(2)} ${upperEdge[0].y.toFixed(2)} Z`;
  return path;
}

function roundedPolygonThrough(upperEdge, lowerEdge, centerline) {
  if (!upperEdge.length || !lowerEdge.length || centerline.length < 2) return "";
  const reversedLower = lowerEdge.slice().reverse();
  const start = centerline[0];
  const startNext = centerline[1];
  const end = centerline[centerline.length - 1];
  const endPrevious = centerline[centerline.length - 2];
  const startLength = Math.hypot(startNext.x - start.x, startNext.y - start.y) || 1;
  const endLength = Math.hypot(end.x - endPrevious.x, end.y - endPrevious.y) || 1;
  const startTangent = {
    x: (startNext.x - start.x) / startLength,
    y: (startNext.y - start.y) / startLength,
  };
  const endTangent = {
    x: (end.x - endPrevious.x) / endLength,
    y: (end.y - endPrevious.y) / endLength,
  };
  const startRadius = Math.hypot(
    upperEdge[0].x - lowerEdge[0].x,
    upperEdge[0].y - lowerEdge[0].y,
  ) * 0.5;
  const last = upperEdge.length - 1;
  const endRadius = Math.hypot(
    upperEdge[last].x - lowerEdge[last].x,
    upperEdge[last].y - lowerEdge[last].y,
  ) * 0.5;
  // A single cubic half-circle keeps both ends fully rounded even as the dash tapers.
  const capControl = 4 / 3;

  let path = curveThrough(upperEdge);
  path += ` C ${(upperEdge[last].x + endTangent.x * endRadius * capControl).toFixed(2)}`;
  path += ` ${(upperEdge[last].y + endTangent.y * endRadius * capControl).toFixed(2)},`;
  path += ` ${(lowerEdge[last].x + endTangent.x * endRadius * capControl).toFixed(2)}`;
  path += ` ${(lowerEdge[last].y + endTangent.y * endRadius * capControl).toFixed(2)},`;
  path += ` ${lowerEdge[last].x.toFixed(2)} ${lowerEdge[last].y.toFixed(2)}`;
  path += curveThrough(reversedLower, false);
  path += ` C ${(lowerEdge[0].x - startTangent.x * startRadius * capControl).toFixed(2)}`;
  path += ` ${(lowerEdge[0].y - startTangent.y * startRadius * capControl).toFixed(2)},`;
  path += ` ${(upperEdge[0].x - startTangent.x * startRadius * capControl).toFixed(2)}`;
  path += ` ${(upperEdge[0].y - startTangent.y * startRadius * capControl).toFixed(2)},`;
  path += ` ${upperEdge[0].x.toFixed(2)} ${upperEdge[0].y.toFixed(2)} Z`;
  return path;
}

function createShockDrop(originU, direction, options = {}) {
  const element = createSvgElement("path", { class: "shock-drop" });
  shockDropsGroup.append(element);
  shockDrops.push({
    age: 0,
    direction,
    element,
    lengthScale: options.lengthScale || 1,
    lifetime: options.lifetime || SHOCK_DROP_LIFETIME,
    originU,
    speed: options.speed || SHOCK_DROP_SPEED,
  });
  while (shockDrops.length > 14) {
    shockDrops.shift().element.remove();
  }
}

function createAmbientDrop() {
  const direction = Math.random() < 0.5 ? -1 : 1;
  const originU = 0.08 + Math.random() * 0.84;
  const speed = 0.4 + Math.random() * 0.2;
  const distanceToEdge = direction < 0 ? originU : 1 - originU;
  createShockDrop(originU, direction, {
    lengthScale: 0.75 + Math.random() * 0.65,
    lifetime: distanceToEdge / speed + 0.2,
    speed,
  });
  recordDebugEvent("ambient-drop", { direction, originU, speed });
}

function createPulse(x, y) {
  let closestIndex = 0;
  let closestDistance = Infinity;
  points.forEach((point, index) => {
    const distance = (point.x - x) ** 2 + (point.y - y) ** 2;
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });
  pulses.length = 0;
  pulses.push({
    u: closestIndex / Math.max(1, points.length - 1),
    age: 0,
    strength: Math.max(2.5, Math.min(height * 0.005, 5)),
  });
  createShockDrop(pulses[0].u, -1);
  createShockDrop(pulses[0].u, 1);
  recordDebugEvent("pulse", { point: closestIndex, x, y });

  const ring = document.createElement("i");
  ring.className = "pulse-ring";
  ring.style.left = `${x}px`;
  ring.style.top = `${y}px`;
  document.body.append(ring);
  ring.addEventListener("animationend", () => ring.remove());
}

function calculateGeometry(time) {
  points.length = 0;
  upper.length = 0;
  lower.length = 0;
  const interferenceFrame = Math.floor(time * 24);
  const interferenceAmount = reducedMotion.matches ? 0 : 1;
  const jitterX = (signalNoise(interferenceFrame) - 0.5) * 1.2 * interferenceAmount;
  const jitterY = (signalNoise(interferenceFrame + 41) - 0.5) * 0.45 * interferenceAmount;
  const syncFrame = Math.floor(time * 3.5);
  const tearCenter = height * (0.36 + signalNoise(syncFrame + 113) * 0.28);
  const tearBurst = signalNoise(syncFrame + 71) > 0.68 ? 1 : 0.28;
  const tearShift = (signalNoise(interferenceFrame + 19) - 0.5)
    * 5 * tearBurst * interferenceAmount;
  for (let index = 0; index < guidePoints.length; index += 1) {
    const guide = guidePoints[index];
    const edge = Math.pow(Math.sin(Math.PI * guide.u), 0.45);
    const ambientY = (
      Math.sin(guide.x / width * Math.PI * 7 + time * 0.52) * 2.2
      + Math.sin((guide.x + guide.y) / (width + height) * Math.PI * 17 - time * 0.31)
    ) * edge;
    const scanTear = Math.exp(-Math.pow((guide.y - tearCenter) / 5.5, 2));
    let x = guide.x + jitterX + scanTear * tearShift;
    let y = guide.y + ambientY + jitterY;
    if (pointerActive) {
      const distanceSquared = ((smoothPointerX - x) / width) ** 2
        + ((smoothPointerY - y) / height) ** 2;
      const influence = Math.exp(-distanceSquared / 0.0045) * 0.14;
      x += (smoothPointerX - x) * influence;
      y += (smoothPointerY - y) * influence;
    }

    points.push({ x, y, u: guide.u, radius: guide.radius });
  }

  for (let index = 0; index < points.length; index += 1) {
    const previous = points[Math.max(0, index - 1)];
    const next = points[Math.min(points.length - 1, index + 1)];
    const dx = next.x - previous.x;
    const dy = next.y - previous.y;
    const length = Math.hypot(dx, dy) || 1;
    points[index].normalX = -dy / length;
    points[index].normalY = dx / length;
    let pulseThickness = 0;
    for (const pulse of pulses) {
      const distance = Math.abs(points[index].u - pulse.u);
      const waveFront = pulse.age * 0.22;
      const shell = Math.exp(-Math.pow((distance - waveFront) * 55, 2));
      pulseThickness += shell * pulse.strength * Math.exp(-pulse.age * 1.3);
    }
    points[index].baseThickness = points[index].radius
      * (1 + Math.sin(time * 1.05 + points[index].u * Math.PI * 4) * 0.035);
    points[index].thickness = points[index].baseThickness + pulseThickness;
    upper.push({
      x: points[index].x + points[index].normalX * points[index].thickness,
      y: points[index].y + points[index].normalY * points[index].thickness,
    });
    lower.push({
      x: points[index].x - points[index].normalX * points[index].thickness,
      y: points[index].y - points[index].normalY * points[index].thickness,
    });
  }
}

function updateArtwork(time) {
  const polygonPath = polygonThrough(upper, lower, points);
  const referenceThickness = guidePoints.reduce(
    (maximum, point) => Math.max(maximum, point.radius),
    1,
  );
  const referenceMarkWidth = referenceThickness * 2 * MORSE_WIDTH_RATIO;
  let pathLength = 0;
  for (let index = 1; index < points.length; index += 1) {
    pathLength += Math.hypot(
      points[index].x - points[index - 1].x,
      points[index].y - points[index - 1].y,
    );
  }
  const samplePathAt = (sampleTravel) => {
    const samplePosition = sampleTravel * (points.length - 1);
    const sampleIndex = Math.max(0, Math.min(points.length - 1, Math.floor(samplePosition)));
    const sampleNextIndex = Math.min(points.length - 1, sampleIndex + 1);
    const sampleMix = samplePosition - sampleIndex;
    return {
      x: points[sampleIndex].x
        + (points[sampleNextIndex].x - points[sampleIndex].x) * sampleMix,
      y: points[sampleIndex].y
        + (points[sampleNextIndex].y - points[sampleIndex].y) * sampleMix,
      thickness: points[sampleIndex].thickness
        + (points[sampleNextIndex].thickness - points[sampleIndex].thickness) * sampleMix,
      baseThickness: points[sampleIndex].baseThickness
        + (points[sampleNextIndex].baseThickness - points[sampleIndex].baseThickness) * sampleMix,
    };
  };
  const secondaryFrame = Math.floor(time * 12);
  const refreshSecondaryLayers = secondaryFrame !== lastSecondaryFrame;
  if (refreshSecondaryLayers) glow.setAttribute("d", polygonPath);
  ribbon.setAttribute("d", polygonPath);
  texture.setAttribute("d", polygonPath);

  const pixelFrame = Math.floor(time * 11);
  pixelPattern.setAttribute(
    "patternTransform",
    `translate(${pixelFrame % 8} ${(pixelFrame * 3) % 8})`,
  );
  if (refreshSecondaryLayers) {
    flowLines.forEach((flowLine) => {
      flowLine.points.length = 0;
      points.forEach((point) => {
        flowLine.points.push({
          x: point.x + point.normalX * point.thickness * flowLine.offset,
          y: point.y + point.normalY * point.thickness * flowLine.offset,
        });
      });
      flowLine.element.setAttribute("d", curveThrough(flowLine.points));
    });
    lastSecondaryFrame = secondaryFrame;
  }

  shockDrops.forEach((drop) => {
    const travel = drop.originU + drop.direction * drop.age * drop.speed;
    if (travel <= 0 || travel >= 1) {
      drop.element.style.opacity = "0";
      return;
    }
    const centerPoint = samplePathAt(travel);
    const areaScale = referenceThickness / Math.max(1, centerPoint.baseThickness);
    const bodyLength = referenceMarkWidth * 2.4 * areaScale * drop.lengthScale;
    const bodyTravel = bodyLength / Math.max(1, pathLength);
    const shapePoints = [];
    for (let sample = 0; sample < 7; sample += 1) {
      const relativePosition = sample / 6 - 0.5;
      shapePoints.push(samplePathAt(travel + relativePosition * bodyTravel));
    }
    const shapeUpper = [];
    const shapeLower = [];
    shapePoints.forEach((shapePoint, shapeIndex) => {
      const previousPoint = shapePoints[Math.max(0, shapeIndex - 1)];
      const nextPoint = shapePoints[Math.min(shapePoints.length - 1, shapeIndex + 1)];
      const dx = nextPoint.x - previousPoint.x;
      const dy = nextPoint.y - previousPoint.y;
      const segmentLength = Math.hypot(dx, dy) || 1;
      const normalX = -dy / segmentLength;
      const normalY = dx / segmentLength;
      const halfWidth = Math.max(0.5, shapePoint.thickness * MORSE_WIDTH_RATIO);
      shapeUpper.push({
        x: shapePoint.x + normalX * halfWidth,
        y: shapePoint.y + normalY * halfWidth,
      });
      shapeLower.push({
        x: shapePoint.x - normalX * halfWidth,
        y: shapePoint.y - normalY * halfWidth,
      });
    });
    const fadeIn = Math.min(1, drop.age / 0.08);
    const fadeOut = Math.min(1, Math.max(0, drop.lifetime - drop.age) / 0.22);
    const edgeFade = Math.pow(Math.sin(Math.PI * travel), 0.3);
    drop.element.setAttribute(
      "d",
      roundedPolygonThrough(shapeUpper, shapeLower, shapePoints),
    );
    drop.element.style.opacity = `${fadeIn * fadeOut * edgeFade}`;
  });

  const measureMarkAt = (mark, travel) => {
    const centerPoint = samplePathAt(Math.max(0, Math.min(1, travel)));
    const markHeight = Math.max(
      1,
      centerPoint.baseThickness * 2 * MORSE_WIDTH_RATIO,
    );
    const areaScale = referenceThickness / Math.max(1, centerPoint.baseThickness);
    let bodyLength;
    if (mark.kind === "dot") {
      const targetArea = Math.PI * (referenceMarkWidth * 0.5) ** 2;
      const capArea = Math.PI * (markHeight * 0.5) ** 2;
      bodyLength = Math.max(0.35, (targetArea - capArea) / markHeight);
    } else {
      bodyLength = mark.duration * 0.72 / morseTotalUnits * pathLength * areaScale;
    }
    return {
      bodyLength,
      halfExtentPixels: (bodyLength + markHeight) * 0.5,
      markHeight,
    };
  };

  if (!morseLayoutCache) {
    const gapUnit = Math.max(9, referenceMarkWidth * 0.38);
    let cycleCursor = 0;
    morseMarks.forEach((mark) => {
      const referenceBodyLength = mark.kind === "dot"
        ? 0.35
        : mark.duration * 0.72 / morseTotalUnits * pathLength;
      const referenceLength = referenceBodyLength + referenceMarkWidth;
      mark.cycleCenter = cycleCursor + referenceLength * 0.5;
      cycleCursor += referenceLength + mark.gapAfter * gapUnit;
    });
    morseLayoutCache = {
      cycleLength: Math.max(cycleCursor, pathLength + referenceMarkWidth * 4),
      flowSpeed: 4.5 / morseTotalUnits * pathLength,
      minimumGap: Math.max(10, referenceMarkWidth * 0.4),
      visibleBuffer: referenceMarkWidth * 3,
    };
  }
  const {
    cycleLength,
    flowSpeed,
    minimumGap,
    visibleBuffer,
  } = morseLayoutCache;
  const flowOffset = reducedMotion.matches ? 0 : time * flowSpeed;
  const layout = [];
  morseMarks.forEach((mark) => {
    const baseDistance = (mark.cycleCenter + flowOffset) % cycleLength;
    if (baseDistance > pathLength + visibleBuffer) {
      mark.element.style.opacity = "0";
      mark.layoutDistance = undefined;
      mark.previousBaseDistance = undefined;
      mark.debugDistance = undefined;
      return;
    }
    layout.push({ mark, baseDistance });
  });
  layout.sort((first, second) => first.baseDistance - second.baseDistance);

  let previousEnd = -minimumGap;
  let backwardMoves = 0;
  let pushedMarks = 0;
  layout.forEach((item) => {
    let targetDistance = item.baseDistance;
    let measurement = measureMarkAt(item.mark, targetDistance / Math.max(1, pathLength));
    for (let pass = 0; pass < 2; pass += 1) {
      targetDistance = Math.max(
        item.baseDistance,
        previousEnd + minimumGap + measurement.halfExtentPixels,
      );
      measurement = measureMarkAt(item.mark, targetDistance / Math.max(1, pathLength));
    }

    const previousDistance = item.mark.layoutDistance;
    const previousBaseDistance = item.mark.previousBaseDistance;
    const baseDelta = previousBaseDistance === undefined
      ? 0
      : item.baseDistance - previousBaseDistance;
    const wrapped = baseDelta < -cycleLength * 0.5;
    const advectedDistance = previousDistance === undefined || wrapped
      ? targetDistance
      : previousDistance + Math.max(0, baseDelta);
    let distance = Math.max(advectedDistance, targetDistance, item.baseDistance);
    for (let pass = 0; pass < 2; pass += 1) {
      measurement = measureMarkAt(item.mark, distance / Math.max(1, pathLength));
      distance = Math.max(
        distance,
        item.baseDistance,
        previousEnd + minimumGap + measurement.halfExtentPixels,
      );
    }
    measurement = measureMarkAt(item.mark, distance / Math.max(1, pathLength));
    if (item.mark.debugDistance !== undefined && distance < item.mark.debugDistance - 0.1) {
      backwardMoves += 1;
    }
    if (distance > item.baseDistance + 0.5) pushedMarks += 1;
    item.mark.layoutDistance = distance;
    item.mark.previousBaseDistance = item.baseDistance;
    item.mark.debugDistance = distance;
    item.distance = distance;
    item.measurement = measurement;
    previousEnd = distance + measurement.halfExtentPixels;
  });

  let visibleMarks = 0;
  layout.forEach(({ mark, distance, measurement }) => {
    if (
      distance <= measurement.halfExtentPixels
      || distance >= pathLength - measurement.halfExtentPixels
    ) {
      mark.element.style.opacity = "0";
      return;
    }
    visibleMarks += 1;
    const travel = distance / Math.max(1, pathLength);
    const bodyTravel = measurement.bodyLength / Math.max(1, pathLength);
    const shapePoints = [];
    const sampleCount = mark.kind === "dot" ? 9 : 7;
    for (let sample = 0; sample < sampleCount; sample += 1) {
      const relativePosition = sample / (sampleCount - 1) - 0.5;
      shapePoints.push(samplePathAt(travel + relativePosition * bodyTravel));
    }
    const shapeUpper = [];
    const shapeLower = [];
    shapePoints.forEach((shapePoint, shapeIndex) => {
      const previousPoint = shapePoints[Math.max(0, shapeIndex - 1)];
      const nextPoint = shapePoints[Math.min(shapePoints.length - 1, shapeIndex + 1)];
      const dx = nextPoint.x - previousPoint.x;
      const dy = nextPoint.y - previousPoint.y;
      const segmentLength = Math.hypot(dx, dy) || 1;
      const normalX = -dy / segmentLength;
      const normalY = dx / segmentLength;
      const halfWidth = Math.max(0.5, shapePoint.thickness * MORSE_WIDTH_RATIO);
      shapeUpper.push({
        x: shapePoint.x + normalX * halfWidth,
        y: shapePoint.y + normalY * halfWidth,
      });
      shapeLower.push({
        x: shapePoint.x - normalX * halfWidth,
        y: shapePoint.y - normalY * halfWidth,
      });
    });
    mark.element.setAttribute(
      "d",
      roundedPolygonThrough(shapeUpper, shapeLower, shapePoints),
    );
    mark.element.style.opacity = `${Math.pow(Math.sin(Math.PI * travel), 0.58)}`;
  });

  debugState.renderCount = (debugState.renderCount || 0) + 1;
  if (debugEnabled && time - lastDebugLogTime >= 1) {
    const previousSample = debugState.latest;
    const elapsed = previousSample ? time - previousSample.time : 0;
    const renderedFrames = previousSample
      ? debugState.renderCount - previousSample.renderCount
      : 0;
    const sample = {
      backwardMoves,
      cycleLength: Math.round(cycleLength),
      flowPhase: Math.round(flowOffset % cycleLength),
      fps: elapsed > 0 ? Number((renderedFrames / elapsed).toFixed(1)) : 0,
      layoutMarks: layout.length,
      pulses: pulses.length,
      pushedMarks,
      renderCount: debugState.renderCount,
      shockDrops: shockDrops.length,
      time,
      visibleMarks,
    };
    debugState.latest = sample;
    debugState.samples.push(sample);
    if (debugState.samples.length > 120) debugState.samples.shift();
    lastDebugLogTime = time;
    console.debug("[nipe:flow]", sample);
  }
}

function animate(timestamp) {
  const frameInterval = width < 720 ? 1000 / 20 : FRAME_INTERVAL;
  if (previousTimestamp && timestamp - previousTimestamp < frameInterval - 1) {
    requestAnimationFrame(animate);
    return;
  }
  const time = reducedMotion.matches ? 3 : timestamp / 1000;
  const delta = previousTimestamp ? Math.min(0.05, (timestamp - previousTimestamp) / 1000) : 0.016;
  previousTimestamp = timestamp;
  smoothPointerX += (pointerX - smoothPointerX) * 0.055;
  smoothPointerY += (pointerY - smoothPointerY) * 0.055;
  for (const pulse of pulses) pulse.age += delta;
  while (pulses.length && pulses[0].age > 2.2) pulses.shift();
  shockDrops.forEach((drop) => { drop.age += delta; });
  for (let index = shockDrops.length - 1; index >= 0; index -= 1) {
    const drop = shockDrops[index];
    const travel = drop.originU + drop.direction * drop.age * drop.speed;
    if (drop.age > drop.lifetime || travel < -0.02 || travel > 1.02) {
      drop.element.remove();
      shockDrops.splice(index, 1);
    }
  }
  if (!reducedMotion.matches) {
    if (!nextAmbientDropTime) {
      nextAmbientDropTime = time + 0.7 + Math.random() * 1.3;
    } else if (time >= nextAmbientDropTime) {
      createAmbientDrop();
      nextAmbientDropTime = time + 1.2 + Math.random() * 2.4;
    }
  }
  calculateGeometry(time);
  updateArtwork(time);
  requestAnimationFrame(animate);
}

FLOW_LINE_OFFSETS.forEach((offset) => {
  const element = createSvgElement("path", {
    class: "flow-line",
    fill: "none",
    stroke: "url(#core-gradient)",
  });
  element.style.opacity = `${0.32 - Math.abs(offset) * 0.12}`;
  flowLinesGroup.append(element);
  flowLines.push({ element, offset, points: [] });
});

const morsePattern = buildMorseMarks(MORSE_MESSAGE);
morseTotalUnits = morsePattern.totalUnits;
morsePattern.marks.forEach((mark) => {
  const element = createSvgElement("path", {
    class: `morse-mark morse-${mark.kind}`,
  });
  morseStream.append(element);
  morseMarks.push({ ...mark, element });
});

window.addEventListener("resize", resize);
window.addEventListener("pointermove", (event) => {
  pointerX = event.clientX;
  pointerY = event.clientY;
  pointerActive = true;
  root.style.setProperty("--pointer-x", `${event.clientX}px`);
  root.style.setProperty("--pointer-y", `${event.clientY}px`);
});
window.addEventListener("pointerleave", () => { pointerActive = false; });
window.addEventListener("pointerdown", (event) => createPulse(event.clientX, event.clientY));

resize();
requestAnimationFrame(animate);
