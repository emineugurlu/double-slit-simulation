# Double-Slit Simulation ⚛️

Do electrons really pass through **both slits at the same time**?

This project is an interactive simulation of the **double-slit experiment**, demonstrating the fundamental concept of **wave–particle duality**.

---

## 🚀 Live Demo
🔗 https://emineugurlu.github.io/double-slit-simulation/

---

## 🎮 Features

- 🔬 Toggle detector → observe interference collapse  
- ⚡ Adjustable electron emission speed  
- 🎚️ Detector strength control  
- 🌊 Wave & particle behavior visualization  
- 🎨 Real-time rendering with HTML5 Canvas  

---

## 🧠 What You’ll Observe

| Mode | Result |
|------|--------|
| Detector OFF | Interference pattern (wave behavior) |
| Detector ON  | Two bands (particle behavior) |

---

## 📖 Explanation

Below is a detailed explanation of the physics behind the simulation 👇

---

# Physics Visualizations

## The Strangest Experiment in History

In 1801, Thomas Young shone light through two slits and observed the screen behind them.

Instead of two bright bands, he saw alternating light and dark stripes. Light was behaving like a wave, interfering with itself.

Then scientists repeated the experiment with electrons.

Same result.

Even when electrons were fired one at a time, an interference pattern gradually appeared.

A single electron behaved like it passed through both slits at once.

<img width="1919" height="869" src="https://github.com/user-attachments/assets/a540f327-f6e4-4602-8161-4bc29b1b24a1" />

How is this possible?

---

## The Answer: We Don't Know

When scientists tried to observe which slit the electron passed through, the interference pattern disappeared.

The electron behaved like a classical particle.

The act of observation changed the outcome.

Even having the information exist physically is enough.

Why?

We still don’t know.

<img width="1903" height="871" src="https://github.com/user-attachments/assets/642ec4b6-1556-450c-8513-e1ea599664db" />

---

## The Wave Function — Is It Reality Itself?

Before measurement, an electron exists as a **wave function (ψ)**.

This describes the probability of finding the electron.

Intensity is calculated as:
I(y) = |ψ₁ + ψ₂|²

In the simulation:
ψ = A × exp(-(Δy²/2σ²)) × exp(i × 2πr/λ)

Final intensity:
total = (re₁+re₂)² + (im₁+im₂)²

<img width="1896" height="864" src="https://github.com/user-attachments/assets/bcea628f-9106-4430-8aee-f22ada3a4389" />

---

## Interference

Constructive interference:

<img width="1896" height="864" src="https://github.com/user-attachments/assets/bcea628f-9106-4430-8aee-f22ada3a4389" />

---

## Interference

Constructive interference:
Δr = nλ

Destructive interference:
Δr = (n + ½)λ

---

## Wave Interference

Each slit behaves like a wave source:
ψ_total = ψ₁ + ψ₂
ψ = A × cos(2πr/λ - ωt)

<img width="1916" height="867" src="https://github.com/user-attachments/assets/f331443a-59f4-4a3b-bb6e-72fd394d561a" />

---

## What Happens When the Detector Turns On?

Turning on the detector answers:

**Which slit did the electron go through?**

And that destroys the interference.

The wave function collapses.

<img width="1917" height="866" src="https://github.com/user-attachments/assets/4183d8ba-2fae-4c2a-b70f-1aef688c41cf" />

This is called **decoherence**.

---

## How the Simulation Works

### Double-Slit

- Probability based on |ψ|²  
- More hits → clearer pattern  

### Wave Interference

- Each pixel computes wave contribution  
- Time evolves → animation  

---

## 🛠️ Tech Stack

- Vanilla JavaScript  
- HTML5 Canvas  
- GitHub Pages  

---

## 🔮 What's Next

- ✅ Double-Slit Experiment  
- ✅ Wave Interference  
- 🔜 Quantum Tunneling  
- 🔜 Schrödinger's Equation  
