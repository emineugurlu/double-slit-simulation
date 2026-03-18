const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');

let detectorOn = false;
let detStrength = 0;
let fireSpeed = 2;
let electrons = [];
let screenHits = [];
let totalElectrons = 0;
let lastFire = 0;

function resize() {
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = window.innerHeight - 90;
}
resize();
window.addEventListener('resize', resize);

const W = () => canvas.width;
const H = () => canvas.height;
const SOURCE_X  = () => W() * 0.07;
const BARRIER_X = () => W() * 0.45;
const SCREEN_X  = () => W() * 0.75;
const SLIT_GAP  = () => H() * 0.14;
const SLIT_H    = () => H() * 0.05;

function sampleHitY() {
  const cy = H() / 2;
  const d  = SLIT_GAP();
  const L  = SCREEN_X() - BARRIER_X();
  const lambda = H() * 0.09;
  const s  = detectorOn ? detStrength / 100 : 0;

  if (s >= 0.5) {
    const slit = Math.random() < 0.5 ? 1 : -1;
   return cy + slit * d / 2 + (Math.random() - 0.5) * SLIT_H() * (1 + (1-s) * 8);
  }

  const maxY = H() * 0.45;
  let y, prob, tries = 0;
  do {
    y = cy + (Math.random() * 2 - 1) * maxY;
    const dy = y - cy;
    const interf  = Math.pow(Math.cos(Math.PI * d * dy / (lambda * L)), 2);
    const env     = Math.exp(-dy * dy / (2 * maxY * maxY * 0.3));
    const g1      = Math.exp(-Math.pow(dy - d/2, 2) / (2 * Math.pow(SLIT_H() * 3, 2)));
    const g2      = Math.exp(-Math.pow(dy + d/2, 2) / (2 * Math.pow(SLIT_H() * 3, 2)));
    const particle = (g1 + g2) * s;
    prob = (1 - s) * interf * env + particle;
    tries++;
  } while (Math.random() > prob && tries < 800);
  return y;
}

function fireElectron() {
  electrons.push({
    x: SOURCE_X() + 20,
    y: H() / 2,
    finalY: sampleHitY(),
    vx: 3 + fireSpeed * 1.5,
    alpha: 1,
    phase: 'travel',
    passedBarrier: false,
    startY: H() / 2,
    waveR: 0,
    isWave: !detectorOn
  });
  totalElectrons++;
  document.getElementById('statTotal').textContent = totalElectrons;
}

function updateElectrons() {
  electrons = electrons.filter(e => e.alpha > 0.03);

  electrons.forEach(e => {
    if (e.phase === 'travel') {
      e.x += e.vx;

      if (!e.passedBarrier && e.x >= BARRIER_X()) {
        e.passedBarrier = true;
        e.startY = e.y;
        e.barrierX = BARRIER_X();
      }

      if (e.passedBarrier) {
  const progress = Math.min((e.x - e.barrierX) / (SCREEN_X() - e.barrierX), 1);
  const eased = progress * progress * (3 - 2 * progress);
  e.y = e.startY + (e.finalY - e.startY) * eased;
}

      if (e.x >= SCREEN_X()) {
        e.phase = 'hit';
        e.x = SCREEN_X();
        e.y = e.finalY;
        screenHits.push(e.finalY);
        if (screenHits.length > 3000) screenHits.shift();
      }
    }

    if (e.phase === 'hit') e.alpha -= 0.06;
    if (e.isWave && !e.passedBarrier) e.waveR += 2;
  });
}

function drawBackground() {
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
}

function drawSource() {
  const cx = SOURCE_X(), cy = H() / 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 16, 0, Math.PI * 2);
  ctx.fillStyle = '#1a0a2a';
  ctx.fill();
  ctx.strokeStyle = '#ff6090';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, 8, 0, Math.PI * 2);
  ctx.fillStyle = '#ff6090';
  ctx.fill();
  ctx.fillStyle = '#6a4a8a';
  ctx.font = '10px Courier New';
  ctx.textAlign = 'center';
  ctx.fillText('e⁻', cx, cy + 32);
}

function drawBarrier() {
  const bx = BARRIER_X(), cy = H() / 2;
  const gap = SLIT_GAP(), sh = SLIT_H(), bw = 10;
  const s1t = cy - gap/2 - sh/2;
  const s1b = cy - gap/2 + sh/2;
  const s2t = cy + gap/2 - sh/2;
  const s2b = cy + gap/2 + sh/2;

  ctx.fillStyle = '#0d0d1e';
  ctx.strokeStyle = '#3a1a5a';
  ctx.lineWidth = 1;

  [[0, s1t], [s1b, s2t - s1b], [s2b, H() - s2b]].forEach(([y, h]) => {
    ctx.fillRect(bx - bw/2, y, bw, h);
    ctx.strokeRect(bx - bw/2, y, bw, h);
  });

  const sc = detectorOn ? '#40ffcc' : '#ff6090';
  ctx.strokeStyle = sc;
  ctx.lineWidth = 2;
  ctx.strokeRect(bx - bw/2 - 1, s1t - 2, bw + 2, sh + 4);
  ctx.strokeRect(bx - bw/2 - 1, s2t - 2, bw + 2, sh + 4);

  if (detectorOn) {
    ctx.fillStyle = '#40ffcc';
    ctx.font = '8px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('DET', bx, s1t - 10);
    ctx.fillText('DET', bx, s2b + 16);
  }
}

