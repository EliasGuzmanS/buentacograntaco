/* El Comal del Norte - Motor de Sonidos Procedurales (Web Audio API) */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.sizzleSource = null;
    this.sizzleGain = null;
    this.isMuted = false;
  }

  init() {
    if (this.ctx) return;
    // Crear el contexto de audio en la primera interacción del usuario
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContextClass();
  }

  // Generador de Ruido Blanco para simular freír y cortar
  createNoiseBuffer() {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * 2; // 2 segundos de ruido
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  // Sonido de clic (botón)
  playClick() {
    this.init();
    if (this.isMuted || !this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  // Sonido de campana cuando llega un cliente
  playBell() {
    this.init();
    if (this.isMuted || !this.ctx) return;

    const now = this.ctx.currentTime;
    // Campana armónica usando dos osciladores
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // Re 5 (D5)
    
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880.00, now); // La 5 (A5)

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(now + 1.2);
    osc2.stop(now + 1.2);
  }

  // Sonido de picado (cuchillo)
  playCut() {
    this.init();
    if (this.isMuted || !this.ctx) return;

    const noiseBuffer = this.createNoiseBuffer();
    if (!noiseBuffer) return;

    const now = this.ctx.currentTime;
    const noiseNode = this.ctx.createBufferSource();
    noiseNode.buffer = noiseBuffer;

    // Filtro para hacerlo sonar metálico y sordo
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, now);
    filter.Q.setValueAtTime(3, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    noiseNode.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noiseNode.start(now);
    noiseNode.stop(now + 0.13);
  }

  // Iniciar sonido continuo de freír (Comal)
  startSizzle() {
    this.init();
    if (this.isMuted || !this.ctx) return;
    if (this.sizzleSource) return; // ya sonando

    const now = this.ctx.currentTime;
    const noiseBuffer = this.createNoiseBuffer();
    if (!noiseBuffer) return;

    this.sizzleSource = this.ctx.createBufferSource();
    this.sizzleSource.buffer = noiseBuffer;
    this.sizzleSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(4500, now);

    this.sizzleGain = this.ctx.createGain();
    this.sizzleGain.gain.setValueAtTime(0.01, now);
    // Transición suave de entrada
    this.sizzleGain.gain.linearRampToValueAtTime(0.12, now + 0.3);

    this.sizzleSource.connect(filter);
    filter.connect(this.sizzleGain);
    this.sizzleGain.connect(this.ctx.destination);

    this.sizzleSource.start(now);
  }

  // Detener sonido de freír
  stopSizzle() {
    if (!this.ctx || !this.sizzleSource) return;

    const now = this.ctx.currentTime;
    try {
      this.sizzleGain.gain.cancelScheduledValues(now);
      this.sizzleGain.gain.setValueAtTime(this.sizzleGain.gain.value, now);
      this.sizzleGain.gain.linearRampToValueAtTime(0.001, now + 0.15);
      
      const sourceToStop = this.sizzleSource;
      this.sizzleSource = null;
      this.sizzleGain = null;
      
      setTimeout(() => {
        try {
          sourceToStop.stop();
        } catch(e) {}
      }, 200);
    } catch(e) {
      this.sizzleSource = null;
      this.sizzleGain = null;
    }
  }

  // Éxito: Fanfarria corta alegre
  playSuccess() {
    this.init();
    if (this.isMuted || !this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      gain.gain.setValueAtTime(0.1, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.3);
    });
  }

  // Error: Zumbido apagado triste
  playFail() {
    this.init();
    if (this.isMuted || !this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(110, now + 0.4);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  }
}

// Exportar instancia única
const sound = new SoundEngine();
window.sound = sound;

class MusicEngine {
  constructor() {
    this.currentAudio = null;
  }

  playMusic(src, startTime = 8) {
    if (this.currentAudio && this.currentAudio.src.endsWith(encodeURI(src).replace(/#/g, '%23'))) {
        return;
    }

    const nextAudio = new Audio(src);
    nextAudio.loop = true;
    nextAudio.currentTime = startTime;
    nextAudio.volume = 0;
    
    const playPromise = nextAudio.play();
    if (playPromise !== undefined) {
      playPromise.catch(e => console.log('Audio autoplay prevented', e));
    }

    if (this.currentAudio) {
      const prevAudio = this.currentAudio;
      let vol = prevAudio.volume;
      const fadeOut = setInterval(() => {
        vol -= 0.1;
        if (vol <= 0) {
          vol = 0;
          clearInterval(fadeOut);
          prevAudio.pause();
          prevAudio.src = '';
        } else {
          prevAudio.volume = vol;
        }
      }, 100);
    }

    let nextVol = 0;
    const fadeIn = setInterval(() => {
      nextVol += 0.1;
      if (nextVol >= 1.0) {
        nextVol = 1.0;
        clearInterval(fadeIn);
      }
      nextAudio.volume = nextVol;
    }, 100);

    this.currentAudio = nextAudio;
  }
}
const music = new MusicEngine();
window.music = music;
