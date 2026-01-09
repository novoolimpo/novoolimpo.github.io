// Funções principais do site

// Botões de compra
document.addEventListener('DOMContentLoaded', function() {
  // Configurar botões de compra
  document.getElementById("comprar").onclick = 
  document.getElementById("comprarrodape").onclick = function() {
    window.open("https://jnowsk.gumroad.com/l/kbhaqrt", "_blank");
  };
  
  document.getElementById("comprar2").onclick = 
  document.getElementById("comprarrodape2").onclick = function() {
    window.open("https://pay.hotmart.com/O96435069N", "_blank");
  };

  // Controle manual
  const parallaxContainer = document.querySelector('.parallax-container');
  const titleContainer = document.querySelector('.titulo-subtitulo');
  
  if (parallaxContainer) {
    parallaxContainer.style.display = true ? 'block' : 'none';
  }
  
  if (titleContainer) {
    titleContainer.style.display = false ? 'block' : 'none';
  }
});
