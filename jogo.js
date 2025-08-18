const canvas = document.getElementById("jogo");
const ctx = canvas.getContext("2d");
const placarEl = document.getElementById("placar");

// A priori 
const estadoInicial = {
  bola: { x: 250, y: 460, r: 15, vy: 0, lancada: false },
  cesta: { x: 200, y: 50, w: 100, h: 10 },
  pontos: 0
};

// função para desenhar o jogo
const desenhar = (ctx, estado) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Aqui fiz a cesta no jogo. 
  ctx.fillStyle = "blue";
  ctx.fillRect(estado.cesta.x, estado.cesta.y, estado.cesta.w, estado.cesta.h);

  // Bola
  ctx.beginPath();
  ctx.arc(estado.bola.x, estado.bola.y, estado.bola.r, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();

  // Placar
  placarEl.textContent = "Pontos: " + estado.pontos;
};

// Função pura: atualiza o estado da bola
const atualizar = (estado) => {
  if (!estado.bola.lancada) return estado;

  let novaY = estado.bola.y + estado.bola.vy;
  let novaVy = estado.bola.vy + 0.5; // gravidade

  // verificar se  a bola passou pela cesta
  const dentroCesta =
    estado.bola.x > estado.cesta.x &&
    estado.bola.x < estado.cesta.x + estado.cesta.w &&
    estado.bola.y < estado.cesta.y + estado.cesta.h &&
    estado.bola.y > estado.cesta.y - estado.bola.r;

  if (dentroCesta) {
    return {
      ...estado,
      bola: { ...estado.bola, y: 460, vy: 0, lancada: false },
      pontos: estado.pontos + 1
    };
  }

  // A bola voltou pro chão
  if (novaY > 460) {
    return {
      ...estado,
      bola: { ...estado.bola, y: 460, vy: 0, lancada: false }
    };
  }

  return {
    ...estado,
    bola: { ...estado.bola, y: novaY, vy: novaVy, lancada: true }
  };
};

// Função pura: Deve lançar a bola
const lancar = (estado) => {
  if (!estado.bola.lancada) {
    return {
      ...estado,
      bola: { ...estado.bola, vy: -15, lancada: true }
    };
  }
  return estado;
};

let estado = estadoInicial;

// Loop do jogo
const loop = () => {
  estado = atualizar(estado);
  desenhar(ctx, estado);
  requestAnimationFrame(loop);
};
loop();

// clique → lança a bola
canvas.addEventListener("click", () => {
  estado = lancar(estado);
});
