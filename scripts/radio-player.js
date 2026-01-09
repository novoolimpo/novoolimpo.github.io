// Player de Rádio Flutuante - Funcionalidades
class RadioPlayer {
  constructor() {
    this.player = document.getElementById('radio-player');
    this.header = document.getElementById('radio-header');
    this.toggleBtn = document.getElementById('radio-toggle');
    this.audio = document.getElementById('radio-audio');
    this.isDragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
    
    this.init();
  }
  
  init() {
    this.setupDragAndDrop();
    this.setupToggle();
    this.setupAudioEvents();
  }
  
  setupDragAndDrop() {
    this.header.addEventListener('mousedown', (e) => {
      this.startDrag(e);
    });
    
    this.header.addEventListener('touchstart', (e) => {
      this.startDrag(e.touches[0]);
    });
    
    document.addEventListener('mousemove', (e) => {
      this.drag(e);
    });
    
    document.addEventListener('touchmove', (e) => {
      this.drag(e.touches[0]);
    });
    
    document.addEventListener('mouseup', () => {
      this.stopDrag();
    });
    
    document.addEventListener('touchend', () => {
      this.stopDrag();
    });
  }
  
  startDrag(e) {
    this.isDragging = true;
    const rect = this.player.getBoundingClientRect();
    this.offsetX = e.clientX - rect.left;
    this.offsetY = e.clientY - rect.top;
    this.player.style.cursor = 'grabbing';
  }
  
  drag(e) {
    if (!this.isDragging) return;
    
    e.preventDefault();
    
    let x = e.clientX - this.offsetX;
    let y = e.clientY - this.offsetY;
    
    // Limitar à área da janela
    const maxX = window.innerWidth - this.player.offsetWidth;
    const maxY = window.innerHeight - this.player.offsetHeight;
    
    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));
    
    this.player.style.left = `${x}px`;
    this.player.style.top = `${y}px`;
  }
  
  stopDrag() {
    this.isDragging = false;
    this.player.style.cursor = '';
  }
  
  setupToggle() {
    this.toggleBtn.addEventListener('click', () => {
      this.player.classList.toggle('minimizado');
      this.toggleBtn.textContent = this.player.classList.contains('minimizado') ? '+' : '×';
    });
  }
  
  setupAudioEvents() {
    this.audio.addEventListener('play', () => {
      document.getElementById('radio-status').textContent = 'AO VIVO';
    });
    
    this.audio.addEventListener('pause', () => {
      document.getElementById('radio-status').textContent = 'PAUSADO';
    });
    
    this.audio.addEventListener('volumechange', () => {
      const volume = Math.round(this.audio.volume * 100);
      // Volume pode ser mostrado no futuro
    });
  }
}

// Ativador de Áudio Discreto
class DiscreetAudioActivator {
  constructor() {
    this.audio = document.getElementById('radio-audio');
    this.overlay = document.getElementById('audio-overlay');
    this.initialized = false;
    
    this.setupAudio();
    setTimeout(() => this.init(), 1500);
  }
  
  setupAudio() {
    this.audio.muted = true;
    this.audio.preload = 'auto';
    
    this.audio.play().catch(() => {
      // Erro silencioso no início
    });
  }
  
  init() {
    if (this.initialized) return;
    this.initialized = true;
    
    if (localStorage.getItem('mediaInteraction') === 'true') {
      this.activateMedia();
      return;
    }
    
    this.showOverlay();
    this.setupInteractionListeners();
  }
  
  showOverlay() {
    this.overlay.style.display = 'flex';
    
    const button = this.overlay.querySelector('.overlay-button');
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      this.activateMedia();
    });
    
    setTimeout(() => {
      if (this.overlay.style.display !== 'none') {
        this.activateMedia();
      }
    }, 8000);
  }
  
  setupInteractionListeners() {
    const activate = () => this.activateMedia();
    
    document.addEventListener('click', activate, { once: true });
    document.addEventListener('touchstart', activate, { once: true });
    document.addEventListener('keydown', activate, { once: true });
  }
  
  activateMedia() {
    if (this.overlay) {
      this.overlay.style.display = 'none';
    }
    
    localStorage.setItem('mediaInteraction', 'true');
    this.audio.muted = false;
    
    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        this.showSubtleIndicator();
      });
    }
  }
  
  showSubtleIndicator() {
    const status = document.getElementById('radio-status');
    if (!status) return;
    
    const originalText = status.textContent;
    const originalColor = status.style.color;
    
    status.textContent = 'PRONTO';
    status.style.color = '#aaa';
    
    setTimeout(() => {
      status.textContent = originalText;
      status.style.color = originalColor || '#ff4444';
    }, 2000);
  }
}

// Fallback Global de Ativação
let mediaActivated = false;
function globalActivation() {
  if (mediaActivated) return;
  mediaActivated = true;
  
  const audio = document.getElementById('radio-audio');
  const overlay = document.getElementById('audio-overlay');
  
  if (audio) {
    audio.muted = false;
    audio.play().catch(() => {});
  }
  
  if (overlay) {
    overlay.style.display = 'none';
  }
  
  localStorage.setItem('mediaInteraction', 'true');
}

// Inicialização Geral
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar player de rádio
  new RadioPlayer();
  
  // Inicializar ativador de áudio
  setTimeout(() => {
    new DiscreetAudioActivator();
  }, 1000);
  
  // Configurar fallbacks de interação
  ['click', 'touchstart', 'keydown', 'scroll', 'mousemove'].forEach(event => {
    document.addEventListener(event, globalActivation, { once: true });
  });
  
  // Monitorar troca de aba
  window.addEventListener('focus', () => {
    const audio = document.getElementById('radio-audio');
    if (audio && !audio.paused && audio.muted === false) {
      audio.play().catch(e => console.log('Refocus play failed:', e));
    }
  });
});

// Função auxiliar para atualizar status da rádio
function updateRadioStatus(text, color = '#ff4444') {
  const status = document.getElementById('radio-status');
  if (status) {
    status.textContent = text;
    status.style.color = color;
  }
}

// Função para mudar a fonte de áudio (se necessário no futuro)
function changeRadioStream(url) {
  const audio = document.getElementById('radio-audio');
  const source = audio.querySelector('source');
  
  if (source) {
    source.src = url;
    audio.load();
    updateRadioStatus('TROCANDO...', '#FF9800');
    
    audio.play().then(() => {
      updateRadioStatus('AO VIVO', '#ff4444');
    }).catch(e => {
      updateRadioStatus('ERRO', '#f44336');
      console.error('Erro ao trocar stream:', e);
    });
  }
}
