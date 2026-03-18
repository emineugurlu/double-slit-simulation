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
  const p = canvas.parentElement;
  canvas.width = p.clientWidth;
  canvas.height = p.clientHeight - 52;
}
resize();
window.addEventListener('resize', resize);
const W = () => canvas.width;
const H = () => canvas.height;
const BARRIER_X = () => W() * 0.48;
const SCREEN_X  = () => W() * 0.82;
const SOURCE_X  = () => W() * 0.07;
const SLIT_GAP  = () => H() * 0.13;
const SLIT_H    = () => H() * 0.045;
function sampleHitY() {
  const h = H();
  const cy = h / 2;
  const d = SLIT_GAP();
  const lambda = h * 0.08;
  const L = SCREEN_X() - BARRIER_X();
  const s = detectorOn ? detStrength / 100 : 0;
  if (s >= 0.98) {
    const slit = Math.random() < 0.5 ? 1 : -1;
    return cy + slit * d / 2 + (Math.random() - 0.5) * SLIT_H() * 4;
    const maxY = h * 0.44;
  let y, prob;
  let tries = 0;

  do {
    y = cy + (Math.random() * 2 - 1) * maxY;

    const dy = y - cy;

    const interf = Math.pow(
      Math.cos(Math.PI * d * dy / (lambda * L)),
      2
    );

    const env = Math.exp(
      -dy * dy / (2 * maxY * maxY * 0.28)
    );

    const g1 = Math.exp(
      -Math.pow(dy - d/2, 2) / (2 * Math.pow(SLIT_H() * 2.5, 2))
    );
    const g2 = Math.exp(
      -Math.pow(dy + d/2, 2) / (2 * Math.pow(SLIT_H() * 2.5, 2))
    );

    const particle = (g1 + g2) * s;

    prob = (1 - s) * interf * env + particle;
    tries++;

  } while (Math.random() > prob && tries < 600);

  return y;


  }
}
function fireElectron() {
  const e = {
    x: SOURCE_X() + 18,
    y: H() / 2,
    finalY: sampleHitY(),
    phase: 'travel',
    vx: 3.5 + fireSpeed * 1.2,
    alpha: 1,
    passedBarrier: false,
    startY: H() / 2,
    waveR: 0,
    isWave: !detectorOn
  };
  electrons.push(e);
  totalElectrons++;
  document.getElementById('statTotal').textContent = totalElectrons;
}
function updateElectrons() {
  const bx = BARRIER_X();
  const sx = SCREEN_X();

  electrons = electrons.filter(e => e.alpha > 0.05);

  electrons.forEach(e => {

    if (e.phase === 'travel') {
      e.x += e.vx;

      if (!e.passedBarrier && e.x >= bx) {
        e.passedBarrier = true;
        e.startY = e.y;
      }

      if (e.passedBarrier) {
        const progress = Math.min(
          (e.x - bx) / (sx - bx),
          1
        );
        e.y = e.startY + (e.finalY - e.startY) * progress;
      }

      if (e.x >= sx) {
        e.phase = 'hit';
        e.x = sx;
        screenHits.push(e.y);
        if (screenHits.length > 2000) screenHits.shift();
      }
    }

    if (e.phase === 'hit') {
      e.alpha -= 0.07;
    }

    if (e.isWave && !e.passedBarrier) {
      e.waveR += 1.5;
    }
  });
}
function drawBackground() {
  ctx.fillStyle = '#0a0a14';
  ctx.fillRect(0, 0, W(), H());

  ctx.strokeStyle = '#1a0a2a';
  ctx.lineWidth = 0.5;

  for (let x = 0; x < W(); x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H());
    ctx.stroke();
  }

  for (let y = 0; y < H(); y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W(), y);
    ctx.stroke();
  }
}
function drawSource() {
  const cx = SOURCE_X();
  const cy = H() / 2;

  ctx.beginPath();
  ctx.arc(cx, cy, 14, 0, Math.PI * 2);
  ctx.fillStyle = '#1a0a2a';
  ctx.fill();
  ctx.strokeStyle = '#ff6090';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, 7, 0, Math.PI * 2);
  ctx.fillStyle = '#ff6090';
  ctx.fill();

  ctx.fillStyle = '#6a4a8a';
  ctx.font = '9px Courier New';
  ctx.textAlign = 'center';
  ctx.fillText('e⁻', cx, cy + 28);
}
function drawBarrier() {
  const bx = BARRIER_X();
  const cy = H() / 2;
  const gap = SLIT_GAP();
  const sh = SLIT_H();
  const bw = 10;

  const s1t = cy - gap / 2 - sh / 2;
  const s1b = cy - gap / 2 + sh / 2;
  const s2t = cy + gap / 2 - sh / 2;
  const s2b = cy + gap / 2 + sh / 2;
  ctx.fillStyle = '#0d0d1e';
  ctx.strokeStyle = '#3a1a5a';
  ctx.lineWidth = 1;

  const sections = [
    [0, s1t],
    [s1b, s2t - s1b],
    [s2b, H() - s2b]
  ];

  sections.forEach(([y, h]) => {
    ctx.fillRect(bx - bw/2, y, bw, h);
    ctx.strokeRect(bx - bw/2, y, bw, h);
  });

  const slitColor = detectorOn ? '#40ffcc' : '#ff6090';
  ctx.strokeStyle = slitColor;
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
  const sx = SCREEN_X();
  const sw = 18;

  ctx.fillStyle = '#0d0d1e';
  ctx.fillRect(sx, 0, sw, H());
  ctx.strokeStyle = '#3a1a5a';
  ctx.lineWidth = 1;
  ctx.strokeRect(sx, 0, sw, H());

  const bins = {};
  const binSize = 3;

  screenHits.forEach(y => {
    const b = Math.floor(y / binSize) * binSize;
    bins[b] = (bins[b] || 0) + 1;
  });

  const maxCount = Math.max(...Object.values(bins), 1);

  Object.entries(bins).forEach(([by, count]) => {
    const intensity = count / maxCount;
    const alpha = Math.min(intensity * 1.5, 1);
    const y = parseFloat(by);

    if (detectorOn && detStrength >= 60) {
      ctx.fillStyle = `rgba(64, 255, 204, ${alpha})`;
    } else {
      ctx.fillStyle = `rgba(255, 96, 144, ${alpha})`;
    }

    ctx.fillRect(sx + 1, y, sw - 2, binSize + 1);
  });

  ctx.fillStyle = '#3a1a5a';
  ctx.font = '8px Courier New';
  ctx.textAlign = 'center';
  ctx.fillText('SCREEN', sx + sw/2, H() - 6);
}
function drawElectrons() {
  electrons.forEach(e => {
    if (e.alpha <= 0) return;

    const col = e.isWave
      ? `rgba(255, 96, 144, ${e.alpha})`
      : `rgba(64, 255, 204, ${e.alpha})`;

    if (e.isWave && !e.passedBarrier) {
      ctx.beginPath();
      ctx.arc(e.x, e.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = col;
      ctx.fill();

      if (e.waveR < 25) {
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.waveR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 96, 144, ${e.alpha * 0.2})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    } else {
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.passedBarrier ? 2.5 : 3.5, 0, Math.PI * 2);
      ctx.fillStyle = col;
      ctx.fill();
    }

    if (e.phase === 'hit') {
      ctx.beginPath();
      ctx.arc(e.x, e.y, 20 * (1 - e.alpha), 0, Math.PI * 2);
      ctx.strokeStyle = col;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  });
}
