const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');

const W = () => canvas.width;
const H = () => canvas.height;
const BARRIER_X = () => W() * 0.45;
const SCREEN_X  = () => W() * 0.70;
const SOURCE_X  = () => W() * 0.07;
const SLIT_GAP  = () => H() * 0.12; // Makale için biraz optimize
const SLIT_H    = () => H() * 0.04;

let detectorOn  = false;
let detStrength = 0;
let fireSpeed   = 3; // Elektron sayısını artırmak için hız
let totalElectrons = 0;
let lastFire    = 0;
let electrons   = [];
let intensity   = null;
let maxIntensity = 0;
let lambda      = 25; // Dalga boyunu makale için biraz büyüttük

function resize() {
  canvas.width  = canvas.parentElement.clientWidth;
  canvas.height = window.innerHeight - 90;
  resetIntensity();
}
resize();
window.addEventListener('resize', resize);

function resetIntensity() {
  intensity    = new Float32Array(Math.ceil(H()));
  maxIntensity = 0;
}

function getSlits() {
  const cy  = H() / 2;
  const gap = SLIT_GAP();
  return [
    { y: cy - gap / 2 },
    { y: cy + gap / 2 }
  ];
}

function computeScreenIntensity(screenY, slits) {
  const L  = SCREEN_X() - BARRIER_X();
  const sh = SLIT_H();
  let re = 0, im = 0;

  slits.forEach(slit => {
    const dy       = screenY - slit.y;
    const r        = Math.sqrt(L * L + dy * dy);
    const phase    = (2 * Math.PI * r) / lambda;
    const envelope = Math.exp(-(dy * dy) / (2 * H() * H() * 0.12));
    re += envelope * Math.cos(phase);
    im += envelope * Math.sin(phase);
  });

  return re * re + im * im;
}

function addHit(y) {
  const yi = Math.round(y);
  if (yi < 0 || yi >= intensity.length) return;
  const spread = detectorOn && detStrength >= 50 ? 18 : 2;
  for (let i = -spread; i <= spread; i++) {
    const idx = yi + i;
    if (idx >= 0 && idx < intensity.length) {
      intensity[idx] += Math.exp(-(i * i) / (2 * spread * spread));
      if (intensity[idx] > maxIntensity) maxIntensity = intensity[idx];
    }
  }
}

function sampleY(activeSlits) {
  const h  = H();
  const cy = h / 2;

  if (detectorOn && detStrength >= 50) {
    const slit = activeSlits[0];
    const spread = detectorOn && detStrength >= 50 ? 10 : 2;
  }

  let y, prob, tries = 0;
  do {
    y    = cy + (Math.random() * 2 - 1) * h * 0.48;
    prob = computeScreenIntensity(y, activeSlits) / (maxIntensity || 1);
    tries++;
  } while (Math.random() > prob && tries < 1000);
  return y;
}

function fireElectron() {
  const slits = getSlits();
  let activeSlits;

  if (detectorOn && detStrength >= 50) {
    activeSlits = [slits[Math.random() < 0.5 ? 0 : 1]];
  } else {
    activeSlits = slits;
  }

  const finalY = sampleY(activeSlits);
  const slitY  = activeSlits[
    Math.floor(Math.random() * activeSlits.length)
  ].y;

  electrons.push({
    x: SOURCE_X() + 20,
    y: H() / 2,
    slitY,
    finalY,
    vx: 3 + fireSpeed * 1.2,
    alpha: 1,
    phase: 'travel',
    passedBarrier: false,
    startY: H() / 2,
    barrierX: BARRIER_X(),
    waveR: 0,
    isWave: !(detectorOn && detStrength >= 50)
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
        e.startY        = e.slitY;
      }

      if (e.passedBarrier) {
        const progress = Math.min(
          (e.x - e.barrierX) / (SCREEN_X() - e.barrierX), 1
        );
        const eased = progress * progress * (3 - 2 * progress);
        e.y = e.startY + (e.finalY - e.startY) * eased;
      }

      if (e.x >= SCREEN_X()) {
        e.phase = 'hit';
        e.x     = SCREEN_X();
        e.y     = e.finalY;
        addHit(e.finalY);
      }
    }

    if (e.phase === 'hit') e.alpha -= 0.06;
    if (e.isWave && !e.passedBarrier) e.waveR += 2;
  });
}

function drawBackground() {
  ctx.fillStyle = '#0a0a14';
  ctx.fillRect(0, 0, W(), H());
}

function drawSource() {
  const cx = SOURCE_X(), cy = H() / 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 16, 0, Math.PI * 2);
  ctx.fillStyle = '#1a0a2a'; ctx.fill();
  ctx.strokeStyle = '#ff6090'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, 8, 0, Math.PI * 2);
  ctx.fillStyle = '#ff6090'; ctx.fill();
  ctx.fillStyle = '#6a4a8a';
  ctx.font = '10px Courier New';
  ctx.textAlign = 'center';
  ctx.fillText('SOURCE', cx, cy + 32);
}

