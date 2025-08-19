const canvas = document.getElementById("jogo")
const contexto = canvas.getContext("2d")
const placar = document.getElementById("placar")

// ESTADO INICIAL DO JOGO

const estadoInicial = {
  bola: { x: 250, y: 460, raio: 15, velocidade: 0, lancada: false },
  cesta: { x: 200, y: 50, largura: 100, altura: 10 },
  pontos: 0
}

// FUNÇÃO PARA CRIAR UM OBJETO IMAGEM DA QUADRA

const quadra = new Image();
  quadra.src = "https://static.vecteezy.com/system/resources/previews/013/750/302/original/basketball-court-design-free-vector.jpg"
  
// FUNÇÃO PARA DESENHAR O JOGO

const desenhar = (contexto, estado) => {
  contexto.clearRect(0, 0, canvas.width, canvas.height);

  // -------------Quadra de basquete---------------
  quadra.onload = () => {
    contexto.drawImage (quadra, 0, 0, canvas.width, canvas. height)
  }

  // -------------Cesta de Basquete---------------
  contexto.fillStyle = "blue";
  contexto.fillRect(estado.cesta.x, estado.cesta.y, estado.cesta.largura, estado.cesta.altura);

  contexto.lineWidth = 3;
  contexto.strokeStyle = "red";
  contexto.strokeRect(201, 51, 100, 10);

  // -------------Bola de basquete---------------
  contexto.beginPath();
  contexto.fillStyle = "red";
  contexto.arc(estado.bola.x, estado.bola.y, estado.bola.raio, 0, Math.PI * 2);
  contexto.fill();

  // Placar
  placar.textContent = "Pontos: " + estado.pontos;
}

// Função pura: atualiza o estado da bola
const atualizar = (estado) => {
  if (!estado.bola.lancada) return estado;

  let novaY = estado.bola.y + estado.bola.velocidade;
  let novaVy = estado.bola.velocidade + 0.5; // gravidade

  // verificar se  a bola passou pela cesta
  const dentroCesta =
    estado.bola.x > estado.cesta.x &&
    estado.bola.x < estado.cesta.x + estado.cesta.largura &&
    estado.bola.y < estado.cesta.y + estado.cesta.altura &&
    estado.bola.y > estado.cesta.y - estado.bola.raio;

  if (dentroCesta) {
    return {
      ...estado,
      bola: { ...estado.bola, y: 460, velocidade: 0, lancada: false },
      pontos: estado.pontos + 1
    };
  }

  // A bola voltou pro chão
  if (novaY > 460) {
    return {
      ...estado,
      bola: { ...estado.bola, y: 460, velocidade: 0, lancada: false }
    };
  }

  return {
    ...estado,
    bola: { ...estado.bola, y: novaY, velocidade: novaVy, lancada: true }
  };
};

// Função pura: Deve lançar a bola
const lancar = (estado) => {
  if (!estado.bola.lancada) {
    return {
      ...estado,
      bola: { ...estado.bola, velocidade: -20, lancada: true }
    };
  }
  return estado;
};

let estado = estadoInicial;

// Loop do jogo
const loop = () => {
  estado = atualizar(estado);
  desenhar(contexto, estado);
  requestAnimationFrame(loop);
};
loop();

// clique → lança a bola
canvas.addEventListener("click", () => {
  estado = lancar(estado);
});
