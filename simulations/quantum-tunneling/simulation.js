const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');

const W = () => canvas.width;
const H = () => canvas.height;

const N = 512;
const dx = 1.0;
const dt = 0.05;
const hbar = 1.0;
const mass = 1.0;

let psi_r = new Float64Array(N);
let psi_i = new Float64Array(N);
let V = new Float64Array(N);

let barrierHeight = 0.8;
let barrierWidth = 20;
let particleEnergy = 0.5;
let tunneledCount = 0;
let totalFired = 0;
let running = false;
let animId = null;
function resize() {
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = window.innerHeight - 90;
}
resize();
window.addEventListener('resize', () => { resize(); setupBarrier(); });
function resize() {
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = window.innerHeight - 90;
}
resize();
window.addEventListener('resize', () => { resize(); setupBarrier(); });
function setupBarrier() {
  V.fill(0);
  const center = Math.floor(N * 0.55);
  const hw = Math.floor(barrierWidth / 2);
  for (let i = center - hw; i <= center + hw; i++) {
    if (i >= 0 && i < N) V[i] = barrierHeight;
  }
  updateTransmissionDisplay();
}
function initWavePacket() {
  psi_r.fill(0);
  psi_i.fill(0);

  const x0 = Math.floor(N * 0.25);
  const sigma = 20;
  const k0 = Math.sqrt(2 * mass * particleEnergy) / hbar;

  for (let i = 0; i < N; i++) {
    const x = i - x0;
    const gauss = Math.exp(-(x * x) / (2 * sigma * sigma));
    psi_r[i] = gauss * Math.cos(k0 * x);
    psi_i[i] = gauss * Math.sin(k0 * x);
  }

  normalize();
}
function normalize() {
  let norm = 0;
  for (let i = 0; i < N; i++) {
    norm += psi_r[i] * psi_r[i] + psi_i[i] * psi_i[i];
  }
  norm = Math.sqrt(norm * dx);
  for (let i = 0; i < N; i++) {
    psi_r[i] /= norm;
    psi_i[i] /= norm;
  }
}
function stepSchrodinger() {
  const r = new Float64Array(N);
  const s = new Float64Array(N);

  const alpha = hbar * dt / (2 * mass * dx * dx);

  for (let i = 1; i < N - 1; i++) {
    const lap_r = psi_r[i+1] - 2*psi_r[i] + psi_r[i-1];
    const lap_i = psi_i[i+1] - 2*psi_i[i] + psi_i[i-1];

    r[i] = psi_r[i] + alpha * lap_i - (dt / hbar) * V[i] * psi_i[i];
    s[i] = psi_i[i] - alpha * lap_r + (dt / hbar) * V[i] * psi_r[i];
  }

  for (let i = 1; i < N - 1; i++) {
    psi_r[i] = r[i];
    psi_i[i] = s[i];
  }
}
function draw() {
  ctx.fillStyle = '#0a0a14';
  ctx.fillRect(0, 0, W(), H());

  ctx.strokeStyle = '#14082a';
  ctx.lineWidth = 0.5;
  for (let x = 0; x < W(); x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H()); ctx.stroke();
  }
  for (let y = 0; y < H(); y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W(), y); ctx.stroke();
  }

  const cy = H() / 2;
  const scale = H() * 0.35;
  const xScale = W() / N;

  ctx.strokeStyle = '#1a0a3a';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, cy);
  ctx.lineTo(W(), cy);
  ctx.stroke();

  const center = Math.floor(N * 0.55);
  const hw = Math.floor(barrierWidth / 2);
  const barrierX1 = (center - hw) * xScale;
  const barrierX2 = (center + hw) * xScale;
  const barrierH = barrierHeight / 2.0 * scale;

  ctx.fillStyle = 'rgba(180, 80, 255, 0.15)';
  ctx.fillRect(barrierX1, cy - barrierH, barrierX2 - barrierX1, barrierH * 2);
  ctx.strokeStyle = '#b050ff';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(barrierX1, cy - barrierH, barrierX2 - barrierX1, barrierH * 2);

  ctx.fillStyle = 'rgba(255, 96, 144, 0.15)';
  ctx.beginPath();
  for (let i = 0; i < N; i++) {
    const x = i * xScale;
    const prob = (psi_r[i]*psi_r[i] + psi_i[i]*psi_i[i]) * scale * 15;
    if (i === 0) ctx.moveTo(x, cy - prob);
    else ctx.lineTo(x, cy - prob);
  }
  for (let i = N - 1; i >= 0; i--) {
    const x = i * xScale;
    ctx.lineTo(x, cy);
  }
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#ff6090';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < N; i++) {
    const x = i * xScale;
    const prob = (psi_r[i]*psi_r[i] + psi_i[i]*psi_i[i]) * scale * 80;
    if (i === 0) ctx.moveTo(x, cy - prob);
    else ctx.lineTo(x, cy - prob);
  }
  ctx.stroke();

  ctx.fillStyle = '#6a4a8a';
  ctx.font = '10px Courier New';
  ctx.textAlign = 'left';
  ctx.fillText('ψ(x)', 10, cy - scale * 0.4);
  ctx.fillText('barrier', barrierX1 + 4, cy - barrierH - 8);
}
function updateTransmissionDisplay() {
  const k0 = Math.sqrt(2 * mass * particleEnergy) / hbar;
  const kappa = Math.sqrt(Math.abs(2 * mass * (barrierHeight - particleEnergy))) / hbar;

  let T;
  if (particleEnergy >= barrierHeight) {
    T = 100;
  } else {
    T = Math.round(100 * Math.exp(-2 * kappa * barrierWidth));
  }

  T = Math.max(0, Math.min(100, T));
  document.getElementById('statTransmission').textContent = T + '%';
}

function updateBarrier() {
  barrierHeight = parseFloat(document.getElementById('barrierHeight').value);
  barrierWidth = parseInt(document.getElementById('barrierWidth').value);
  document.getElementById('barrierHeightVal').textContent = barrierHeight.toFixed(1);
  document.getElementById('barrierWidthVal').textContent = barrierWidth;
  setupBarrier();
  resetSim();
}

function updateEnergy() {
  particleEnergy = parseFloat(document.getElementById('particleEnergy').value);
  document.getElementById('particleEnergyVal').textContent = particleEnergy.toFixed(1);
  updateTransmissionDisplay();
  resetSim();
}

function firePulse() {
  if (animId) cancelAnimationFrame(animId);
  setupBarrier();
  initWavePacket();
  running = true;
  totalFired++;
  loop();
}

function resetSim() {
  if (animId) cancelAnimationFrame(animId);
  running = false;
  psi_r.fill(0);
  psi_i.fill(0);
  tunneledCount = 0;
  document.getElementById('statTunneled').textContent = '0';
  setupBarrier();
  draw();
}

function loop() {
  for (let s = 0; s < 8; s++) {
    stepSchrodinger();
  }

  const center = Math.floor(N * 0.55);
  const hw = Math.floor(barrierWidth / 2);
  let rightProb = 0;
  for (let i = center + hw + 1; i < N; i++) {
    rightProb += (psi_r[i]*psi_r[i] + psi_i[i]*psi_i[i]) * dx;
  }

  const tunnelPct = Math.min(100, Math.round(rightProb * 10000) / 100);
document.getElementById('statTunneled').textContent = tunnelPct.toFixed(1) + '%';

  draw();

  if (running) animId = requestAnimationFrame(loop);
}

setupBarrier();
draw();
