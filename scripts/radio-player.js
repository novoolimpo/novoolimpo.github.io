// Player de Rádio Interativo
document.addEventListener('DOMContentLoaded', function() {
  const radioPlayer = document.getElementById('radio-player');
  const radioToggle = document.getElementById('radio-toggle');
  const radioHeader = document.getElementById('radio-header');
  const radioAudio = document.getElementById('radio-audio');
  const radioStatus = document.getElementById('radio-status');
  
  if (!radioPlayer) return;
  
  // Substitua pela URL real da sua rádio
  // radioAudio.src = "https://SUA_URL_DA_RADIO_AQUI/stream.mp3";
  
  // Alternar minimizar/expandir
  radioToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    radioPlayer.classList.toggle('minimizado');
    radioToggle.textContent = radioPlayer.classList.contains('minimizado') ? '+' : '×';
  });
  
  // Arrastar o player - RESPONSIVO E DIRETO
  let isDragging = false;
  let startX, startY, initialX, initialY;
  
  // Limites da tela
  const headerHeight = document.querySelector('nav').offsetHeight;
  const playerWidth = radioPlayer.offsetWidth;
  const playerHeight = radioPlayer.offsetHeight;
  
  radioHeader.addEventListener('mousedown', startDrag);
  radioHeader.addEventListener('touchstart', startDrag, { passive: false });
  
  function startDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    
    isDragging = true;
    
    // Posição inicial do mouse/toque
    if (e.type === "touchstart") {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    } else {
      startX = e.clientX;
      startY = e.clientY;
    }
    
    // Posição atual do player
    const rect = radioPlayer.getBoundingClientRect();
    initialX = rect.left;
    initialY = rect.top;
    
    // Desativa scroll durante o arraste
    document.body.classList.add('no-scroll');
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchend', stopDrag);
  }
  
  function drag(e) {
    if (!isDragging) return;
    
    e.preventDefault();
    
    let currentX, currentY;
    
    if (e.type === "touchmove") {
      currentX = e.touches[0].clientX;
      currentY = e.touches[0].clientY;
    } else {
      currentX = e.clientX;
      currentY = e.clientY;
    }
    
    // Calcula nova posição
    let newX = initialX + (currentX - startX);
    let newY = initialY + (currentY - startY);
    
    // Limites da tela
    const maxX = window.innerWidth - playerWidth;
    const maxY = window.innerHeight - playerHeight;
    const minY = headerHeight + 5; // 5px abaixo do menu
    
    // Aplica limites
    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(minY, Math.min(newY, maxY));
    
    // Move o player - DIRETO, SEM TRANSITION
    radioPlayer.style.transition = 'none';
    radioPlayer.style.left = newX + 'px';
    radioPlayer.style.top = newY + 'px';
    radioPlayer.style.transform = 'none'; // Remove transform antigo
  }
  
  function stopDrag() {
    isDragging = false;
    
    // Reativa scroll após o arraste
    document.body.classList.remove('no-scroll');
    
    // Restaura transition suave
    setTimeout(() => {
      radioPlayer.style.transition = 'all 0.1s ease';
    }, 10);
    
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('touchmove', drag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchend', stopDrag);
  }
  
  // Impede que o player saia dos limites ao redimensionar a janela
  window.addEventListener('resize', function() {
    const rect = radioPlayer.getBoundingClientRect();
    const headerHeight = document.querySelector('nav').offsetHeight;
    
    // Verifica limites
    if (rect.top < headerHeight + 5) {
      radioPlayer.style.top = (headerHeight + 5) + 'px';
    }
    
    if (rect.left < 0) {
      radioPlayer.style.left = '0px';
    }
    
    if (rect.right > window.innerWidth) {
      radioPlayer.style.left = (window.innerWidth - playerWidth) + 'px';
    }
    
    if (rect.bottom > window.innerHeight) {
      radioPlayer.style.top = (window.innerHeight - playerHeight) + 'px';
    }
  });
  
  // Atualizar status da rádio
  radioAudio.addEventListener('play', function() {
    radioStatus.textContent = '● AO VIVO';
    radioStatus.style.color = '#ff4444';
  });
  
  radioAudio.addEventListener('pause', function() {
    radioStatus.textContent = '■ PAUSADO';
    radioStatus.style.color = '#ffaa44';
  });
  
  radioAudio.addEventListener('error', function() {
    radioStatus.textContent = '✗ ERRO';
    radioStatus.style.color = '#999';
  });
});
