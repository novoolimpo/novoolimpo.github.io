// Player de Rádio Interativo
document.addEventListener('DOMContentLoaded', function() {
  const radioPlayer = document.getElementById('radio-player');
  const radioToggle = document.getElementById('radio-toggle');
  const radioHeader = document.getElementById('radio-header');
  const radioAudio = document.getElementById('radio-audio');
  const radioStatus = document.getElementById('radio-status');
  
  if (!radioPlayer) return;
  
  // Alternar minimizar/expandir
  radioToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    radioPlayer.classList.toggle('minimizado');
    radioToggle.textContent = radioPlayer.classList.contains('minimizado') ? '+' : '×';
  });
  
  // Arrastar o player - VERSÃO SIMPLES
  let isDragging = false;
  let startX, startY, initialX, initialY;
  
  const headerHeight = document.querySelector('nav').offsetHeight;
  const playerWidth = radioPlayer.offsetWidth;
  const playerHeight = radioPlayer.offsetHeight;
  
  radioHeader.addEventListener('mousedown', startDrag);
  radioHeader.addEventListener('touchstart', startDrag);
  
  function startDrag(e) {
    // SÓ ISSA: Permite scroll normal, não reseta nada
    if (e.type === "touchstart" && isDragging) {
      return; // Já está arrastando, não faz nada
    }
    
    e.preventDefault();
    e.stopPropagation();
    
    isDragging = true;
    
    if (e.type === "touchstart") {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    } else {
      startX = e.clientX;
      startY = e.clientY;
    }
    
    const rect = radioPlayer.getBoundingClientRect();
    initialX = rect.left;
    initialY = rect.top;
    
    // NÃO MEXE EM NADA DO BODY, NÃO ALTERA SCROLL
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchend', stopDrag);
  }
  
  function drag(e) {
    if (!isDragging) return;
    
    // MANTÉM: previne scroll DURANTE arraste mas não reseta
    e.preventDefault();
    
    let currentX, currentY;
    
    if (e.type === "touchmove") {
      currentX = e.touches[0].clientX;
      currentY = e.touches[0].clientY;
    } else {
      currentX = e.clientX;
      currentY = e.clientY;
    }
    
    let newX = initialX + (currentX - startX);
    let newY = initialY + (currentY - startY);
    
    const maxX = window.innerWidth - playerWidth;
    const maxY = window.innerHeight - playerHeight;
    const minY = headerHeight + 5;
    
    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(minY, Math.min(newY, maxY));
    
    radioPlayer.style.transition = 'none';
    radioPlayer.style.left = newX + 'px';
    radioPlayer.style.top = newY + 'px';
  }
  
  function stopDrag() {
    isDragging = false;
    
    // NÃO PRECISA RESTAURAR NADA
    
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('touchmove', drag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchend', stopDrag);
    
    setTimeout(() => {
      radioPlayer.style.transition = 'all 0.1s ease';
    }, 10);
  }
  
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
