/* El Comal del Norte - Lógica del Juego (game.js) */

// Base de Datos de Clientes y Recetas
const RECIPES = {
  ASADA_TACO: {
    id: 'asada_taco',
    name: 'Taco de Carne Asada',
    state: 'Sonora',
    tortilla: 'harina-chica',
    spread: 'guacamole',
    requiredToppings: ['asada', 'cebolla-cilantro'],
    forbiddenToppings: ['pescado', 'machaca', 'discada', 'repollo', 'rajas'],
    fold: 'taco',
    cut: false,
    price: 18.00
  },
  MACHACA_BURRITO: {
    id: 'machaca_burrito',
    name: 'Burrito de Machaca con Huevo',
    state: 'Chihuahua',
    tortilla: 'harina-grande',
    spread: null,
    requiredToppings: ['machaca', 'queso', 'rajas'],
    forbiddenToppings: ['asada', 'pescado', 'discada', 'repollo'],
    fold: 'burrito',
    cut: false,
    price: 22.00
  },
  DISCADA_BURRITO: {
    id: 'discada_burrito',
    name: 'Burrito de Discada Norteña',
    state: 'Coahuila & Durango',
    tortilla: 'harina-grande',
    spread: 'frijoles',
    requiredToppings: ['discada', 'queso'],
    forbiddenToppings: ['pescado', 'machaca', 'asada', 'repollo'],
    fold: 'burrito',
    cut: true, // Se pide cortado
    price: 25.00
  },
  PESCADO_TACO: {
    id: 'pescado_taco',
    name: 'Taco de Pescado Ensenada',
    state: 'Baja California',
    tortilla: 'maiz',
    spread: null,
    requiredToppings: ['pescado', 'repollo', 'salsa-verde', 'limon'],
    forbiddenToppings: ['asada', 'machaca', 'discada', 'queso', 'rajas'],
    fold: 'taco',
    cut: false,
    price: 16.00
  }
};

const CUSTOMERS = [
  {
    id: 'lauro',
    name: 'Lauro',
    state: 'Chihuahua 🏔️',
    dialog: '¡Qué tal chavalillo! Tráeme un burrito de machaca con huevo de volada, con sus rajas de chilaca y queso menonita derretido. Que la tortilla de harina grande esté bien doradita.',
    shortDialog: '¡Ajúa! Un burrito de machaca de volada, chavalillo.',
    recipeId: 'machaca_burrito',
    patience: 100,
    slang: {
      success: '¡Ajúa! De los mejores burritos que me he echado en el estado grande. Ten tu propina, chavalillo.',
      average: 'Pues no está mal, pariente, pero le faltó ese toque del queso menonita derretido.',
      fail: '¡Asuuu! Esto no es un burrito de machaca de verdad. ¡Me voy con las manos vacías!'
    }
  },
  {
    id: 'reyna',
    name: 'Reyna',
    state: 'Sonora 🌵',
    dialog: '¡Qué onda pariente! Se me antoja un taco de carne asada con su respectivo guacamole y cebolla con cilantro. Que la tortilla de harina chica quede bien doradita en el comal, ¿eh?',
    shortDialog: '¡Qué onda pariente! Se me antoja un taco de asada bien doradito.',
    recipeId: 'asada_taco',
    patience: 100,
    slang: {
      success: '¡Qué chilo! Te quedó al mero punto de sal y la tortilla bien tostada. ¡Fierro por la 300!',
      average: 'Está pasable, pero a la asada le faltó su buen guacamole o lo doblaste medio raro.',
      fail: '¿Qué es esto, pariente? Esto no califica como taco de asada sonorense. ¡Qué agüite!'
    }
  },
  {
    id: 'eulalio',
    name: 'Eulalio',
    state: 'Coahuila 🍳',
    dialog: '¡Asuuu, compadre! Qué calorón hace. Échame un burrito de discada norteña con frijoles refritos y queso derretido en tortilla grande de trigo. Y porfa me lo partes a la mitad.',
    shortDialog: '¡Asuuu compadre! Un burrito de discada bien caliente, partido a la mitad.',
    recipeId: 'discada_burrito',
    patience: 100,
    slang: {
      success: '¡Bárbaro, compadre! Qué buena discada, y bien partidito a la mitad como me gusta. ¡De diez!',
      average: 'La discada está sabrosa, pero se te olvidó cortarlo a la mitad o le faltó frijol.',
      fail: '¡Hombre! Esto no se parece en nada a la discada que hacemos en el disco de arado. No te pago esto.'
    }
  },
  {
    id: 'marina',
    name: 'Marina',
    state: 'Baja California 🌊',
    dialog: 'Hola mijo. Vengo con antojo de un taco de pescado capeado. Prepáralo en tortilla de maíz con su col picadita (repollo), salsa verde y limón. ¡Que quede bien chilo!',
    shortDialog: 'Hola mijo, un taco de pescado capeado estilo Ensenada.',
    recipeId: 'pescado_taco',
    patience: 100,
    slang: {
      success: '¡Ay mijo, qué delicia! Se siente el sabor del puerto de Ensenada en cada bocado. Muchas gracias.',
      average: 'Ay, le faltó el repollo o el limón al pescado capeado... así no sabe igual.',
      fail: '¿Un taco de pescado sin col ni limón, y en tortilla de harina? Eso no es de Baja, mijo.'
    }
  },
  {
    id: 'doroteo',
    name: 'Doroteo',
    state: 'Durango 🦂',
    dialog: '¡Buenas! Tráeme un burrito bien reportado de discada con frijoles y queso en tortilla de harina grande. Pero no me le pongas nada de verduras ni salsas, al natural y bien caliente.',
    shortDialog: '¡Buenas! Discada al natural, sin verduras ni salsas.',
    recipeId: 'discada_burrito',
    patience: 100,
    specialMods: {
      noVeg: true
    },
    slang: {
      success: '¡Ah Chihuahua! Perdón, ¡Ah Durango! Qué buen burrito de pura carne y queso. Calientito y llenador.',
      average: 'Le pusiste salsas o cebolla y yo te lo pedí al natural, pariente. Pero bueno, me lo como.',
      fail: 'Te pedí pura carne con queso y frijol en tortilla de trigo, y me das esto lleno de verduras. ¡Así no!'
    }
  },
  {
    id: 'gonzalo',
    name: 'Gonzalo',
    state: 'Coahuila 🍳',
    dialog: '¡Compadre! Échame el burrito de discada con frijoles y queso, pero sin ninguna verdura ni salsa. Nada más la carne y el queso, bien caliente.',
    shortDialog: '¡Compadre! Discada, pero sin ninguna verdura, ¿ya?',
    recipeId: 'discada_burrito',
    patience: 100,
    specialMods: { noVeg: true },
    slang: {
      success: '¡Así mero! Pura carne y queso sin tanta cosa. ¡Qué buena mano tienes, pariente!',
      average: 'Estuvo bien, pero le pusiste algo que no quería. Bueno, me lo como de todas formas.',
      fail: 'Te dije bien claro: sin verduras ni salsas. ¿Qué no escuchas, compa?'
    }
  },
  {
    id: 'esperanza',
    name: 'Esperanza',
    state: 'Sonora 🌵',
    dialog: '¡Buenas! Quiero mi taco de asada con guacamole y cebollita, pero de favor échale también su salsita roja. ¡Me gusta bien picosito, pariente!',
    shortDialog: '¡Buenas! Taco de asada con su salsita roja, bien picosito.',
    recipeId: 'asada_taco',
    patience: 100,
    specialMods: { requireExtra: ['salsa-roja'] },
    slang: {
      success: '¡Órale, así me gusta! Con su salsita roja picosita y todo. ¡Está de rechupete!',
      average: 'Le faltó algo, pariente. Pero el sabor de la asada ahí está.',
      fail: '¿Un taco de asada sin salsita roja? ¡Eso me lo hace hasta mi abuela!'
    }
  }
];

