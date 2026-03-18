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
