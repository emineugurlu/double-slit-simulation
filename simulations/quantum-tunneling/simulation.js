const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');

const W = () => canvas.width;
const H = () => canvas.height;

const N = 600;
let psi_r = new Float64Array(N);
let psi_i = new Float64Array(N);
let V = new Float64Array(N);

let barrierHeight = 0.8;
let barrierWidth = 20;
let particleEnergy = 0.5;
let animId = null;
let running = false;

const dx = 1.0;
const dt = 0.005;
const hbar = 1.0;
const mass = 0.5;

function resize() {
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = window.innerHeight - 90;
}
resize();
window.addEventListener('resize', resize);

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
  const x0 = Math.floor(N * 0.2);
  const sigma = 35;
  const k0 = Math.sqrt(2 * mass * particleEnergy) / hbar;
  let norm = 0;
  for (let i = 0; i < N; i++) {
    const x = i - x0;
    const g = Math.exp(-(x * x) / (2 * sigma * sigma));
    psi_r[i] = g * Math.cos(k0 * x);
    psi_i[i] = g * Math.sin(k0 * x);
    norm += psi_r[i]*psi_r[i] + psi_i[i]*psi_i[i];
  }
  norm = Math.sqrt(norm * dx);
  for (let i = 0; i < N; i++) {
    psi_r[i] /= norm;
    psi_i[i] /= norm;
  }
}

function absorb() {
  const zone = 60;
  for (let i = 0; i < zone; i++) {
    const f = Math.pow(i / zone, 2);
    psi_r[i] *= f; psi_i[i] *= f;
    psi_r[N-1-i] *= f; psi_i[N-1-i] *= f;
  }
}

function step() {
  const alpha = hbar * dt / (2 * mass * dx * dx);
  const nr = new Float64Array(N);
  const ni = new Float64Array(N);
  for (let i = 1; i < N - 1; i++) {
    const lap_r = psi_r[i+1] - 2*psi_r[i] + psi_r[i-1];
    const lap_i = psi_i[i+1] - 2*psi_i[i] + psi_i[i-1];
    nr[i] = psi_r[i] + alpha * lap_i - (dt/hbar) * V[i] * psi_i[i];
    ni[i] = psi_i[i] - alpha * lap_r + (dt/hbar) * V[i] * psi_r[i];
  }
  for (let i = 1; i < N - 1; i++) {
    psi_r[i] = nr[i];
    psi_i[i] = ni[i];
  }
  absorb();
}

function draw() {
  ctx.fillStyle = '#0a0a14';
  ctx.fillRect(0, 0, W(), H());

  ctx.strokeStyle = '#14082a';
  ctx.lineWidth = 0.5;
  for (let x = 0; x < W(); x += 40) {
    ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H()); ctx.stroke();
  }
  for (let y = 0; y < H(); y += 40) {
    ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W(),y); ctx.stroke();
  }

  const cy = H() / 2;
  const xScale = W() / N;
  const scale = H() * 0.4;
  const ampScale = scale * 6;

  ctx.strokeStyle = '#1a0a3a';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W(), cy); ctx.stroke();

  const center = Math.floor(N * 0.55);
  const hw = Math.floor(barrierWidth / 2);
  const bx1 = (center - hw) * xScale;
  const bx2 = (center + hw) * xScale;
  const bh = (barrierHeight / 2.0) * scale;

  ctx.fillStyle = 'rgba(160, 60, 255, 0.12)';
  ctx.fillRect(bx1, cy - bh, bx2 - bx1, bh * 2);
  ctx.strokeStyle = '#a03cff';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(bx1, cy - bh, bx2 - bx1, bh * 2);
  ctx.fillStyle = '#8050cc';
  ctx.font = '9px Courier New';
  ctx.textAlign = 'center';
  ctx.fillText('BARRIER', (bx1+bx2)/2, cy - bh - 8);

  ctx.fillStyle = 'rgba(255, 96, 144, 0.12)';
  ctx.beginPath();
  for (let i = 0; i < N; i++) {
    const x = i * xScale;
    const prob = (psi_r[i]*psi_r[i] + psi_i[i]*psi_i[i]) * ampScale;
    if (i === 0) ctx.moveTo(x, cy - prob);
    else ctx.lineTo(x, cy - prob);
  }
  for (let i = N-1; i >= 0; i--) {
    ctx.lineTo(i * xScale, cy);
  }
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#ff6090';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < N; i++) {
    const x = i * xScale;
    const prob = (psi_r[i]*psi_r[i] + psi_i[i]*psi_i[i]) * ampScale;
    if (i === 0) ctx.moveTo(x, cy - prob);
    else ctx.lineTo(x, cy - prob);
  }
  ctx.stroke();

  const rightStart = center + hw + 1;
  let rightProb = 0;
  for (let i = rightStart; i < N - 60; i++) {
    rightProb += (psi_r[i]*psi_r[i] + psi_i[i]*psi_i[i]) * dx;
  }
  const pct = Math.min(100, rightProb * 100).toFixed(1);
  document.getElementById('statTunneled').textContent = pct + '%';
}

function updateTransmissionDisplay() {
  const kappa = Math.sqrt(Math.abs(2 * mass * (barrierHeight - particleEnergy))) / hbar;
  let T;
  if (particleEnergy >= barrierHeight) {
    T = 100;
  } else {
    T = Math.round(100 * Math.exp(-2 * kappa * barrierWidth));
    T = Math.max(0, Math.min(100, T));
  }
  document.getElementById('statTransmission').textContent = T + '%';
}

function firePulse() {
  if (animId) cancelAnimationFrame(animId);
  setupBarrier();
  initWavePacket();
  running = true;
  loop();
}

function resetSim() {
  if (animId) cancelAnimationFrame(animId);
  running = false;
  psi_r.fill(0);
  psi_i.fill(0);
  document.getElementById('statTunneled').textContent = '0%';
  setupBarrier();
  draw();
}

function updateBarrier() {
  barrierHeight = parseFloat(document.getElementById('barrierHeight').value);
  barrierWidth = parseInt(document.getElementById('barrierWidth').value);
  document.getElementById('barrierHeightVal').textContent = barrierHeight.toFixed(1);
  document.getElementById('barrierWidthVal').textContent = barrierWidth;
  resetSim();
}

function updateEnergy() {
  particleEnergy = parseFloat(document.getElementById('particleEnergy').value);
  document.getElementById('particleEnergyVal').textContent = particleEnergy.toFixed(1);
  updateTransmissionDisplay();
  resetSim();
}

function loop() {
  for (let s = 0; s < 20; s++) step();
  draw();
  if (running) animId = requestAnimationFrame(loop);
}

setupBarrier();
draw();