// Secuencia de clientes por día
const DAY_SCHEDULE = {
  1: ['lauro', 'reyna', 'eulalio'],
  2: ['marina', 'reyna', 'doroteo'],
  3: ['lauro', 'gonzalo', 'eulalio', 'esperanza'],
  4: ['reyna', 'doroteo', 'marina', 'esperanza'],
  5: ['lauro', 'gonzalo', 'eulalio', 'doroteo', 'esperanza'],
};

// Precios de Ingredientes (Costo de preparación)
const INGREDIENT_COSTS = {
  // Tortillas
  'harina-grande': 3.00,
  'harina-chica': 2.00,
  'maiz': 1.50,
  // Untables
  'frijoles': 1.00,
  'guacamole': 2.00,
  // Carnes
  'asada': 4.00,
  'discada': 4.50,
  'machaca': 3.50,
  'pescado': 3.50,
  // Verduras
  'queso': 2.00,
  'cebolla-cilantro': 1.00,
  'repollo': 1.00,
  'rajas': 1.50,
  // Salsas
  'salsa-roja': 0.50,
  'salsa-verde': 0.50,
  'limon': 0.50
};

// Estado Global del Juego
const state = {
  money: 100.00,
  day: 1,
  dayCosts: 0.00,
  daySales: 0.00,
  dayTips: 0.00,
  
  // Orden actual
  currentOrder: {
    tortilla: null, // 'harina-grande', 'harina-chica', 'maiz'
    spread: null, // 'frijoles', 'guacamole'
    toppings: [], // array de strings
    cooked: 0, // 0 a 100
    folded: null, // 'taco', 'burrito'
    cut: false
  },
  
  customerIndex: 0,
  currentCustomer: null,
  patienceInterval: null,
  cookingInterval: null,
  isCooking: false
};

// Inicialización de Eventos y DOM
document.addEventListener('DOMContentLoaded', () => {
  setupSplashEvents();
  setupKitchenEvents();
  setupModalEvents();
  setupSummaryEvents();
  setupFullscreen();
  setupMusicToggle();
  setupResizeHandler();
});

function getGameScale() {
  const container = document.getElementById('game-container');
  if (!container || !container.style.transform) return 1;
  const match = container.style.transform.match(/scale\(([^)]+)\)/);
  return match ? parseFloat(match[1]) : 1;
}

function setupResizeHandler() {
  function resize() {
    const container = document.getElementById('game-container');
    const wrapper = document.getElementById('game-wrapper');
    if (!container || !wrapper) return;
    
    // Dimensiones originales base
    const targetW = 1150;
    const targetH = 1000;
    
    // Dimensiones disponibles en la ventana (con margen)
    const windowW = window.innerWidth - 20;
    const windowH = window.innerHeight - 30;
    
    // Factor de escala (mantener proporción)
    const scaleW = windowW / targetW;
    const scaleH = windowH / targetH;
    let scale = Math.min(scaleW, scaleH);
    
    // Limitar crecimiento excesivo
    if (scale > 1.2) scale = 1.2;
    
    container.style.transform = `scale(${scale})`;
    container.style.transformOrigin = 'top left';
    
    // Ajustar el contenedor exterior para que no genere scrollbars innecesarios
    wrapper.style.width = `${targetW * scale}px`;
    wrapper.style.height = `${targetH * scale}px`;
  }
  
  window.addEventListener('resize', resize);
  resize(); // Aplicar de inmediato
}

function setupFullscreen() {
  const btnFullscreen = document.getElementById('btn-global-fullscreen');
  if (!btnFullscreen) return;

  btnFullscreen.addEventListener('click', () => {
    if (window.sound) window.sound.playClick();
    
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`Error al intentar modo pantalla completa: ${err.message}`);
      });
      btnFullscreen.innerText = '🗗 Salir Pantalla Completa';
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        btnFullscreen.innerText = '⛶ Pantalla Completa';
      }
    }
  });

  // Escuchar cambios de estado para actualizar el texto del botón por si se sale con ESC
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
      btnFullscreen.innerText = '⛶ Pantalla Completa';
    } else {
      btnFullscreen.innerText = '🗗 Salir Pantalla Completa';
    }
  });
}

function setupMusicToggle() {
  const btnMusic = document.getElementById('btn-global-music');
  if (!btnMusic) return;

  btnMusic.addEventListener('click', () => {
    if (window.sound && window.sound.ctx) window.sound.playClick();
    if (window.music) {
      const isMuted = window.music.toggleMusic();
      btnMusic.innerText = isMuted ? '🎵 Música: OFF' : '🎵 Música: ON';
    }
  });
}

// --- PANTALLA INICIO ---
function setupSplashEvents() {
  const playMenuMusic = () => {
    if (window.music && document.getElementById('screen-splash').classList.contains('active')) {
      window.music.playMusic('music/Menu inicio.mpeg', 8);
    }
    document.removeEventListener('click', playMenuMusic);
    document.removeEventListener('keydown', playMenuMusic);
    document.removeEventListener('touchstart', playMenuMusic);
  };
  document.addEventListener('click', playMenuMusic);
  document.addEventListener('keydown', playMenuMusic);
  document.addEventListener('touchstart', playMenuMusic);

  document.getElementById('btn-start-game').addEventListener('click', () => {
    if (window.sound) window.sound.playClick();
    state.money = 100.00;
    state.day = 1;
    startDay();
  });
  
  document.getElementById('btn-open-recetario-splash').addEventListener('click', () => {
    if (window.sound) window.sound.playClick();
    openRecetario();
  });
}

// --- RECETARIO ---
function setupModalEvents() {
  const modal = document.getElementById('modal-recetario');
  const btnClose = document.getElementById('btn-close-recetario');
  
  btnClose.addEventListener('click', () => {
    if (window.sound) window.sound.playClick();
    modal.classList.remove('active');
  });

  document.getElementById('btn-open-recetario-game').addEventListener('click', () => {
    if (window.sound) window.sound.playClick();
    openRecetario();
  });

  // Cerrar haciendo clic afuera
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}

function openRecetario() {
  document.getElementById('modal-recetario').classList.add('active');
}

// --- INICIAR JORNADA (DÍA) ---
function startDay() {
  state.dayCosts = 0.00;
  state.daySales = 0.00;
  state.dayTips = 0.00;
  state.customerIndex = 0;
  
  updateHUD();
  
  // Ocultar Splash y mostrar Juego
  document.getElementById('screen-splash').classList.remove('active');
  document.getElementById('screen-summary').classList.remove('active');
  document.getElementById('screen-game').classList.add('active');
  
  loadCustomer();
}

