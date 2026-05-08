const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');

const W = () => canvas.width;
const H = () => canvas.height;

let n1 = 1;
let n2 = 2;
let superOn = false;
let time = 0;
let animId = null;

function resize() {
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = window.innerHeight - 90;
}
resize();
window.addEventListener('resize', resize);
function psi(x, n) {
  return Math.sqrt(2) * Math.sin(n * Math.PI * x);
}

function energy(n) {
  return n * n;
}

function getWaveFunction(x) {
  if (!superOn) {
    return psi(x, n1) * Math.cos(energy(n1) * time * 0.02);
  } else {
    const a = psi(x, n1) * Math.cos(energy(n1) * time * 0.02);
    const b = psi(x, n2) * Math.cos(energy(n2) * time * 0.02);
    return (a + b) / Math.sqrt(2);
  }
}

function getProbability(x) {
  const w = getWaveFunction(x);
  return w * w;
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

  const margin = W() * 0.1;
  const wellW = W() - margin * 2;
  const cy = H() / 2;
  const scale = H() * 0.3;
  const N = 500;

  ctx.strokeStyle = '#3a1a5a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(margin, 0);
  ctx.lineTo(margin, H());
  ctx.moveTo(margin + wellW, 0);
  ctx.lineTo(margin + wellW, H());
  ctx.stroke();

  ctx.fillStyle = '#1a0a2a';
  ctx.fillRect(0, 0, margin, H());
  ctx.fillRect(margin + wellW, 0, margin, H());

  ctx.strokeStyle = '#3a1a5a';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(margin, cy);
  ctx.lineTo(margin + wellW, cy);
  ctx.stroke();
  ctx.setLineDash([]);

  const energyLevels = superOn ? [n1, n2] : [n1];
  energyLevels.forEach((n, idx) => {
    const eY = cy - energy(n) * scale * 0.08;
    ctx.strokeStyle = idx === 0 ? 'rgba(255,96,144,0.3)' : 'rgba(64,255,204,0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);
    ctx.beginPath();
    ctx.moveTo(margin, eY);
    ctx.lineTo(margin + wellW, eY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = idx === 0 ? 'rgba(255,96,144,0.6)' : 'rgba(64,255,204,0.6)';
    ctx.font = '9px Courier New';
    ctx.textAlign = 'left';
    ctx.fillText(`n=${n}`, margin + 4, eY - 4);
  });

  ctx.fillStyle = 'rgba(255, 96, 144, 0.1)';
  ctx.beginPath();
  for (let i = 0; i <= N; i++) {
    const x = i / N;
    const px = margin + x * wellW;
    const prob = getProbability(x) * scale * 1.2;
    if (i === 0) ctx.moveTo(px, cy - prob);
    else ctx.lineTo(px, cy - prob);
  }
  for (let i = N; i >= 0; i--) {
    const x = i / N;
    const px = margin + x * wellW;
    ctx.lineTo(px, cy);
  }
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#ff6090';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let i = 0; i <= N; i++) {
    const x = i / N;
    const px = margin + x * wellW;
    const prob = getProbability(x) * scale * 1.2;
    if (i === 0) ctx.moveTo(px, cy - prob);
    else ctx.lineTo(px, cy - prob);
  }
  ctx.stroke();

  ctx.strokeStyle = 'rgba(192, 160, 255, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  for (let i = 0; i <= N; i++) {
    const x = i / N;
    const px = margin + x * wellW;
    const w = getWaveFunction(x) * scale * 0.8;
    if (i === 0) ctx.moveTo(px, cy - w);
    else ctx.lineTo(px, cy - w);
  }
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#c0a0ff';
  ctx.font = '9px Courier New';
  ctx.textAlign = 'left';
  ctx.fillText('ψ(x)', margin + 4, cy - scale * 0.7);
  ctx.fillStyle = '#ff6090';
  ctx.fillText('|ψ(x)|²', margin + 4, cy - scale * 0.5);

  ctx.fillStyle = '#3a2a4a';
  ctx.font = '9px Courier New';
  ctx.textAlign = 'center';
  ctx.fillText('x = 0', margin, H() - 10);
  ctx.fillText('x = L', margin + wellW, H() - 10);
}
function updateLevel(val) {
  n1 = parseInt(val);
  document.getElementById('levelVal').textContent = val;
  document.getElementById('statLevel').textContent = `n=${n1}`;
  document.getElementById('statEnergy').textContent = `E${n1} = ${n1*n1}E₁`;
  time = 0;
}

function updateLevel2(val) {
  n2 = parseInt(val);
  document.getElementById('levelVal2').textContent = val;
  time = 0;
}

function toggleSuper() {
  superOn = !superOn;
  const toggle = document.getElementById('superToggle');
  const badge = document.getElementById('superStatus');
  const grp = document.getElementById('level2Group');
  const slider = document.getElementById('energyLevel2');

  toggle.classList.toggle('on', superOn);
  badge.textContent = superOn ? 'ON' : 'OFF';
  badge.classList.toggle('on', superOn);
  grp.style.opacity = superOn ? '1' : '0.3';
  slider.disabled = !superOn;
  time = 0;
}

function resetSim() {
  n1 = 1;
  n2 = 2;
  superOn = false;
  time = 0;
  document.getElementById('energyLevel').value = 1;
  document.getElementById('energyLevel2').value = 2;
  document.getElementById('levelVal').textContent = '1';
  document.getElementById('levelVal2').textContent = '2';
  document.getElementById('statLevel').textContent = 'n=1';
  document.getElementById('statEnergy').textContent = 'E₁ = 1E₁';
  document.getElementById('superToggle').classList.remove('on');
  document.getElementById('superStatus').textContent = 'OFF';
  document.getElementById('superStatus').classList.remove('on');
  document.getElementById('level2Group').style.opacity = '0.3';
  document.getElementById('energyLevel2').disabled = true;
}

function loop() {
  time += 1;
  draw();
  animId = requestAnimationFrame(loop);
}

loop();
