/**
 * Matrix Background - Ultra-Performance Edition
 * Refactorizado para eliminar objetos zombis y cálculos redundantes a 60fps.
 */

(function () {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: false });

  // CORRECCIÓN 1: El Pool
  // Matrix funciona con caracteres individuales. Tomamos tu identidad y la 
  // desarmamos en un set de caracteres únicos para que la lluvia tenga sentido visual.
  const rawIdentity = "JOAQUINCOLLAUD01DEBIANSYSADMINx70";
  const POOL = [...new Set(rawIdentity.split(''))]; 
  const FONT_SIZE = 18;
  
  let width, height, columns;
  let drops = [];
  
  // CORRECCIÓN 2: Variables estáticas fuera del bucle de animación
  let centerX, sideZone; 

  const charCache = document.createElement('canvas');
  const cctx = charCache.getContext('2d');

  function prerenderChars() {
    charCache.width = FONT_SIZE * POOL.length;
    charCache.height = FONT_SIZE;
    cctx.font = `bold ${FONT_SIZE}px "JetBrains Mono", monospace`;
    cctx.fillStyle = '#00ff41';
    cctx.textBaseline = 'top';
    POOL.forEach((char, i) => {
      cctx.fillText(char, i * FONT_SIZE, 0);
    });
  }

  function init() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    centerX = width / 2;
    sideZone = width * 0.35; 

    columns = Math.floor(width / FONT_SIZE); 
    drops = [];

    for (let i = 0; i < columns; i++) {
      const xPos = i * FONT_SIZE;
      
      // Mantenemos la zona central limpia
      if (Math.abs(xPos - centerX) < (centerX - sideZone)) {
        continue; 
      }

      // ESTRATEGIA DE DENSIDAD: Metemos 3 gotas distintas en la misma columna.
      // Las desfasamos en el eje Y para que no caigan juntas.
      for (let j = 0; j < 3; j++) {
        drops.push({
          x: xPos,
          y: (Math.random() * height) - height, // Empiezan esparcidas arriba de la pantalla
          speed: 0.8 + Math.random() * 1.5,
          charOffset: Math.floor(Math.random() * POOL.length) * FONT_SIZE,
          opacity: 0.15 + Math.random() * 0.6 // Rango de opacidad más amplio para dar profundidad
        });
      }
    }
  }
  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; 
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < drops.length; i++) {
      const d = drops[i];

      ctx.globalAlpha = d.opacity;
      ctx.drawImage(
        charCache, 
        d.charOffset, 0, FONT_SIZE, FONT_SIZE, 
        d.x, d.y, FONT_SIZE, FONT_SIZE
      );

      d.y += d.speed;

      // ESTRATEGIA DE MUTACIÓN: Compuerta de probabilidad.
      // Solo hay un 8% de chances de que la letra cambie en este frame exacto.
      // Da la ilusión de cambio constante sin reventar el Event Loop.
      if (Math.random() < 0.08) {
        d.charOffset = Math.floor(Math.random() * POOL.length) * FONT_SIZE;
      }

      if (d.y > height) {
        d.y = -FONT_SIZE;
        d.charOffset = Math.floor(Math.random() * POOL.length) * FONT_SIZE;
        d.opacity = 0.15 + Math.random() * 0.6; 
      }
    }
    
    ctx.globalAlpha = 1.0; 
  }

  function animate() {
    draw();
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', init);
  prerenderChars();
  init();
  animate();
})();