// --- CARGAR CLIENTE ---
function loadCustomer() {
  const maxDay = Math.max(...Object.keys(DAY_SCHEDULE).map(Number));
  const dayKey = Math.min(state.day, maxDay);
  const dayCustomers = DAY_SCHEDULE[dayKey];

  if (state.customerIndex >= dayCustomers.length) {
    endDay();
    return;
  }

  const customerId = dayCustomers[state.customerIndex];
  state.currentCustomer = JSON.parse(JSON.stringify(CUSTOMERS.find(c => c.id === customerId)));
  resetKitchenState();
  
  if (window.music) {
    let song = 'music/Menu inicio.mpeg';
    if (customerId === 'lauro') song = 'music/El palomito 8 bits.mp3.mpeg';
    else if (customerId === 'reyna') song = 'music/La Chona-El Tucanazo (Cumbia en 8bits).mp3.mpeg';
    else if (customerId === 'eulalio') song = 'music/La Vaca - Mala Fe (Cumbia en 8bits).mp3.mpeg';
    else if (customerId === 'marina') song = 'music/Se Me Perdió La Cadenita - Sonora Dinamita (Cumbia en 8bits).mp3.mpeg';
    else if (customerId === 'doroteo') song = 'music/Sergio El Bailador - Bronco (Cumbia en 8bits).mp3.mpeg';
    else if (customerId === 'gonzalo') song = 'music/El palomito 8 bits.mp3.mpeg';
    else if (customerId === 'esperanza') song = 'music/La Chona-El Tucanazo (Cumbia en 8bits).mp3.mpeg';
    window.music.playMusic(song, 8);
  }

  // Actualizar UI del cliente
  document.getElementById('customer-state-origin').innerText = `${state.currentCustomer.name} — ${state.currentCustomer.state}`;
  document.getElementById('customer-dialog').innerText = `"${state.currentCustomer.shortDialog || state.currentCustomer.dialog}"`;
  
  // Dibujar Avatar Cowboy
  const avatarBox = document.getElementById('customer-avatar');
  avatarBox.innerHTML = generateAvatarHTML(state.currentCustomer);
  avatarBox.classList.add('talking');
  setTimeout(() => avatarBox.classList.remove('talking'), 2500);
  
  // Sonido de Campana de Cliente
  if (window.sound) window.sound.playBell();
  
  // Rellenar Ticket de Cocina
  updateKitchenTicket(state.currentCustomer);
  
  // Iniciar Paciencia (Pérdida de paciencia lenta)
  state.currentCustomer.patience = 100;
  updatePatienceBar();
  
  if (state.patienceInterval) clearInterval(state.patienceInterval);
  state.patienceInterval = setInterval(() => {
    state.currentCustomer.patience -= 1.3; // dura aprox 65 segundos
    updatePatienceBar();
    
    if (state.currentCustomer.patience <= 0) {
      clearInterval(state.patienceInterval);
      serveOrder(true); // Se va enfadado por tiempo
    }
  }, 1000);
}

function updatePatienceBar() {
  const bar = document.getElementById('patience-bar');
  if (!bar) return;
  bar.style.width = `${state.currentCustomer.patience}%`;
  
  // Mostrar porcentaje en texto
  const pctLabel = document.getElementById('patience-pct');
  if (pctLabel) {
    pctLabel.innerText = `${Math.max(0, Math.round(state.currentCustomer.patience))}%`;
  }
}

// --- RENDERIZADO DE AVATAR (PIXEL ART) ---
function generateAvatarHTML(customer) {
  let imgSrc = '';
  if (customer.id === 'lauro') imgSrc = 'sprite_lauro_1779540205099.png';
  else if (customer.id === 'reyna') imgSrc = 'sprite_reyna_1779540216958.png';
  else if (customer.id === 'eulalio') imgSrc = 'sprite_eulalio_1779540229073.png';
  else if (customer.id === 'marina') imgSrc = 'sprite_marina_1779540240532.png';
  else if (customer.id === 'doroteo') imgSrc = 'sprite_doroteo_1779540252507.png';

  return `
    <div class="pixel-avatar-wrapper" style="width: 130px; height: 130px; border-radius: 6px; overflow: hidden; background-color: #f4e8c1; border: 6px solid #8d6e63; box-shadow: inset 0 0 0 3px #d89b53, 0 4px 10px rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: flex-start; margin-bottom: 0;">
      <img src="${imgSrc}" alt="${customer.name}" style="width: 100%; height: 100%; object-fit: cover; object-position: top center; transform-origin: top center; transform: scale(2.2) translateY(5%); mix-blend-mode: multiply;" class="pixel-sprite">
    </div>
  `;
}

// --- RESETEAR COCINA PARA NUEVA ORDEN ---
function resetKitchenState() {
  state.currentOrder = {
    tortilla: null,
    spread: null,
    toppings: [],
    cooked: 0,
    folded: null,
    cut: false
  };
  
  // Limpiar lienzo
  const tortillaDisc = document.getElementById('visual-tortilla');
  tortillaDisc.className = 'tortilla-disc';
  tortillaDisc.style.filter = 'none'; // Resetear efecto de quemado
  
  const spreadLayer = document.getElementById('visual-spread');
  spreadLayer.className = 'spread-layer';
  spreadLayer.style.width = '0px';
  spreadLayer.style.height = '0px';
  
  document.getElementById('visual-toppings').innerHTML = '';
  document.getElementById('visual-folded').innerHTML = '';
  document.getElementById('visual-folded').style.display = 'none';
  
  const canvas = document.getElementById('tortilla-canvas');
  canvas.className = 'tortilla-empty';
  canvas.style.transform = 'scale(1)';
  canvas.classList.remove('serve-slide-up');
  canvas.style.opacity = '1';
  document.querySelector('.canvas-wrapper-game').appendChild(canvas);
  
  // Restaurar opacidades de capas por si estaban dobladas
  document.getElementById('visual-tortilla').style.opacity = '1';
  document.getElementById('visual-spread').style.opacity = '1';
  document.getElementById('visual-toppings').style.opacity = '1';
  document.getElementById('visual-spread').style.width = '0px';
  document.getElementById('visual-spread').style.height = '0px';
  
  // Comal
  document.getElementById('comal-item').className = 'hidden';
  document.getElementById('comal-item').innerText = '';
  document.getElementById('cook-progress').style.width = '0%';
  document.getElementById('cook-status-text').innerText = 'Crudo';
  
  // Limpiar checkmarks del ticket
  document.querySelectorAll('.oi-item.done').forEach(el => el.classList.remove('done'));

  // Habilitar / Deshabilitar Botones
  toggleIngredientButtons(false);
  updateKitchenButtonsState();
}

function toggleIngredientButtons(enabled) {
  const buttons = document.querySelectorAll('.ingredient-btn');
  buttons.forEach(btn => {
    btn.disabled = !enabled;
  });
  
  document.getElementById('btn-fold-taco').disabled = !enabled;
  document.getElementById('btn-fold-burrito').disabled = !enabled;
}

function updateKitchenButtonsState() {
  // Solo se habilitan acciones de terminado cuando está doblado
  const isFolded = state.currentOrder.folded !== null;
  document.getElementById('btn-cut-half').disabled = !isFolded || state.currentOrder.cut;
  
  // Siempre permitimos intentar servir si hay tortilla en la mesa, para poder rechazar si no está doblado
  document.getElementById('btn-deliver').disabled = !state.currentOrder.tortilla;
  
  // El botón del comal solo debe estar activo si hay tortilla Y NO está doblada
  document.getElementById('btn-cook').disabled = !state.currentOrder.tortilla || isFolded;
  
  // Si ya está doblado, deshabilitar comal y toppings para evitar cambios
  if (isFolded) {
    toggleIngredientButtons(false);
    // Pero dejamos tirar a la basura activado
  }
}

// --- ACTUALIZAR LISTA DE ORDEN (CHECKLIST PIZZERÍA) ---
const OI_EMOJI = {
  'harina-grande': '🫓', 'harina-chica': '🫓', 'maiz': '🌽',
  'frijoles': '🫘', 'guacamole': '🥑',
  'asada': '🥩', 'discada': '🍳', 'machaca': '🥚', 'pescado': '🐟',
  'queso': '🧀', 'cebolla-cilantro': '🌿', 'repollo': '🥬',
  'rajas': '🌶️', 'salsa-roja': '🔴', 'salsa-verde': '🟢', 'limon': '🍋',
};
const OI_COLOR = {
  'harina-grande': '#eae1d4', 'harina-chica': '#ddd0c0', 'maiz': '#f4d03f',
  'frijoles': '#5c3a21', 'guacamole': '#7cb342',
  'asada': '#8d5524', 'discada': '#7f2d21', 'machaca': '#c89b30', 'pescado': '#f0c040',
  'queso': '#e8e070', 'cebolla-cilantro': '#27ae60', 'repollo': '#9ecf8a',
  'rajas': '#1b8a5e', 'salsa-roja': '#e74c3c', 'salsa-verde': '#2ecc71', 'limon': '#f1c40f',
};
const OI_LABEL = {
  'harina-grande': 'Harina G.', 'harina-chica': 'Harina Ch.', 'maiz': 'Maíz',
  'frijoles': 'Frijoles', 'guacamole': 'Guacamole',
  'asada': 'Asada', 'discada': 'Discada', 'machaca': 'Machaca', 'pescado': 'Pescado',
  'queso': 'Queso', 'cebolla-cilantro': 'Cebolla/Cil.', 'repollo': 'Repollo',
  'rajas': 'Rajas', 'salsa-roja': 'S. Roja', 'salsa-verde': 'S. Verde', 'limon': 'Limón',
};

