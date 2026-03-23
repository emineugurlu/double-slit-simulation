const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');

const W = () => canvas.width;
const H = () => canvas.height;

const N = 512;
const dx = 1.0;
const dt = 0.5;
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