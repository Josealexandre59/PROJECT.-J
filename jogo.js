const canvas = document.getElementById("jogo")
const ctx = canvas.getContext("2d")
const placarEl = document.getElementById("placar")
// A priori
const estadoInicial = {
  bola: { x: 250, y: 460, r: 15, vy: 0, lancada: false },
  cesta: { x: 200, y: 50, w: 100, h: 10 },
  pontos: 0
}
// função para desenhar o jogo
const desenhar = (ctx, estado) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  // Aqui fiz a cesta no jogo. 
  ctx.fillStyle = "blue"
  ctx.fillRect(estado.cesta.x, estado.cesta.y, estado.cesta.w, estado.cesta.h)
  // Bola
  ctx.beginPath()
  ctx.arc(estado.bola.x, estado.bola.y, estado.bola.r, 0, Math.PI * 2)
  ctx.fillStyle = "red"
  ctx.fill()
  // Placar
  placarEl.textContent = "Pontos: " + estado.pontos
}
// Função pura: atualiza o estado da bola
function atualizar(estado) {
  if (!estado.bola.lancada) {
    // Atualiza apenas a cesta se a bola não estiver em movimento
    let novaX = estado.cesta.x + estado.cesta.vx
    if (novaX + estado.cesta.w > canvas.width) {
      novaX = canvas.width - estado.cesta.w
      estado.cesta.vx *= -1
    }
    if (novaX < 0) {
      novaX = 0
      estado.cesta.vx *= -1
    }
    return {
      ...estado,
      cesta: { ...estado.cesta, x: novaX },
    }
  }
  const novaY = estado.bola.y + estado.bola.vy
  const novaVy = estado.bola.vy + 0.5
  // Atualiza posição da cesta sempre
  let novaX = estado.cesta.x + estado.cesta.vx
  if (novaX + estado.cesta.w > canvas.width) {
    novaX = canvas.width - estado.cesta.w
    estado.cesta.vx *= -1
  }
    if (novaX < 0) {
    novaX = 0
    estado.cesta.vx *= -1
  }
  const dentroCesta =
    estado.bola.x > estado.cesta.x &&
    estado.bola.x < estado.cesta.x + estado.cesta.w &&
    estado.bola.y < estado.cesta.y + estado.cesta.h &&
    estado.bola.y > estado.cesta.y - estado.bola.r
  if (dentroCesta) {
    return { ...estado, cesta: { ...estado.cesta, x: novaX }, bola: { ...estado.bola, y: 460, vy: 0, lancada: false }, pontos: estado.pontos + 1,
    }
  }
  if (novaY > 460) {
    return {...estado, cesta:{ ...estado.cesta, x: novaX }, bola:{ ...estado.bola, y: 460, vy: 0, lancada: false },
  }
}
  return {...estado,cesta: { ...estado.cesta, x: novaX },bola:{ ...estado.bola, y: novaY, vy: novaVy,
    lancada: true },
  }
}
// Função pura: Deve lançar a bola
function lancar  (estado)  {
  if (!estado.bola.lancada) {
    return {
      ...estado,
      bola: { ...estado.bola, vy: -15, lancada: true }
    }
  }
  return estado
}

let estado = estadoInicial
// Loop do jogo
const loop = () => {
  estado = atualizar(estado)
  desenhar(ctx, estado)
  requestAnimationFrame(loop)
}
loop()
// clique → lança a bola
canvas.addEventListener("click", () => {
  estado = lancar(estado)
})