function updateKitchenTicket(customer) {
  const checklistDiv = document.getElementById('order-checklist');
  const ticketList = document.getElementById('ticket-list');

  if (!customer) {
    checklistDiv.classList.add('hidden');
    return;
  }

  const recipe = Object.values(RECIPES).find(r => r.id === customer.recipeId);
  if (!recipe) return;

  document.getElementById('checklist-num').innerText = state.customerIndex + 1;
  ticketList.innerHTML = '';

  const addItem = (id, key, extraClass) => {
    const li = document.createElement('li');
    li.className = 'oi-item' + (extraClass ? ' ' + extraClass : '');
    li.id = id;
    li.innerHTML =
      `<span class="oi-dot" style="background:${OI_COLOR[key] || '#888'}"></span>` +
      `<span class="oi-emoji">${OI_EMOJI[key] || '•'}</span>` +
      `<span class="oi-label">${OI_LABEL[key] || key}</span>` +
      `<span class="oi-check">✓</span>`;
    ticketList.appendChild(li);
  };

  // Tortilla
  addItem('oi-tortilla', recipe.tortilla);

  // Base/untable
  if (recipe.spread) {
    addItem('oi-spread', recipe.spread);
  }

  // Toppings requeridos (uno por fila)
  recipe.requiredToppings.forEach(top => addItem('oi-' + top, top));

  // Doblez
  const foldLi = document.createElement('li');
  foldLi.className = 'oi-item oi-action-item';
  foldLi.id = 'oi-fold';
  const foldEmoji = recipe.fold === 'taco' ? '🌮' : '🌯';
  const foldLabel = recipe.fold === 'taco' ? 'Doblar: Taco' : 'Doblar: Burrito';
  foldLi.innerHTML =
    `<span class="oi-dot" style="background:#f39c12"></span>` +
    `<span class="oi-emoji">${foldEmoji}</span>` +
    `<span class="oi-label">${foldLabel}</span>` +
    `<span class="oi-check">✓</span>`;
  ticketList.appendChild(foldLi);

  // Corte
  if (recipe.cut) {
    const cutLi = document.createElement('li');
    cutLi.className = 'oi-item oi-action-item';
    cutLi.id = 'oi-cut';
    cutLi.innerHTML =
      `<span class="oi-dot" style="background:#95a5a6"></span>` +
      `<span class="oi-emoji">🔪</span>` +
      `<span class="oi-label">Cortar mitad</span>` +
      `<span class="oi-check">✓</span>`;
    ticketList.appendChild(cutLi);
  }

  // Nota: sin verduras
  if (customer.specialMods && customer.specialMods.noVeg) {
    const modLi = document.createElement('li');
    modLi.className = 'oi-item oi-noveg full-width';
    modLi.innerHTML = `<span class="oi-emoji">🚫</span><span class="oi-label">¡SIN VERDURAS ni salsas!</span>`;
    ticketList.appendChild(modLi);
  }

  // Extras requeridos
  if (customer.specialMods && customer.specialMods.requireExtra) {
    customer.specialMods.requireExtra.forEach(extra => {
      const extraLi = document.createElement('li');
      extraLi.className = 'oi-item oi-extra-item full-width';
      extraLi.id = 'oi-extra-' + extra;
      extraLi.innerHTML =
        `<span class="oi-dot" style="background:${OI_COLOR[extra] || '#f39c12'}"></span>` +
        `<span class="oi-emoji">➕${OI_EMOJI[extra] || ''}</span>` +
        `<span class="oi-label">${OI_LABEL[extra] || extra} (extra)</span>` +
        `<span class="oi-check">✓</span>`;
      ticketList.appendChild(extraLi);
    });
  }

  checklistDiv.classList.remove('hidden');
}

function checkOffTicketItem(id) {
  const el = document.getElementById(id);
  if (el && !el.classList.contains('done')) el.classList.add('done');
}

