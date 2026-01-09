// Efeito Parallax
document.addEventListener('DOMContentLoaded', function() {
  const parallaxContainer = document.querySelector('.parallax-container');
  
  if (!parallaxContainer) return;
  
  const layers = document.querySelectorAll('.layer');
  const movementMultipliers = [0.05, 0.2, 0.15, 0.35, 0.25, 0.3];
  const depthMultipliers = [-300, -200, -100, 0, 100, 200];
  const isMobileDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  function updateLayers(x, y) {
    layers.forEach((layer, index) => {
      const depth = depthMultipliers[index];
      let movementX = x * depth * movementMultipliers[index];
      if (isMobileDevice && index === 5) movementX *= 0.1;
      const movementY = (y * depth * movementMultipliers[index]) / 2.6;
      const rotationY = isMobileDevice ? 0 : x * 100 * movementMultipliers[index];
      const rotationX = isMobileDevice ? 0 : y * 100 * movementMultipliers[index];
      const scaleValue = index === 5 ? 'scale(1.3)' : '';
      layer.style.transform = `translateX(${movementX}px) translateY(${movementY}px) rotateY(${rotationY}deg) rotateX(${rotationX}deg) ${scaleValue}`;
      layer.style.filter = `invert(100%) grayscale(100%) contrast(1.5) brightness(${1 + Math.abs(x * movementMultipliers[index])})`;
    });
  }

  parallaxContainer.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) - 0.5;
    const y = (e.clientY / window.innerHeight) - 0.5;
    updateLayers(x, y);
  });

  parallaxContainer.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const x = (touch.clientX / window.innerWidth) - 0.5;
    const y = (touch.clientY / window.innerHeight) - 0.5;
    updateLayers(x, y);
  }, { passive: false });

  updateLayers(0, 0);
});
