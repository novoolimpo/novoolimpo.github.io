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
  
  // Arrastar o player
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  let xOffset = 0;
  let yOffset = 0;
  
  radioHeader.addEventListener('mousedown', dragStart);
  radioHeader.addEventListener('touchstart', dragStart, { passive: false });
  
  function dragStart(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "touchstart") {
      initialX = e.touches[0].clientX - xOffset;
      initialY = e.touches[0].clientY - yOffset;
    } else {
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;
    }
    
    if (e.target === radioToggle) return;
    
    isDragging = true;
    
    // Desativa scroll durante o arraste
    document.body.classList.add('no-scroll');
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchend', dragEnd);
  }
  
  function drag(e) {
    if (isDragging) {
      e.preventDefault();
      
      if (e.type === "touchmove") {
        currentX = e.touches[0].clientX - initialX;
        currentY = e.touches[0].clientY - initialY;
      } else {
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
      }
      
      xOffset = currentX;
      yOffset = currentY;
      
      setTranslate(currentX, currentY, radioPlayer);
    }
  }
  
  function dragEnd() {
    isDragging = false;
    
    // Reativa scroll após o arraste
    document.body.classList.remove('no-scroll');
    
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('touchmove', drag);
    document.removeEventListener('mouseup', dragEnd);
    document.removeEventListener('touchend', dragEnd);
  }
  
  function setTranslate(xPos, yPos, el) {
    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
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