// --- ACTUALIZAR BOTONES (LÓGICA MEJORADA) ---
function setupKitchenEvents() {
  // 1. Selección de Tortilla
  const tortillaButtons = document.querySelectorAll('[data-action="tortilla"]');
  tortillaButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (state.currentOrder.tortilla) return; // Ya eligió tortilla
      if (window.sound) window.sound.playClick();
      
      const type = btn.getAttribute('data-type');
      state.currentOrder.tortilla = type;
      
      // Cobrar costo de tortilla inmediatamente
      const cost = INGREDIENT_COSTS[type];
      state.money -= cost;
      state.dayCosts += cost;
      updateHUD();
      
      // UI
      document.getElementById('tortilla-canvas').classList.remove('tortilla-empty');
      const visualDisc = document.getElementById('visual-tortilla');
      visualDisc.classList.add(`tortilla-${type}`);

      checkOffTicketItem('oi-tortilla');

      // Habilitar ingredientes
      toggleIngredientButtons(true);
      
      // Marcar botón activo
      btn.classList.add('active');
      setTimeout(() => btn.classList.remove('active'), 300);
    });
  });

  // 2. Selección de Untables
  const spreadButtons = document.querySelectorAll('[data-action="spread"]');
  spreadButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (!state.currentOrder.tortilla || state.currentOrder.folded) return;
      if (window.sound) window.sound.playClick();
      
      const type = btn.getAttribute('data-type');
      state.currentOrder.spread = type;
      
      // Cobrar ingrediente
      const cost = INGREDIENT_COSTS[type];
      state.money -= cost;
      state.dayCosts += cost;
      updateHUD();
      
      checkOffTicketItem('oi-spread');

      // Renderizar untable cubriendo la tortilla
      const spreadLayer = document.getElementById('visual-spread');
      spreadLayer.className = `spread-layer spread-${type}`;
      
      const size = state.currentOrder.tortilla === 'harina-grande' ? 165 : (state.currentOrder.tortilla === 'harina-chica' ? 115 : 105);
      spreadLayer.style.width = `${size}px`;
      spreadLayer.style.height = `${size}px`;
      
      btn.classList.add('active');
      setTimeout(() => btn.classList.remove('active'), 300);
    });
  });

  // 3. Colocar Toppings (Arrastrar y Soltar con Pointer Events)
  const toppingButtons = document.querySelectorAll('[data-action="topping"]');
  let activeDragItem = null;
  let dragType = null;

  toppingButtons.forEach(btn => {
    btn.style.cursor = 'grab';
    btn.style.touchAction = 'none'; // Importante para móviles

    btn.addEventListener('pointerdown', (e) => {
      if (!state.currentOrder.tortilla || state.currentOrder.folded || state.isCooking) {
        return;
      }
      if (window.sound) window.sound.playClick();
      
      dragType = btn.getAttribute('data-type');
      
      activeDragItem = document.createElement('div');
      activeDragItem.className = `visual-chunk t-${dragType}`;
      activeDragItem.style.position = 'fixed';
      activeDragItem.style.zIndex = '9999';
      activeDragItem.style.pointerEvents = 'none';
      activeDragItem.style.left = `${e.clientX}px`;
      activeDragItem.style.top = `${e.clientY}px`;

      // Hacer que el ingrediente arrastrado también se vea del tamaño de la tortilla
      const t = state.currentOrder.tortilla;
      const dynSize = t === 'harina-grande' ? 160 : (t === 'harina-chica' ? 115 : 105);
      activeDragItem.style.width = `${dynSize}px`;
      activeDragItem.style.height = `${dynSize}px`;

      const currentScale = getGameScale();
      if (currentScale !== 1) {
        activeDragItem.style.transform = `translate(-50%, -50%) scale(${currentScale})`;
      } else {
        activeDragItem.style.transform = `translate(-50%, -50%)`;
      }
      document.body.appendChild(activeDragItem);
      
      btn.setPointerCapture(e.pointerId);
    });

    btn.addEventListener('pointermove', (e) => {
      if (activeDragItem) {
        activeDragItem.style.left = `${e.clientX}px`;
        activeDragItem.style.top = `${e.clientY}px`;
      }
    });

    btn.addEventListener('pointerup', (e) => {
      if (!activeDragItem) return;
      
      btn.releasePointerCapture(e.pointerId);
      document.body.removeChild(activeDragItem);
      activeDragItem = null;
      
      const canvas = document.getElementById('tortilla-canvas');
      const rect = canvas.getBoundingClientRect();
      
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const offsetX = mouseX - centerX;
      const offsetY = mouseY - centerY;
      
      const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
      
      const scale = getGameScale();
      let radius = 75 * scale; 
      if (state.currentOrder.tortilla === 'harina-chica') radius = 55 * scale;
      else if (state.currentOrder.tortilla === 'maiz') radius = 50 * scale;
      
      if (distance <= radius && !state.isCooking) {
        state.currentOrder.toppings.push(dragType);
        const cost = INGREDIENT_COSTS[dragType] / 3;
        state.money -= cost;
        state.dayCosts += cost;
        updateHUD();

        // Marcar en el ticket si es un ingrediente requerido o extra pedido
        const _cust = state.currentCustomer;
        const _rec = Object.values(RECIPES).find(r => r.id === _cust.recipeId);
        if (_rec && _rec.requiredToppings.includes(dragType)) {
          checkOffTicketItem('oi-' + dragType);
        }
        if (_cust.specialMods && _cust.specialMods.requireExtra &&
            _cust.specialMods.requireExtra.includes(dragType)) {
          checkOffTicketItem('oi-extra-' + dragType);
        }

        // Pasamos el offset sin escala para que al renderizarse en el canvas se vea bien
        spawnSingleTopping(dragType, offsetX / scale, offsetY / scale);
      }
      dragType = null;
    });

    btn.addEventListener('pointercancel', (e) => {
      if (activeDragItem) {
        document.body.removeChild(activeDragItem);
        activeDragItem = null;
        dragType = null;
      }
    });
  });

  // 4. Basura (Tirar preparación)
  document.getElementById('btn-trash').addEventListener('click', () => {
    if (!state.currentOrder.tortilla) return;
    if (window.sound) window.sound.playClick();
    if (state.isCooking) stopCooking();
    resetKitchenState();
  });

  // 5. El Comal (Cocción)
  const btnCook = document.getElementById('btn-cook');
  btnCook.addEventListener('click', () => {
    if (!state.currentOrder.tortilla || state.currentOrder.folded) return;
    
    if (!state.isCooking) {
      // Iniciar cocción
      startCooking();
    } else {
      // Detener cocción
      stopCooking();
    }
  });

  // 6. Doblado (Terminado)
  document.getElementById('btn-fold-taco').addEventListener('click', () => {
    foldMeal('taco');
  });
  document.getElementById('btn-fold-burrito').addEventListener('click', () => {
    foldMeal('burrito');
  });

  // 7. Corte
  document.getElementById('btn-cut-half').addEventListener('click', () => {
    cutMeal();
  });

  // 8. Servir / Entregar Orden
  document.getElementById('btn-deliver').addEventListener('click', () => {
    serveOrder(false);
  });

  // 9. Drag and Drop de la Tortilla al Comal (Pointer Events)
  const canvas = document.getElementById('tortilla-canvas');
  canvas.style.cursor = 'grab';
  canvas.style.touchAction = 'none';

  let isDraggingCanvas = false;
  let canvasClone = null;

  canvas.addEventListener('pointerdown', (e) => {
    // Bloqueamos arrastre si ya está doblada (no se puede regresar al comal)
    if (!state.currentOrder.tortilla || state.currentOrder.folded) return;
    
    isDraggingCanvas = true;
    
    // Crear clon visual idéntico de toda la tortilla (con toppings) en lugar de un cuadro
    canvasClone = canvas.cloneNode(true);
    canvasClone.id = 'canvas-drag-clone';
    canvasClone.style.position = 'fixed';
    canvasClone.style.zIndex = '9999';
    canvasClone.style.pointerEvents = 'none';
    canvasClone.style.margin = '0'; // Quitar posibles márgenes flex
    
    canvasClone.style.left = `${e.clientX}px`;
    canvasClone.style.top = `${e.clientY}px`;
    const cScale = getGameScale();
    canvasClone.style.transform = `translate(-50%, -50%) scale(${cScale})`;
    document.body.appendChild(canvasClone);
    
    canvas.setPointerCapture(e.pointerId);
  });

  canvas.addEventListener('pointermove', (e) => {
    if (isDraggingCanvas && canvasClone) {
      canvasClone.style.left = `${e.clientX}px`;
      canvasClone.style.top = `${e.clientY}px`;
    }
  });

  canvas.addEventListener('pointerup', (e) => {
    if (!isDraggingCanvas) return;
    isDraggingCanvas = false;
    canvas.releasePointerCapture(e.pointerId);
    
    if (canvasClone) {
      document.body.removeChild(canvasClone);
      canvasClone = null;
    }
    
    const elemBelow = document.elementFromPoint(e.clientX, e.clientY);
    if (!elemBelow) return;
    
    const droppedOnComal = elemBelow.closest('.comal-zone-game');
    const droppedOnPrep = elemBelow.closest('.cutting-board-zone');

    if (droppedOnComal && !state.isCooking) {
      document.getElementById('comal-skillet-area').appendChild(canvas);
      startCooking();
    } else if (droppedOnPrep && state.isCooking) {
      document.querySelector('.canvas-wrapper-game').appendChild(canvas);
      stopCooking();
    }
  });

  canvas.addEventListener('pointercancel', (e) => {
    if (isDraggingCanvas) {
      isDraggingCanvas = false;
      if (canvasClone) {
        document.body.removeChild(canvasClone);
        canvasClone = null;
      }
    }
  });
}

// --- RENDERIZAR INGREDIENTES EN TORTILLA ---
function spawnSingleTopping(type, offsetX, offsetY) {
  const container = document.getElementById('visual-toppings');
  if (!container) return;
  
  const chunk = document.createElement('div');
  chunk.className = `visual-chunk t-${type}`;
  
  // Centrado automático, ignorando la posición del cursor (offsetX, offsetY)
  chunk.style.left = '50%';
  chunk.style.top = '50%';
  
  // Tamaño dinámico para llegar casi al borde de la tortilla elegida
  const t = state.currentOrder.tortilla;
  const dynSize = t === 'harina-grande' ? 160 : (t === 'harina-chica' ? 115 : 105);
  chunk.style.width = `${dynSize}px`;
  chunk.style.height = `${dynSize}px`;
  
  // Bajar la transparencia de las capas de ingredientes anteriores
  const existingChunks = container.querySelectorAll('.visual-chunk');
  existingChunks.forEach(c => {
    let currentOpacity = parseFloat(c.style.getPropertyValue('--final-opacity') || c.style.opacity || "1");
    let newOpacity = Math.max(0.25, currentOpacity - 0.15); // baja 15% por cada ingrediente nuevo
    c.style.setProperty('--final-opacity', newOpacity.toString());
    c.style.opacity = newOpacity.toString();
  });
  
  // El ingrediente nuevo se ve al 100% de opacidad
  chunk.style.setProperty('--final-opacity', "1");
  chunk.style.opacity = "1";
  
  chunk.style.setProperty('--rot', `${Math.random() * 360}deg`);
  
  container.appendChild(chunk);
}

