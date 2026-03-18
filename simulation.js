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