function drawScreen() {
  const sx = SCREEN_X(), sw = 24;

  ctx.fillStyle = '#0d0d1e';
  ctx.fillRect(sx, 0, sw, H());
  ctx.strokeStyle = '#3a1a5a';
  ctx.lineWidth = 1;
  ctx.strokeRect(sx, 0, sw, H());

  const bins = {}, bs = 4;
  screenHits.forEach(y => {
    const b = Math.floor(y / bs) * bs;
    bins[b] = (bins[b] || 0) + 1;
  });
  const mx = Math.max(...Object.values(bins), 1);

  Object.entries(bins).forEach(([by, cnt]) => {
    const a = Math.min((cnt / mx) * 1.8, 1);
    const y = parseFloat(by);
    if (detectorOn && detStrength >= 60) {
      ctx.fillStyle = `rgba(64,255,204,${a})`;
    } else {
      ctx.fillStyle = `rgba(255,96,144,${a})`;
    }
    ctx.fillRect(sx + 2, y, sw - 4, bs + 1);
  });

  ctx.fillStyle = '#3a1a5a';
  ctx.font = '8px Courier New';
  ctx.textAlign = 'center';
  ctx.fillText('SCREEN', sx + sw/2, H() - 8);
}

function drawElectrons() {
  electrons.forEach(e => {
    if (e.alpha <= 0) return;
    const col = e.isWave
      ? `rgba(255,96,144,${e.alpha})`
      : `rgba(64,255,204,${e.alpha})`;

    if (e.isWave && !e.passedBarrier) {
      ctx.beginPath();
      ctx.arc(e.x, e.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = col;
      ctx.fill();
      if (e.waveR > 0 && e.waveR < 30) {
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.waveR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,96,144,${e.alpha * 0.15})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    } else {
      const r = e.passedBarrier ? 3 : 4;
      ctx.beginPath();
      ctx.arc(e.x, e.y, r, 0, Math.PI * 2);
      ctx.fillStyle = col;
      ctx.fill();
    }

    if (e.phase === 'hit') {
      ctx.beginPath();
      ctx.arc(e.x, e.y, 22 * (1 - e.alpha), 0, Math.PI * 2);
      ctx.strokeStyle = col;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  });
}

function toggleDetector() {
  detectorOn = !detectorOn;
  const toggle = document.getElementById('detToggle');
  const badge  = document.getElementById('detStatus');
  const grp    = document.getElementById('strGroup');
  const slider = document.getElementById('strSlider');

  toggle.classList.toggle('on', detectorOn);

  if (detectorOn) {
    badge.textContent = 'ON';
    badge.classList.add('on');
    grp.style.opacity = '1';
    slider.disabled = false;
    detStrength = 70;
    slider.value = 70;
    document.getElementById('strVal').textContent = '70';
  } else {
    badge.textContent = 'OFF';
    badge.classList.remove('on');
    grp.style.opacity = '0.3';
    slider.disabled = true;
    detStrength = 0;
    slider.value = 0;
    document.getElementById('strVal').textContent = '0';
  }

  updateInfoPanel();
  screenHits = [];
  electrons = [];
}

function updateStrength(val) {
  detStrength = parseInt(val);
  document.getElementById('strVal').textContent = val;
}

function updateSpeed(val) {
  fireSpeed = parseInt(val);
  document.getElementById('speedVal').textContent = val;
}

function resetSim() {
  electrons = [];
  screenHits = [];
  totalElectrons = 0;
  document.getElementById('statTotal').textContent = '0';
}

function updateInfoPanel() {
  const title = document.getElementById('behaviorTitle');
  const text  = document.getElementById('behaviorText');
  const mode  = document.getElementById('statMode');

  if (detectorOn) {
    title.textContent = 'PARTICLE BEHAVIOR';
    title.style.color = '#40ffcc';
    text.innerHTML = 'Detector <strong>on</strong>: Which slit the electron passed through is now measurable. The wave function <strong>collapses</strong> — only two bands appear on the screen.';
    mode.textContent = 'PARTICLE';
    mode.style.color = '#40ffcc';
  } else {
    title.textContent = 'WAVE BEHAVIOR';
    title.style.color = '#ff6090';
    text.innerHTML = 'Detector <strong>off</strong>: The electron passes through both slits simultaneously and interferes with itself. Multiple bright and dark fringes appear on the screen.';
    mode.textContent = 'WAVE';
    mode.style.color = '#ff6090';
  }
}

function loop(ts) {
  drawBackground();
  drawSource();
  drawBarrier();
  drawScreen();
  updateElectrons();
  drawElectrons();

  const interval = Math.max(40, 300 / fireSpeed);
  if (ts - lastFire > interval) {
    fireElectron();
    lastFire = ts;
  }
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
