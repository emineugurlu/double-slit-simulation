const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');

let frequency = 5;
let amplitude = 5;
let sourceDist = 80;
let time = 0;
let animFrame;

function resize() {
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = window.innerHeight - 90;
}
resize();
window.addEventListener('resize', resize);

const W = () => canvas.width;
const H = () => canvas.height;
function getSources() {
  const cx = W() / 2;
  const cy = H() / 2;
  return [
    { x: cx - sourceDist / 2, y: cy },
    { x: cx + sourceDist / 2, y: cy }
  ];
}
function computeIntensity(x, y, sources, lambda) {
  let total = 0;
  sources.forEach(src => {
    const dx = x - src.x;
    const dy = y - src.y;
    const r = Math.sqrt(dx * dx + dy * dy);
    const phase = (2 * Math.PI * r / lambda) - time;
    total += Math.cos(phase);
  });
  return total / sources.length;
}
function drawWaves() {
  const sources = getSources();
  const lambda = 800 / frequency;
  const imageData = ctx.createImageData(W(), H());
  const data = imageData.data;

  for (let x = 0; x < W(); x += 2) {
    for (let y = 0; y < H(); y += 2) {
      const val = computeIntensity(x, y, sources, lambda);
      const intensity = (val + 1) / 2;

      let r, g, b;
      if (intensity > 0.5) {
        const t = (intensity - 0.5) * 2;
        r = Math.floor(64 * t);
        g = Math.floor(255 * t);
        b = Math.floor(204 * t);
      } else {
        const t = intensity * 2;
        r = Math.floor(255 * (1 - t));
        g = Math.floor(96 * (1 - t));
        b = Math.floor(144 * (1 - t));
      }

      for (let dx = 0; dx < 2; dx++) {
        for (let dy = 0; dy < 2; dy++) {
          const idx = ((y + dy) * W() + (x + dx)) * 4;
          data[idx]     = r;
          data[idx + 1] = g;
          data[idx + 2] = b;
          data[idx + 3] = 255;
        }
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}
function drawSources() {
  const sources = getSources();
  sources.forEach((src, i) => {
    ctx.beginPath();
    ctx.arc(src.x, src.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#1a0a2a';
    ctx.fill();
    ctx.strokeStyle = '#c0a0ff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(src.x, src.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#c0a0ff';
    ctx.fill();

    ctx.fillStyle = '#6a4a8a';
    ctx.font = '9px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText(`S${i + 1}`, src.x, src.y + 24);
  });
}
function updateFreq(val) {
  frequency = parseInt(val);
  document.getElementById('freqVal').textContent = val;
  updateStats();
}

function updateAmp(val) {
  amplitude = parseInt(val);
  document.getElementById('ampVal').textContent = val;
}

function updateDist(val) {
  sourceDist = parseInt(val);
  document.getElementById('distVal').textContent = val;
  updateStats();
}

function updateStats() {
  const lambda = Math.round(800 / frequency);
  const nodes = Math.round(sourceDist / (800 / frequency));
  document.getElementById('statWavelength').textContent = lambda + 'px';
  document.getElementById('statNodes').textContent = nodes;
}

function resetSim() {
  frequency = 5;
  amplitude = 5;
  sourceDist = 80;
  document.getElementById('freqSlider').value = 5;
  document.getElementById('ampSlider').value = 5;
  document.getElementById('distSlider').value = 80;
  document.getElementById('freqVal').textContent = '5';
  document.getElementById('ampVal').textContent = '5';
  document.getElementById('distVal').textContent = '80';
  updateStats();
}

function loop() {
  time += 0.05;
  drawWaves();
  drawSources();
  updateStats();
  requestAnimationFrame(loop);
}

updateStats();
requestAnimationFrame(loop);