function drawBarrier() {
  const bx  = BARRIER_X(), cy = H() / 2;
  const gap = SLIT_GAP(), sh = SLIT_H(), bw = 10;
  const s1t = cy - gap/2 - sh/2, s1b = cy - gap/2 + sh/2;
  const s2t = cy + gap/2 - sh/2, s2b = cy + gap/2 + sh/2;

  ctx.fillStyle   = '#0d0d1e';
  ctx.strokeStyle = '#3a1a5a';
  ctx.lineWidth   = 1;

  [[0, s1t], [s1b, s2t - s1b], [s2b, H() - s2b]].forEach(([y, h]) => {
    ctx.fillRect(bx - bw/2, y, bw, h);
    ctx.strokeRect(bx - bw/2, y, bw, h);
  });

  const sc = (detectorOn && detStrength >= 50) ? '#40ffcc' : '#ff6090';
  ctx.strokeStyle = sc; ctx.lineWidth = 2;
  ctx.strokeRect(bx - bw/2 - 1, s1t - 2, bw + 2, sh + 4);
  ctx.strokeRect(bx - bw/2 - 1, s2t - 2, bw + 2, sh + 4);

  if (detectorOn && detStrength >= 50) {
    ctx.fillStyle = '#40ffcc';
    ctx.font = '8px Courier New'; ctx.textAlign = 'center';
    ctx.fillText('DET', bx, s1t - 10);
    ctx.fillText('DET', bx, s2b + 16);
  }
}

function drawScreen() {
  const sx = SCREEN_X(), sw = 24;
  ctx.fillStyle = '#0d0d1e';
  ctx.fillRect(sx, 0, sw, H());
  ctx.strokeStyle = '#3a1a5a'; ctx.lineWidth = 1;
  ctx.strokeRect(sx, 0, sw, H());

  const isParticle = detectorOn && detStrength >= 50;

  if (!intensity || maxIntensity === 0) {
    ctx.fillStyle = '#3a1a5a';
    ctx.font = '8px Courier New'; ctx.textAlign = 'center';
    ctx.fillText('SCREEN', sx + sw/2, H() - 8);
    return;
  }

  for (let y = 0; y < intensity.length; y++) {
    const norm = intensity[y] / maxIntensity;
    if (norm < 0.01) continue;
    const a = Math.min(norm * 2, 1);
    if (isParticle) {
      ctx.fillStyle = `rgba(64,255,204,${a})`;
    } else {
      ctx.fillStyle = `rgba(255,96,144,${a})`;
    }
    ctx.fillRect(sx + 2, y, sw - 4, 1);
  }

  ctx.fillStyle = '#3a1a5a';
  ctx.font = '8px Courier New'; ctx.textAlign = 'center';
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
      ctx.fillStyle = col; ctx.fill();
      if (e.waveR > 0 && e.waveR < 30) {
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.waveR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,96,144,${e.alpha * 0.15})`;
        ctx.lineWidth = 1; ctx.stroke();
      }
    } else {
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.passedBarrier ? 3 : 4, 0, Math.PI * 2);
      ctx.fillStyle = col; ctx.fill();
    }

    if (e.phase === 'hit') {
      ctx.beginPath();
      ctx.arc(e.x, e.y, 22 * (1 - e.alpha), 0, Math.PI * 2);
      ctx.strokeStyle = col; ctx.lineWidth = 1.5; ctx.stroke();
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
    badge.textContent = 'ON'; badge.classList.add('on');
    grp.style.opacity   = '1';
    slider.disabled     = false;
    detStrength         = 70;
    slider.value        = 70;
    document.getElementById('strVal').textContent = '70';
  } else {
    badge.textContent = 'OFF'; badge.classList.remove('on');
    grp.style.opacity   = '0.3';
    slider.disabled     = true;
    detStrength         = 0;
    slider.value        = 0;
    document.getElementById('strVal').textContent = '0';
  }

  resetIntensity();
  electrons = [];
  updateInfoPanel();
}

function updateStrength(val) {
  detStrength = parseInt(val);
  document.getElementById('strVal').textContent = val;
  resetIntensity();
  electrons = [];
}

function updateSpeed(val) {
  fireSpeed = parseInt(val);
  document.getElementById('speedVal').textContent = val;
}

function resetSim() {
  electrons      = [];
  totalElectrons = 0;
  document.getElementById('statTotal').textContent = '0';
  resetIntensity();
}

function updateInfoPanel() {
  const title = document.getElementById('behaviorTitle');
  const text  = document.getElementById('behaviorText');
  const mode  = document.getElementById('statMode');

  if (detectorOn && detStrength >= 50) {
    title.textContent  = 'PARTICLE BEHAVIOR';
    title.style.color  = '#40ffcc';
    text.innerHTML     = 'Detector <strong>on</strong>: Only one slit is detected, wave collapses, two bands appear.';
    mode.textContent   = 'PARTICLE';
    mode.style.color   = '#40ffcc';
  } else {
    title.textContent  = 'WAVE BEHAVIOR';
    title.style.color  = '#ff6090';
    text.innerHTML     = 'Detector <strong>off</strong>: Electron interferes as a wave, multiple bright/dark fringes appear.';
    mode.textContent   = 'WAVE';
    mode.style.color   = '#ff6090';
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