const SVG_NS = "http://www.w3.org/2000/svg";
const svg = document.querySelector("#signal");
const ribbon = document.querySelector("#signal-ribbon");
const glow = document.querySelector("#signal-glow");
const strandsGroup = document.querySelector("#strands");
const beaconsGroup = document.querySelector("#beacons");
const root = document.documentElement;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const SAMPLE_COUNT = 150;
const STRAND_COUNT = 19;
const pulses = [];
const points = [];
const upper = [];
const lower = [];
const strands = [];
const beacons = [];

let width = window.innerWidth;
let height = window.innerHeight;
let pointerX = width * 0.5;
let pointerY = height * 0.5;
let smoothPointerX = pointerX;
let smoothPointerY = pointerY;
let pointerActive = false;

function createSvgElement(name, attributes = {}) {
  const element = document.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
  return element;
}

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
}

function pathThrough(list, close = false) {
  if (!list.length) return "";
  if (list.length === 1) return `M ${list[0].x.toFixed(2)} ${list[0].y.toFixed(2)}`;

  const pointAt = (index) => {
    if (close) return list[(index + list.length) % list.length];
    return list[Math.max(0, Math.min(list.length - 1, index))];
  };

  let path = `M ${list[0].x.toFixed(2)} ${list[0].y.toFixed(2)}`;
  const segmentCount = close ? list.length : list.length - 1;

  for (let index = 0; index < segmentCount; index += 1) {
    const previous = pointAt(index - 1);
    const current = pointAt(index);
    const next = pointAt(index + 1);
    const following = pointAt(index + 2);
    const controlOneX = current.x + (next.x - previous.x) / 6;
    const controlOneY = current.y + (next.y - previous.y) / 6;
    const controlTwoX = next.x - (following.x - current.x) / 6;
    const controlTwoY = next.y - (following.y - current.y) / 6;

    path += ` C ${controlOneX.toFixed(2)} ${controlOneY.toFixed(2)},`;
    path += ` ${controlTwoX.toFixed(2)} ${controlTwoY.toFixed(2)},`;
    path += ` ${next.x.toFixed(2)} ${next.y.toFixed(2)}`;
  }

  return close ? `${path} Z` : path;
}

function createPulse(x, y) {
  pulses.push({
    x: x / width,
    age: 0,
    strength: Math.max(36, Math.min(height * 0.11, 105)),
  });

  const ring = document.createElement("i");
  ring.className = "pulse-ring";
  ring.style.left = `${x}px`;
  ring.style.top = `${y}px`;
  document.body.append(ring);
  ring.addEventListener("animationend", () => ring.remove());
}

function signalAt(u, time) {
  const edge = Math.pow(Math.max(0, Math.sin(Math.PI * Math.min(1, Math.max(0, u)))), 0.42);
  const baseAmplitude = Math.min(height * 0.115, 112);
  const slow = Math.sin(u * Math.PI * 2.15 + time * 0.57) * 0.47;
  const medium = Math.sin(u * Math.PI * 5.1 - time * 0.36 + 0.7) * 0.18;
  const long = Math.sin(u * Math.PI * 1.1 - time * 0.19 + 1.4) * 0.24;
  let y = height * 0.5 + (slow + medium + long) * baseAmplitude * edge;

  if (pointerActive) {
    const normalizedPointerX = smoothPointerX / width;
    const distance = u - normalizedPointerX;
    const influence = Math.exp(-(distance * distance) / 0.014);
    y += (smoothPointerY - y) * influence * 0.42;
  }

  for (const pulse of pulses) {
    const distance = Math.abs(u - pulse.x);
    const waveFront = pulse.age * 0.28;
    const shell = Math.exp(-Math.pow((distance - waveFront) * 30, 2));
    const oscillation = Math.sin(distance * 95 - pulse.age * 18);
    y += oscillation * shell * pulse.strength * Math.exp(-pulse.age * 0.8);
  }

  return y;
}

function calculateGeometry(time) {
  points.length = 0;
  upper.length = 0;
  lower.length = 0;

  for (let index = 0; index < SAMPLE_COUNT; index += 1) {
    const u = index / (SAMPLE_COUNT - 1);
    const extendedU = -0.06 + u * 1.12;
    points.push({
      x: extendedU * width,
      y: signalAt(extendedU, time),
      u,
    });
  }

  for (let index = 0; index < points.length; index += 1) {
    const previous = points[Math.max(0, index - 1)];
    const next = points[Math.min(points.length - 1, index + 1)];
    const dx = next.x - previous.x;
    const dy = next.y - previous.y;
    const length = Math.hypot(dx, dy) || 1;
    const normalX = -dy / length;
    const normalY = dx / length;
    const taper = Math.pow(Math.sin(Math.PI * points[index].u), 0.28);
    const breathing = 1 + Math.sin(time * 1.1 + points[index].u * Math.PI * 4) * 0.08;
    const thickness = Math.max(0, Math.min(height * 0.027, 29) * taper * breathing);

    points[index].normalX = normalX;
    points[index].normalY = normalY;
    points[index].thickness = thickness;
    upper.push({ x: points[index].x + normalX * thickness, y: points[index].y + normalY * thickness });
    lower.push({ x: points[index].x - normalX * thickness, y: points[index].y - normalY * thickness });
  }
}

function updateArtwork(time) {
  const centerPath = pathThrough(points);
  const ribbonOutline = [...upper, ...lower.slice(1, -1).reverse()];
  glow.setAttribute("d", centerPath);
  ribbon.setAttribute("d", pathThrough(ribbonOutline, true));

  strands.forEach((strand, strandIndex) => {
    const position = strandIndex / (STRAND_COUNT - 1) * 2 - 1;
    const strandPoints = points.map((point) => ({
      x: point.x + point.normalX * point.thickness * position * 0.88,
      y: point.y + point.normalY * point.thickness * position * 0.88,
    }));
    strand.setAttribute("d", pathThrough(strandPoints));
    strand.style.opacity = `${0.16 + (1 - Math.abs(position)) * 0.52}`;
  });

  beacons.forEach((beacon, index) => {
    const travel = (time * (0.018 + index * 0.0025) + index * 0.21) % 1;
    const pointIndex = Math.min(points.length - 1, Math.floor(travel * points.length));
    const point = points[pointIndex];
    beacon.setAttribute("cx", point.x);
    beacon.setAttribute("cy", point.y);
    beacon.setAttribute("r", 1.6 + (index % 2) * 0.8);
    beacon.style.opacity = `${0.4 + Math.sin(time * 2 + index) * 0.25}`;
  });
}

function animate(timestamp) {
  const time = reducedMotion.matches ? 3 : timestamp / 1000;
  smoothPointerX += (pointerX - smoothPointerX) * 0.055;
  smoothPointerY += (pointerY - smoothPointerY) * 0.055;

  for (const pulse of pulses) pulse.age += 0.016;
  while (pulses.length && pulses[0].age > 3.6) pulses.shift();

  calculateGeometry(time);
  updateArtwork(time);
  requestAnimationFrame(animate);
}

for (let index = 0; index < STRAND_COUNT; index += 1) {
  const strand = createSvgElement("path", { class: "strand" });
  strandsGroup.append(strand);
  strands.push(strand);
}

for (let index = 0; index < 5; index += 1) {
  const beacon = createSvgElement("circle", { class: "beacon" });
  beaconsGroup.append(beacon);
  beacons.push(beacon);
}

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
