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

## 📖 Explanation

Below is a detailed explanation of the physics behind the simulation 👇

# Physics Visualizations

## The Strangest Experiment in History

The Strangest Experiment in History
In 1801, Thomas Young did something simple: he shone light through two slits and looked at the screen behind them. What he saw was not two bright bands. There were dozens of thin stripes — alternating light and dark. Light was behaving like a wave, interfering with itself.
Fine, they said. Light is a wave. Mystery solved.
Then they ran the same experiment with electrons.
Same result.
An electron — one of the most fundamental particles of matter — was also behaving like a wave. But it got stranger. They fired electrons one at a time. One electron. Wait. Another. Wait. After hundreds of electrons, they looked at the screen.
The interference pattern had formed anyway.
A single electron had passed through both slits at once and interfered with itself.
<img width="1919" height="869" alt="image" src="https://github.com/user-attachments/assets/a540f327-f6e4-4602-8161-4bc29b1b24a1" />

How was it doing that?

The Answer: We Don't Know
Read that again. Because it is the most honest and most unsettling sentence in modern physics.
When they observed the electron — when they tried to find out which slit it went through — everything changed. The interference pattern vanished instantly. The electron started behaving like a classical ball, going through either the left or the right slit.
The act of observation changed the outcome.
Setting up a camera was enough. Turning on a detector was enough. Even just having the information physically exist somewhere was enough.
Why?
The answer: We don't know.
<img width="1903" height="871" alt="image" src="https://github.com/user-attachments/assets/642ec4b6-1556-450c-8513-e1ea599664db" />


The Wave Function — Is It Reality Itself?
Quantum mechanics describes the situation like this: before measurement, an electron does not have a definite position. Instead, it exists as a wave function ψ.
This wave function encodes the probability of finding the electron at every point in space. It is an abstract mathematical object — but it has real physical consequences. It is what creates the interference pattern.
The brightness at each point on the screen is calculated by:
I(y) = |ψ₁ + ψ₂|²
ψ₁ and ψ₂ are the wave amplitudes coming from each slit. First you add, then you square. This order matters — if you squared first and then added, there would be no interference.
In the simulation, for each pixel we compute:
ψ = A × exp(-(Δy²/2σ²)) × exp(i × 2πr/λ)

r — distance from that point to the slit
λ — wavelength
σ — diffraction envelope width
exp(i×phase) — complex phase factor

We accumulate real and imaginary parts separately from both slits:
total = (re₁+re₂)² + (im₁+im₂)²
This gives us |ψ|² — the probability density. The electron lands here more often.
<img width="1896" height="864" alt="image" src="https://github.com/user-attachments/assets/bcea628f-9106-4430-8aee-f22ada3a4389" />


Interference: Nature's Most Beautiful Trick
When two waves meet at the same point, they superpose.
Constructive interference: Two crests meet. Amplitudes add up. Bright band.
Δr = nλ
This happens when the path difference is a whole number of wavelengths.
Destructive interference: A crest meets a trough. They cancel each other out completely. Dark band. Silence.
Δr = (n + ½)λ
The bright and dark fringes on the screen come from exactly this.

Wave Interference — Two Sources, Infinite Patterns
To make the physics behind the double-slit experiment visible, we built a second simulation.
Imagine two point sources emitting waves. Each source sends out concentric rings spreading outward. When these two waves meet — what happens?
ψ_total = ψ₁ + ψ₂
= A×cos(2πr₁/λ - ωt) + A×cos(2πr₂/λ - ωt)
For every point, we compute the distance r₁ and r₂ to each source. The path difference Δr = r₂ - r₁ determines the outcome.
You can change frequency, amplitude, and the distance between the two sources. Increasing the distance makes the pattern denser. Increasing the frequency makes the rings smaller and the pattern more complex.
<img width="1916" height="867" alt="image" src="https://github.com/user-attachments/assets/f331443a-59f4-4a3b-bb6e-72fd394d561a" />

This simulation explains the double-slit experiment directly: each slit acts as a wave source. The waves from the two slits interfere exactly like in the wave interference simulation — and that is why bright and dark fringes appear on the screen.

What Happens When the Detector Turns On?
When you turn on the detector, one question gets answered: which slit did the electron go through?
And that question ruins everything.
The moment information leaks into the physical environment — when a photon hits the electron, when a spin flips, when any trace is left behind — the electron can no longer exist in superposition. The wave function collapses. The electron behaves as if it went through only one slit.
Two bands appear. The interference is gone.
<img width="1917" height="866" alt="image" src="https://github.com/user-attachments/assets/4183d8ba-2fae-4c2a-b70f-1aef688c41cf" />

This is decoherence — the electron becoming entangled with its environment and losing quantum coherence. It does not require consciousness. It does not require an observer. It only requires that information physically exists somewhere.
The Heisenberg Uncertainty Principle is directly connected to this:
Δx × Δp ≥ ℏ/2
The more precisely we measure position, the more we disturb momentum. This is not a measurement error — it is a fundamental limit built into nature itself.

Questions That Still Have No Answer
Why does the wave function collapse? Physicists still disagree:
Copenhagen Interpretation: Before measurement, position simply does not exist. The question "where was the electron?" is meaningless. The wave function is reality itself. Collapse happens at measurement.
Bohm — Pilot Wave Theory: No. The electron always had a position. But there is an unobservable pilot wave guiding it. Everything is deterministic. No randomness — only hidden variables.
Many Worlds Interpretation: The wave function never collapses. At every measurement the universe splits in two. You are living in one branch. Another version of you is living in another.
Relational Quantum Mechanics (Rovelli): Nothing has absolute properties. Every property only acquires meaning through interaction with something else. The right question is not "where is the electron?" but "where is the electron relative to this system?"
Which one is correct? The experiments support all of them. You could also say they rule out all of them. Because every interpretation produces the same mathematical predictions — they only differ in what they say reality actually is.

How the Simulations Work
Double-Slit:
Every time an electron hits the screen, addHit(y) is called and the intensity array accumulates. As more electrons arrive, the pattern sharpens — just like the real experiment.
Rejection sampling determines where the electron lands:
javascriptdo {
  y = pick random point
  prob = computeIntensity(y) / maxIntensity
} while (Math.random() > prob)
Points with high |ψ|² get hit more often. Dark fringes never get hit.
When the detector is on, the electron picks one slit at random and samples from a Gaussian distribution around that slit. No interference.
Wave Interference:
For every pixel, we compute the wave arriving from both sources:
javascriptconst phase = (2 * Math.PI * r) / lambda - time;
total += Math.cos(phase);
time increases every frame — the waves move. The total value is normalized and mapped to color: green for constructive interference, pink for destructive.

Tech Stack

Vanilla JavaScript — no frameworks
HTML5 Canvas API — pixel-level control
GitHub Pages — zero setup deployment


Live Demo
🔗 https://emineugurlu.github.io/double-slit-simulation/

What's Coming

✅ Double-Slit Experiment
✅ Wave Interference
🔜 Quantum Tunneling
🔜 Schrödinger's Equation