function spawnToppingVisuals(type) {
  // Esta función ya no se usa para rellenar, se deja vacía o por si se ocupa en un autollenado futuro
}

// --- DETALLES DE COCCIÓN (COMAL) ---
function startCooking() {
  state.isCooking = true;
  const btnCook = document.getElementById('btn-cook');
  btnCook.innerText = '🛑 Retirar del Comal';
  btnCook.style.background = '#e74c3c';
  
  // Efecto de sonido
  if (window.sound) window.sound.startSizzle();
  
  // Mover físicamente el canvas al contenedor del comal para asegurar que se vea ahí
  const canvas = document.getElementById('tortilla-canvas');
  document.getElementById('comal-skillet-area').appendChild(canvas);
  
  // Mover visualmente al comal (Animación de escala al Lienzo)
  canvas.style.transform = 'scale(0.55)';
  canvas.style.borderColor = '#ff7675';
  
  // Timer de cocinado
  state.cookingInterval = setInterval(() => {
    state.currentOrder.cooked += 1.5;
    if (state.currentOrder.cooked > 100) state.currentOrder.cooked = 100;
    
    updateCookingProgress();
    spawnSmokeParticle();
    
    // Cambiar color de la tortilla dinámicamente en tiempo real
    const visualDisc = document.getElementById('visual-tortilla');
    if (state.currentOrder.cooked >= 90) {
      visualDisc.style.filter = 'brightness(0.3) contrast(1.5)';
    } else if (state.currentOrder.cooked >= 55) {
      visualDisc.style.filter = 'sepia(0.4) saturate(1.2) brightness(0.8)';
    } else if (state.currentOrder.cooked >= 20) {
      visualDisc.style.filter = 'sepia(0.2) brightness(0.9)';
    }
  }, 100);
}

function stopCooking() {
  state.isCooking = false;
  const btnCook = document.getElementById('btn-cook');
  btnCook.innerText = '🔥 Poner en Comal';
  btnCook.style.background = 'var(--terracotta)';
  
  if (window.sound) window.sound.stopSizzle();
  
  clearInterval(state.cookingInterval);
  
  // Mover físicamente de regreso a la tabla de armado
  const canvas = document.getElementById('tortilla-canvas');
  document.querySelector('.canvas-wrapper-game').appendChild(canvas);
  
  canvas.style.transform = 'scale(1)';
  canvas.style.borderColor = '#eae1d4';
  
  // Ocultar comal item (Ya no se usa, pero por seguridad)
  document.getElementById('comal-item').classList.add('hidden');
  
  // Modificar color de la tortilla sutilmente según cocción
  const visualDisc = document.getElementById('visual-tortilla');
  if (state.currentOrder.cooked >= 90) {
    visualDisc.style.filter = 'brightness(0.3) contrast(1.5)';
  } else if (state.currentOrder.cooked >= 55) {
    visualDisc.style.filter = 'sepia(0.4) saturate(1.2) brightness(0.8)';
  } else if (state.currentOrder.cooked >= 20) {
    visualDisc.style.filter = 'sepia(0.2) brightness(0.9)';
  }
}

function updateCookingProgress() {
  const progress = state.currentOrder.cooked;
  document.getElementById('cook-progress').style.width = `${progress}%`;
  
  const statusLabel = document.getElementById('cook-status-text');
  
  if (progress < 20) {
    statusLabel.innerText = 'Crudo';
    statusLabel.style.color = '#bdc3c7';
  } else if (progress < 55) {
    statusLabel.innerText = 'Tibio';
    statusLabel.style.color = '#f1c40f';
  } else if (progress < 85) {
    statusLabel.innerText = '¡Al Punto! 😋';
    statusLabel.style.color = '#2ecc71';
  } else if (progress < 95) {
    statusLabel.innerText = 'Tostadito';
    statusLabel.style.color = '#e67e22';
  } else {
    statusLabel.innerText = '¡Quemado! 💀';
    statusLabel.style.color = '#e74c3c';
  }
}

function spawnSmokeParticle() {
  const container = document.getElementById('smoke-container');
  if (!container) return;
  
  const particle = document.createElement('div');
  particle.className = 'smoke-cloud';
  
  const size = Math.random() * 20 + 10;
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.left = `${Math.random() * 70 + 15}%`;
  particle.style.bottom = '20%';
  
  container.appendChild(particle);
  
  setTimeout(() => {
    particle.remove();
  }, 1200);
}

// --- DOBLAR ALIMENTOS ---
function foldMeal(style) {
  if (!state.currentOrder.tortilla || state.currentOrder.folded) return;
  if (window.sound) window.sound.playClick();
  
  // Parar comal si estaba cocinando
  if (state.isCooking) stopCooking();
  
  state.currentOrder.folded = style;
  checkOffTicketItem('oi-fold');

  // Renderizar doblez ocultando ingredientes sueltos y mostrando la forma final
  const visualToppings = document.getElementById('visual-toppings');
  const visualSpread = document.getElementById('visual-spread');
  const visualDisc = document.getElementById('visual-tortilla');
  
  visualToppings.style.opacity = '0';
  visualSpread.style.opacity = '0';
  visualDisc.style.opacity = '0';
  
  const foldedContainer = document.getElementById('visual-folded');
  foldedContainer.style.display = 'flex';
  foldedContainer.innerHTML = '';
  
  const shape = document.createElement('div');
  if (style === 'taco') {
    shape.className = 'folded-taco-shape';
    // Heredar el color de la tortilla
    if (state.currentOrder.tortilla === 'maiz') {
      shape.style.backgroundColor = 'var(--tortilla-maiz)';
      shape.style.backgroundImage = "url('tex_tortilla_maiz.png')";
      shape.style.backgroundSize = 'cover';
      shape.style.borderColor = '#e1b12c';
    } else {
      shape.style.backgroundColor = 'var(--tortilla-harina)';
      shape.style.backgroundImage = "url('tex_tortilla_harina.png')";
      shape.style.backgroundSize = 'cover';
      shape.style.borderColor = '#eae1d4';
    }
  } else {
    shape.className = 'folded-burrito-shape';
    shape.style.backgroundColor = 'var(--tortilla-harina)';
    shape.style.backgroundImage = "url('tex_tortilla_harina.png')";
    shape.style.backgroundSize = 'cover';
    shape.style.borderColor = '#eae1d4';
  }
  
  // Aplicar efectos de tostado/cocido al envoltorio
  if (state.currentOrder.cooked >= 90) {
    shape.style.filter = 'brightness(0.3) contrast(1.5)';
  } else if (state.currentOrder.cooked >= 55) {
    shape.style.filter = 'sepia(0.4) saturate(1.2) brightness(0.8)';
  }
  
  foldedContainer.appendChild(shape);
  
  updateKitchenButtonsState();
}

