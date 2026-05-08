# ⚛️ Quantum Physics Visualizer: Wave-Particle Duality & Tunneling

> **"A high-fidelity computational physics simulation designed to visualize the fundamental paradoxes of quantum mechanics. Built with Vanilla JavaScript and HTML5 Canvas, this engine solves the time-dependent Schrödinger equation in real-time to demonstrate wave-particle duality and quantum tunneling."**

![Language](https://img.shields.io/badge/Language-JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Platform](https://img.shields.io/badge/Platform-Web--HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![Domain](https://img.shields.io/badge/Domain-Quantum%20Mechanics-blueviolet?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

**Quantum Physics Visualizer** is a high-performance simulation ecosystem designed to bridge the gap between abstract quantum mathematics and visual intuition. Developed by **Emine Uğurlu**, this platform models complex phenomena such as wave function collapse and quantum tunneling within a browser-based environment in real-time.

---

## 🚀 Engineering & Physics Excellence

This project showcases advanced computational physics and an optimized visualization architecture:

* **Schrödinger Equation Integration:** The core engine is built upon a numerical solver for the **Time-Dependent Schrödinger Equation (TDSE)**:
    $$\imath \hbar \frac{\partial}{\partial t} \Psi(x,t) = \left[ -\frac{\hbar^2}{2m} \frac{\partial^2}{\partial x^2} + V(x,t) \right] \Psi(x,t)$$
* **Wave Function ($\Psi$) Simulation:** Real-time tracking of complex-valued probability amplitudes ($\Psi = A + iB$) and rendering of interference patterns using the $I(y) = |\psi_1 + \psi_2|^2$ formulation.
* **Numerical Finite Difference Solver:** Optimized explicit finite difference algorithms to simulate the interaction of wave packets with potential barriers $V(x)$.
* **Decoherence Modeling:** Implementation of the "Observer Effect" algorithm, demonstrating how the act of measurement collapses the wave function into classical particle behavior.
* **High-Performance Rendering:** Direct pixel manipulation on **HTML5 Canvas** for a fluid simulation experience with a low-latency computational loop.

## ✨ Core Features

* 🔬 **Interactive Double-Slit:** Dynamically control detectors to witness the transition from wave interference to particle bands (Wave Function Collapse).
* ⚡ **Quantum Tunneling:** Visualize a Gaussian wave packet penetrating classically impassable potential barriers through quantum tunneling ($T \approx e^{-2\kappa L}$).
* 🌊 **Wave Function Visualization:** Analyze $\Psi$ amplitudes and phase differences representing the wave-like nature of matter through high-resolution graphics.
* 📈 **Mathematical Transparency:** Dynamic data visualizations of probability density ($| \Psi |^2$) and energy levels that update in real-time during the simulation.

## 📸 Simulation Showcase

<p align="center">
  <img src="https://github.com/user-attachments/assets/a540f327-f6e4-4602-8161-4bc29b1b24a1" width="49%" alt="Double Slit Experiment" />
  <img src="https://github.com/user-attachments/assets/2dcf43c7-25de-4f01-852d-d990a3e3c068" width="49%" alt="Quantum Tunneling" />
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/868609cd-b5e8-49a9-982c-1d2b7339aac1" width="49%" alt="Schrödinger's Equation Solver" />
  <img src="https://github.com/user-attachments/assets/6e0466ec-1502-4e3a-8155-6e0c4db8049d" width="49%" alt="Wave Interference" />
</p>


</p>

---

## 🛠️ Tech Stack

* **Language:** Vanilla JavaScript (ES6+).
* **Rendering:** HTML5 Canvas API.
* **Physics Engine:** Numerical Finite Difference Methods.
* **Styling:** CSS3 (Modern Flexbox/Grid).

---

## ⚙️ Quick Start

1. **Clone the Repository:**
 ```bash
  git clone [https://github.com/emineugurlu/double-slit-simulation.git](https://github.com/emineugurlu/double-slit-simulation.git)
  cd double-slit-simulation
  ````
2 **Run the Project:**

Simply open index.html in any modern web browser. Alternatively, access the live demo here: [Live Demo : ][https://emineugurlu.github.io/double-slit-simulation/]

Developed by Emine Uğurlu - Computer Engineer - Visualizing the invisible through the power of code.
