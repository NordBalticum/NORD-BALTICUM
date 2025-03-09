/* 🔥 Pagrindiniai mygtukų stiliai */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  padding: 16px 32px;
  border-radius: 12px;
  border: 2px solid var(--white-gold);
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: relative;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(255, 248, 225, 0.5);
}

/* 🎭 Futuristinis hover efektas */
.button::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300%;
  height: 300%;
  background: rgba(255, 255, 255, 0.15);
  transition: all 0.5s ease-in-out;
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
}

.button:hover::before {
  transform: translate(-50%, -50%) scale(1);
}

/* ✅ 🔥 Premium Gradientai */
.button.primary {
  background: linear-gradient(90deg, #0A1F44, #142F60);
  color: var(--white-gold);
  box-shadow: 0 6px 22px rgba(255, 248, 225, 0.6);
}

.button.primary:hover {
  background: linear-gradient(90deg, #142F60, #0A1F44);
  filter: brightness(1.1);
  transform: translateY(-4px);
}

/* 🔵 Premium Blue */
.button.blue {
  background: linear-gradient(90deg, #212BFF, #0A1F44);
  color: var(--white-gold);
  border: 2px solid var(--white-gold);
  box-shadow: 0 6px 22px rgba(33, 43, 255, 0.5);
}

.button.blue:hover {
  background: linear-gradient(90deg, #0A1F44, #212BFF);
  filter: brightness(1.1);
  transform: translateY(-4px);
}

/* 🏆 Premium Dark */
.button.dark {
  background: linear-gradient(90deg, #000000, #222222);
  color: var(--white-gold);
  border: 2px solid var(--white-gold);
  box-shadow: 0 6px 22px rgba(255, 248, 225, 0.5);
}

.button.dark:hover {
  background: linear-gradient(90deg, #222222, #000000);
  filter: brightness(1.1);
  transform: translateY(-4px);
}

/* 🎭 Outline */
.button.outline {
  background: transparent;
  border: 2px solid var(--white-gold);
  color: var(--white-gold);
  box-shadow: 0 6px 18px rgba(255, 248, 225, 0.4);
}

.button.outline:hover {
  background: rgba(255, 248, 225, 0.1);
  transform: translateY(-3px);
}

/* 📱 FULL WIDTH */
.full-width {
  width: 100%;
}

/* 🔥 ANIMACIJOS */
@keyframes neon-glow {
  0% { box-shadow: 0 0 6px rgba(255, 248, 225, 0.4); }
  50% { box-shadow: 0 0 24px rgba(255, 248, 225, 0.7); }
  100% { box-shadow: 0 0 6px rgba(255, 248, 225, 0.4); }
}

.button.primary, 
.button.blue, 
.button.dark, 
.button.outline {
  animation: neon-glow 2.5s infinite alternate;
}

/* 🔥 RESPONSIVE OPTIMIZACIJA */
@media (max-width: 1024px) {
  .button {
    font-size: 15px;
    padding: 14px 28px;
  }
}

@media (max-width: 768px) {
  .button {
    font-size: 14px;
    padding: 12px 24px;
  }
}

@media (max-width: 480px) {
  .button {
    font-size: 13px;
    padding: 10px 22px;
    width: 100%;
  }
}