// --- CORTAR ALIMENTOS ---
function cutMeal() {
  if (!state.currentOrder.folded || state.currentOrder.cut) return;
  
  // Sonido de corte
  if (window.sound) window.sound.playCut();
  
  state.currentOrder.cut = true;
  checkOffTicketItem('oi-cut');

  // Animación visual de corte (Línea roja cruzando)
  const canvas = document.getElementById('tortilla-canvas');
  const cutLine = document.createElement('div');
  cutLine.className = 'cut-line';
  if (state.currentOrder.folded === 'burrito') {
    cutLine.classList.add('horizontal');
  }
  canvas.appendChild(cutLine);
  
  setTimeout(() => cutLine.remove(), 400);
  
  // Separar sutilmente las dos mitades del burrito o taco doblado
  const foldedContainer = document.getElementById('visual-folded');
  foldedContainer.style.transform = 'scale(0.95)';
  
  const shape = foldedContainer.querySelector('div');
  if (shape) {
    shape.style.boxShadow = '-4px 4px 10px rgba(0,0,0,0.15), 4px -4px 10px rgba(0,0,0,0.15)';
    shape.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'; // Mantener estable
    
    // Simular corte visual aplicando una máscara o duplicando el elemento
    // Para simplificar, le añadimos una línea negra tenue en medio y restauramos la textura
    const img = (state.currentOrder.tortilla === 'maiz' && state.currentOrder.folded === 'taco') ? 'tex_tortilla_maiz.png' : 'tex_tortilla_harina.png';
    const gradient = state.currentOrder.folded === 'burrito' 
      ? 'linear-gradient(to bottom, transparent 48%, #5d4037 49%, #5d4037 51%, transparent 52%)'
      : 'linear-gradient(to right, transparent 48%, #5d4037 49%, #5d4037 51%, transparent 52%)';
      
    shape.style.backgroundImage = `${gradient}, url('${img}')`;
  }
  
  updateKitchenButtonsState();
}

// --- EVALUAR ORDEN Y ENTREGAR ---
function serveOrder(timeout = false) {
  if (state.patienceInterval) clearInterval(state.patienceInterval);
  
  // Detener comal si se nos olvidó
  if (state.isCooking) stopCooking();
  
  const customer = state.currentCustomer;
  
  // Si no está doblado y no es timeout, el cliente no lo acepta aún y te regaña
  if (!timeout && !state.currentOrder.folded) {
    const dialogBox = document.getElementById('customer-dialog');
    dialogBox.innerHTML = `<strong>${customer.name}:</strong> "¡Oye pariente, envuélvemelo primero! No me lo des así abierto."`;
    dialogBox.style.backgroundColor = '#ffcccc';
    dialogBox.style.color = '#aa0000';
    setTimeout(() => {
      dialogBox.style.backgroundColor = 'white';
      dialogBox.style.color = '#333';
    }, 3000);
    
    if (window.sound) window.sound.playClick();
    
    // Restaurar intervalo de paciencia ya que no se va
    state.patienceInterval = setInterval(() => {
      state.currentCustomer.patience -= 1.5;
      updatePatienceBar();
      if (state.currentCustomer.patience <= 0) {
        clearInterval(state.patienceInterval);
        serveOrder(true);
      }
    }, 1000);
    return; // No se va, sigue esperando
  }

  // Deshabilitar botón para evitar clics múltiples
  document.getElementById('btn-deliver').disabled = true;

  const targetRecipe = Object.values(RECIPES).find(r => r.id === customer.recipeId);
  
  let score = 100;
  let critique = [];
  const feedbackLines = [];

  if (timeout) {
    // Se fue por tiempo
    score = 0;
    critique.push('Paciencia agotada.');
    feedbackLines.push('⏰ Se acabó el tiempo');
  } else {
    // 1. Evaluar Tortilla
    if (state.currentOrder.tortilla !== targetRecipe.tortilla) {
      score -= 30;
      critique.push('Tortilla incorrecta.');
      feedbackLines.push('❌ Tortilla incorrecta');
    } else {
      feedbackLines.push('✅ Tortilla correcta');
    }

    // 2. Evaluar Untable (Base)
    if (state.currentOrder.spread !== targetRecipe.spread) {
      score -= 20;
      critique.push('Untable (base) equivocado.');
      feedbackLines.push('❌ Base equivocada');
    } else if (targetRecipe.spread) {
      feedbackLines.push('✅ Base correcta');
    }
    
    // 3. Evaluar Ingredientes Obligatorios
    const topLabel = { asada: 'Carne Asada', machaca: 'Machaca', discada: 'Discada', pescado: 'Pescado', queso: 'Queso', repollo: 'Repollo', rajas: 'Rajas', 'cebolla-cilantro': 'Cebolla/Cil.', 'salsa-verde': 'S. Verde', 'salsa-roja': 'S. Roja', limon: 'Limón' };
    targetRecipe.requiredToppings.forEach(top => {
      if (!state.currentOrder.toppings.includes(top)) {
        score -= 20;
        critique.push(`Le faltó ${topLabel[top] || top}.`);
        feedbackLines.push(`❌ Faltó ${topLabel[top] || top}`);
      } else {
        feedbackLines.push(`✅ ${topLabel[top] || top} incluido`);
      }
    });
    
    // 4. Evaluar Ingredientes Prohibidos / Sobrantes
    targetRecipe.forbiddenToppings.forEach(top => {
      if (state.currentOrder.toppings.includes(top)) {
        score -= 15;
        critique.push(`Ingrediente que no va en esta receta (${top}).`);
        feedbackLines.push(`❌ Tenía ${topLabel[top] || top} (no va)`);
      }
    });
    if (customer.specialMods && customer.specialMods.noVeg) {
      const veggies = ['cebolla-cilantro', 'repollo', 'rajas', 'salsa-roja', 'salsa-verde', 'limon'];
      veggies.forEach(veg => {
        if (state.currentOrder.toppings.includes(veg)) {
          score -= 15;
          critique.push('Tenía vegetales/salsas no deseados.');
          feedbackLines.push(`❌ ${topLabel[veg] || veg} (pedido sin verduras)`);
        }
      });
    }
    if (customer.specialMods && customer.specialMods.requireExtra) {
      customer.specialMods.requireExtra.forEach(top => {
        if (!state.currentOrder.toppings.includes(top)) {
          score -= 15;
          critique.push(`Le faltó el extra: ${topLabel[top] || top}.`);
          feedbackLines.push(`❌ Faltó ${topLabel[top] || top} (extra pedido)`);
        } else {
          feedbackLines.push(`✅ ${topLabel[top] || top} extra incluido`);
        }
      });
    }

    // 5. Evaluar Cocción
    const cooked = state.currentOrder.cooked;
    if (cooked < 25) {
      score -= 25;
      critique.push('Está demasiado crudo.');
      feedbackLines.push('❄️ Demasiado crudo');
    } else if (cooked > 92) {
      score -= 30;
      critique.push('Se te quemó por completo.');
      feedbackLines.push('💀 ¡Quemado!');
    } else if (cooked < 55) {
      score -= 10;
      critique.push('Faltó calentarlo un poco más.');
      feedbackLines.push('🌡️ Faltó más calor');
    } else if (cooked >= 85) {
      feedbackLines.push('🔥 Un poco tostadito');
    } else {
      feedbackLines.push('😋 Cocción al punto');
    }
    
    // 6. Evaluar Estilo de Doblez
    if (state.currentOrder.folded !== targetRecipe.fold) {
      score -= 25;
      critique.push('Estilo de doblez equivocado.');
      feedbackLines.push('❌ Doblez equivocado');
    } else {
      feedbackLines.push(`✅ Doblado como ${targetRecipe.fold}`);
    }
    
    // 7. Evaluar Corte (Discada va cortado, otros no)
    if (state.currentOrder.cut !== targetRecipe.cut) {
      score -= 10;
      critique.push(targetRecipe.cut ? 'Olvidaste cortarlo a la mitad.' : 'No debías cortarlo.');
      feedbackLines.push(targetRecipe.cut ? '❌ Faltó cortar a la mitad' : '❌ No debías cortarlo');
    } else if (targetRecipe.cut) {
      feedbackLines.push('✅ Cortado a la mitad');
    }
  }
  
  if (score < 0) score = 0;
  
  // Calcular Pagos y Mostrar Diálogos
  let finalPayout = 0;
  let tip = 0;
  let responseText = '';
  
  if (score >= 80) {
    // Excelente orden
    finalPayout = targetRecipe.price;
    // La propina depende de la paciencia restante y del score
    tip = Math.round((targetRecipe.price * 0.25) * (customer.patience / 100) * (score / 100) * 100) / 100;
    responseText = customer.slang.success;
    if (window.sound) window.sound.playSuccess();
  } else if (score >= 50) {
    // Aceptable pero con quejas
    finalPayout = Math.round(targetRecipe.price * 0.65 * 100) / 100;
    tip = 0.00;
    responseText = `${customer.slang.average} (${critique[0]})`;
    if (window.sound) window.sound.playClick();
  } else {
    // Rechazado
    finalPayout = 0.00;
    tip = 0.00;
    responseText = timeout ? '¡Se te acabó el tiempo, pariente! Me voy.' : `${customer.slang.fail} (${critique.join(' / ')})`;
    if (window.sound) window.sound.playFail();
    
    // Efectos de enojo visuales
    const dialogBox = document.getElementById('customer-dialog');
    dialogBox.style.backgroundColor = '#ffcccc';
    dialogBox.style.color = '#aa0000';
    setTimeout(() => {
      dialogBox.style.backgroundColor = 'white';
      dialogBox.style.color = '#333';
    }, 4500);

    const avatarBox = document.getElementById('customer-avatar');
    avatarBox.classList.add('shake-angry');
    setTimeout(() => avatarBox.classList.remove('shake-angry'), 500);
  }
  
  // Actualizar Estados Financieros
  state.money += finalPayout + tip;
  state.daySales += finalPayout;
  state.dayTips += tip;
  
  updateHUD();
  
  // Ocultar checklist para dar espacio a la respuesta del cliente
  const _checklist = document.getElementById('order-checklist');
  if (_checklist) _checklist.classList.add('hidden');

  // Mostrar Diálogo de respuesta del cliente con burbuja temporal y mostrar ganancia
  let payoutText = finalPayout > 0 ? `<span style="color:green">+$${finalPayout.toFixed(2)}</span>` : `<span style="color:red">+$0.00 (Rechazado)</span>`;
  document.getElementById('customer-dialog').innerHTML = `<strong>${customer.name}:</strong> "${responseText}" <br><b>${payoutText}</b>`;

  // Panel de feedback
  const prevPanel = document.getElementById('feedback-panel');
  if (prevPanel) prevPanel.remove();
  const feedbackEl = document.createElement('div');
  feedbackEl.id = 'feedback-panel';
  feedbackEl.style.cssText = 'background:rgba(20,20,20,0.85);color:#fff;padding:8px 14px;border-radius:8px;font-size:12px;line-height:2;margin-top:6px;display:flex;flex-wrap:wrap;gap:4px 12px;';
  feedbackEl.innerHTML = feedbackLines.map(l => `<span>${l}</span>`).join('');
  const dialogBox = document.getElementById('customer-dialog');
  dialogBox.parentNode.insertBefore(feedbackEl, dialogBox.nextSibling);
  setTimeout(() => { if (feedbackEl.parentNode) feedbackEl.remove(); }, 3000);
  
  // Desvanecer comida hacia arriba (servir)
  if (!timeout) {
    const canvas = document.getElementById('tortilla-canvas');
    if (canvas) canvas.classList.add('serve-slide-up');
  }
  
  // Efecto de desvanecer al cliente y pasar al siguiente
  if (!timeout) {
    setTimeout(() => {
      const imageMap = {
        'discada_burrito': 'burrito_discada_1779538989185.png',
        'machaca_burrito': 'burrito_machaca_1779538976949.jpg',
        'asada_taco': 'taco_asada_1779538963899.png',
        'pescado_taco': 'taco_pescado_1779539001401.png'
      };
      
      const presentation = document.getElementById('delivery-presentation');
      if (!presentation) return; // Fallback de seguridad
      
      const deliveryImage = document.getElementById('delivery-image');
      if (deliveryImage) {
        deliveryImage.src = imageMap[targetRecipe.id] || '';
      }
      
      presentation.style.display = 'flex';
      
      if (window.music) {
        window.music.playMusic('music/Menu inicio.mpeg', 8);
      }
      
      let starCount = 5;
      if (score < 50) starCount = 1;
      else if (score < 65) starCount = 2;
      else if (score < 80) starCount = 3;
      else if (score < 95) starCount = 4;
      
      const starsEl = document.getElementById('delivery-stars');
      if (starsEl) starsEl.innerText = '⭐'.repeat(starCount) + '☆'.repeat(5 - starCount);
      
      // Forzar un reflow para que la transición funcione
      void presentation.offsetWidth;
      presentation.style.opacity = '1';
      
      setTimeout(() => {
        presentation.style.opacity = '0';
        setTimeout(() => {
          presentation.style.display = 'none';
          state.customerIndex++;
          loadCustomer();
        }, 500);
      }, 3500);
      
    }, 1000); // Reducir tiempo de espera de 2500 a 1000
  } else {
    setTimeout(() => {
      state.customerIndex++;
      loadCustomer();
    }, 4500);
  }
}

