.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  padding: 16px 32px;
  border-radius: 14px;
  border: 2px solid #FFF8E1;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 6px 18px rgba(255, 248, 225, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: relative;
  overflow: hidden;
  background: linear-gradient(90deg, #0A0A0A, #333);
  color: #FFF8E1;
}

/* 🔥 Futuristinis hover efektas */
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

/* 🎨 PREMIUM GRADIENTAI */
.button.primary {
  background: linear-gradient(90deg, #0A0A0A, #333);
  color: #FFF8E1;
  box-shadow: 0 6px 22px rgba(255, 248, 225, 0.5);
}

.button.primary:hover {
  background: linear-gradient(90deg, #333, #0A0A0A);
  filter: brightness(1.1);
  transform: translateY(-4px);
}

/* 🔵 PREMIUM BLUE VARIANT */
.button.blue {
  background: linear-gradient(90deg, #212BFF, #0A1F44);
  color: #FFF8E1;
  border: 2px solid #FFF8E1;
  box-shadow: 0 6px 22px rgba(33, 43, 255, 0.5);
}

.button.blue:hover {
  background: linear-gradient(90deg, #0A1F44, #212BFF);
  filter: brightness(1.1);
  transform: translateY(-4px);
}

/* 🔥 OUTLINE & GHOST */
.button.outline {
  background: transparent;
  border: 2px solid #FFF8E1;
  color: #FFF8E1;
  box-shadow: 0 6px 18px rgba(255, 248, 225, 0.4);
}

.button.outline:hover {
  background: rgba(255, 248, 225, 0.1);
  transform: translateY(-3px);
}

.button.ghost {
  background: none;
  border: none;
  color: #FFF8E1;
}

.button.ghost:hover {
  color: #FFF8E1;
}

/* 🔥 DYDŽIAI */
.button.small {
  font-size: 14px;
  padding: 12px 24px;
}

.button.medium {
  font-size: 16px;
  padding: 16px 32px;
}

.button.large {
  font-size: 18px;
  padding: 20px 40px;
}

/* 🎭 IKONOS */
.button-icon {
  margin-right: 10px;
  font-size: 1.5em;
}

/* 🔄 DISABLED */
.button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
