const SVG_NS = "http://www.w3.org/2000/svg";
const svg = document.querySelector("#signal");
const ribbon = document.querySelector("#signal-ribbon");
const glow = document.querySelector("#signal-glow");
const core = document.querySelector("#signal-core");
const motionPath = document.querySelector("#motion-path");
const flowLinesGroup = document.querySelector("#flow-lines");
const beaconsGroup = document.querySelector("#beacons");
const root = document.documentElement;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

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

const SAMPLE_COUNT = 280;
const BEACON_COUNT = 7;
const FLOW_LINE_OFFSETS = [-0.72, -0.48, -0.24, 0.24, 0.48, 0.72];
const ROUTE_ASPECT = 3.6965;
const pulses = [];
const guidePoints = [];
const points = [];
const upper = [];
const lower = [];
const beacons = [];
const flowLines = [];

let width = window.innerWidth;
let height = window.innerHeight;
let pointerX = width * 0.5;
let pointerY = height * 0.5;
let smoothPointerX = pointerX;
let smoothPointerY = pointerY;
let pointerActive = false;
let previousTimestamp = 0;

function createSvgElement(name, attributes = {}) {
  const element = document.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
  return element;
}

function smoothStepRange(value, start, end) {
  const position = Math.max(0, Math.min(1, (value - start) / (end - start)));
  return position * position * (3 - 2 * position);
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
  return {
    x: (width - wordWidth) * 0.5 + (groupedX - iInward) * wordWidth,
    y: (height - wordHeight) * 0.5 + y * wordHeight,
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
  for (let index = 0; index < SAMPLE_COUNT; index += 1) {
    const target = lengths[lengths.length - 1] * index / (SAMPLE_COUNT - 1);
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
      u: index / (SAMPLE_COUNT - 1),
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

function pathThrough(list) {
  return curveThrough(list);
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
  pulses.push({
    u: closestIndex / Math.max(1, points.length - 1),
    age: 0,
    strength: Math.max(7, Math.min(height * 0.024, 22)),
  });

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
  for (let index = 0; index < guidePoints.length; index += 1) {
    const guide = guidePoints[index];
    const previous = guidePoints[Math.max(0, index - 1)];
    const next = guidePoints[Math.min(guidePoints.length - 1, index + 1)];
    const tangentX = next.x - previous.x;
    const tangentY = next.y - previous.y;
    const tangentLength = Math.hypot(tangentX, tangentY) || 1;
    const normalX = -tangentY / tangentLength;
    const normalY = tangentX / tangentLength;
    const edge = Math.pow(Math.sin(Math.PI * guide.u), 0.45);
    const ambientY = (
      Math.sin(guide.x / width * Math.PI * 7 + time * 0.52) * 2.2
      + Math.sin((guide.x + guide.y) / (width + height) * Math.PI * 17 - time * 0.31)
    ) * edge;
    let normalOffset = 0;

    for (const pulse of pulses) {
      const distance = Math.abs(guide.u - pulse.u);
      const waveFront = pulse.age * 0.2;
      const shell = Math.exp(-Math.pow((distance - waveFront) * 44, 2));
      normalOffset += Math.sin(distance * 105 - pulse.age * 19)
        * shell * pulse.strength * Math.exp(-pulse.age * 1.3);
    }

    let x = guide.x + normalX * normalOffset;
    let y = guide.y + ambientY + normalY * normalOffset;
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
    points[index].thickness = points[index].radius
      * (1 + Math.sin(time * 1.05 + points[index].u * Math.PI * 4) * 0.035);
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
  const centerPath = pathThrough(points);
  const polygonPath = polygonThrough(upper, lower, points);
  glow.setAttribute("d", polygonPath);
  ribbon.setAttribute("d", polygonPath);
  core.setAttribute("d", centerPath);
  motionPath.setAttribute("d", centerPath);

  flowLines.forEach((flowLine) => {
    flowLine.points.length = 0;
    points.forEach((point) => {
      flowLine.points.push({
        x: point.x + point.normalX * point.thickness * flowLine.offset,
        y: point.y + point.normalY * point.thickness * flowLine.offset,
      });
    });
    flowLine.element.setAttribute("d", pathThrough(flowLine.points));
  });

  beacons.forEach((beacon, index) => {
    const travel = (time * (0.024 + index * 0.0024) + index * 0.143) % 1;
    const position = travel * (points.length - 1);
    const pointIndex = Math.floor(position);
    const nextIndex = Math.min(points.length - 1, pointIndex + 1);
    const mix = position - pointIndex;
    const point = {
      x: points[pointIndex].x + (points[nextIndex].x - points[pointIndex].x) * mix,
      y: points[pointIndex].y + (points[nextIndex].y - points[pointIndex].y) * mix,
    };
    const edgeFade = Math.pow(Math.sin(Math.PI * travel), 0.65);
    beacon.setAttribute("cx", point.x);
    beacon.setAttribute("cy", point.y);
    beacon.setAttribute("r", 1.5 + (index % 3) * 0.45);
    beacon.style.opacity = `${(0.42 + Math.sin(time * 2 + index) * 0.24) * edgeFade}`;
  });
}

function animate(timestamp) {
  const time = reducedMotion.matches ? 3 : timestamp / 1000;
  const delta = previousTimestamp ? Math.min(0.05, (timestamp - previousTimestamp) / 1000) : 0.016;
  previousTimestamp = timestamp;
  smoothPointerX += (pointerX - smoothPointerX) * 0.055;
  smoothPointerY += (pointerY - smoothPointerY) * 0.055;
  for (const pulse of pulses) pulse.age += delta;
  while (pulses.length && pulses[0].age > 2.5) pulses.shift();
  calculateGeometry(time);
  updateArtwork(time);
  requestAnimationFrame(animate);
}

for (let index = 0; index < BEACON_COUNT; index += 1) {
  const beacon = createSvgElement("circle", { class: "beacon" });
  beaconsGroup.append(beacon);
  beacons.push(beacon);
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