// --- ACTUALIZAR HUD ---
function updateHUD() {
  document.getElementById('hud-money').innerText = `$${state.money.toFixed(2)}`;
  document.getElementById('hud-day').innerText = state.day;
}

// --- FIN DEL DÍA (RESUMEN) ---
function endDay() {
  if (state.patienceInterval) clearInterval(state.patienceInterval);

  if (window.music) {
    window.music.playMusic('music/Menu inicio.mpeg', 8);
  }

  // Ocultar juego y mostrar pantalla final
  document.getElementById('screen-game').classList.remove('active');
  document.getElementById('screen-summary').classList.add('active');
  document.querySelector('.summary-subtitle').innerText = `Jornada ${state.day} terminada`;
  
  // Valores en el balance
  document.getElementById('sum-sales').innerText = `$${state.daySales.toFixed(2)}`;
  document.getElementById('sum-tips').innerText = `$${state.dayTips.toFixed(2)}`;
  document.getElementById('sum-costs').innerText = `-$${state.dayCosts.toFixed(2)}`;
  
  const netEarnings = state.daySales + state.dayTips - state.dayCosts;
  const netField = document.getElementById('sum-net');
  netField.innerText = `$${netEarnings.toFixed(2)}`;
  
  if (netEarnings >= 0) {
    netField.className = 'value positive';
  } else {
    netField.className = 'value negative';
  }
  
  // Evaluar desempeño del jugador
  const evalBox = document.getElementById('summary-evaluation');
  if (netEarnings >= 50) {
    evalBox.innerText = '¡Fierro pariente! Te ganaste el respeto gastronómico de todo el norte. Chihuahua, Sonora y Coahuila te coronan como el rey del comal.';
  } else if (netEarnings > 0) {
    evalBox.innerText = 'Estuvo chilo el día, pero recuerda que el queso menonita y la carne de asada son caros. ¡Mídele bien a los ingredientes para ganar más propina!';
  } else {
    evalBox.innerText = '¡Asuuu! Saliste en números rojos. Quemaste tortillas o te equivocaste de guiso. ¡Estudia bien el recetario y vuelve a intentarlo!';
  }
}

// --- EVENTOS PANTALLA RESUMEN ---
function setupSummaryEvents() 
{
  document.getElementById('btn-restart-day').addEventListener('click', () => {
    if (window.sound) window.sound.playClick();
    state.day++;
    startDay();
  });

  document.getElementById('btn-go-splash').addEventListener('click', () => {
    if (window.sound) window.sound.playClick();
    state.money = 100.00;
    state.day = 1;
    document.getElementById('screen-summary').classList.remove('active');
    document.getElementById('screen-splash').classList.add('active');
  });
}
