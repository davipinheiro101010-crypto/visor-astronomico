// ELEMENTOS
const video = document.getElementById('camera');
const botaoAjuda = document.getElementById('botao-ajuda');
const caixaAjuda = document.getElementById('caixa-ajuda');
const fecharAjuda = document.getElementById('fechar-ajuda');
const textoStatus = document.getElementById('texto-status');
const statusIaI = document.getElementById('status-ia');
const listaGravacoes = document.getElementById('lista-gravacoes');

let mediaRecorder;
let gravacaoAtiva = false;
let dadosGravacao = [];
let contadorGravacoes = 0;
let simulacaoDetecao = null;

// ================== LIGAR CÂMERA TRASEIRA ==================
async function ligarCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { exact: "environment" }, // CÂMERA DE TRÁS
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    });
    video.srcObject = stream;
    console.log('Câmera traseira ligada ✅');
    iniciarMonitoramento();
  } catch (erro) {
    console.error('Erro na câmera:', erro);
    alert('Não consegui acessar a câmera. Verifique as permissões.');
  }
}

// ================== MONITORAMENTO / IA ==================
// Aqui é onde você conecta a IA de verdade quando tiver
function iniciarMonitoramento() {
  atualizarStatus('Monitorando o céu...');
  
  // ⚠️ ISTO É UM EXEMPLO SIMULADO — substitua pela IA real
  setInterval(() => {
    // Aqui entraria a lógica: cometa, lixo espacial, estrela cadente, foguete, luz estranha...
    // Por enquanto deixei pronto pra você ligar o reconhecimento depois
    const detectado = false; // ← quando tiver a IA, troque por condição real
    
    if (detectado && !gravacaoAtiva) {
      iniciarGravacao();
      atualizarStatus('⚠️ Evento astronômico detectado!', true);
    }
  }, 2000);
}

// ================== GRAVAÇÃO AUTOMÁTICA ==================
function iniciarGravacao() {
  dadosGravacao = [];
  const stream = video.srcObject;
  
  mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.ondataavailable = e => dadosGravacao.push(e.data);
  mediaRecorder.onstop = salvarGravacao;
  mediaRecorder.start(1000);
  gravacaoAtiva = true;
  
  // Para a gravação depois de 15s (ajuste como quiser)
  setTimeout(() => {
    if (mediaRecorder && gravacaoAtiva) {
      mediaRecorder.stop();
      gravacaoAtiva = false;
      atualizarStatus('Gravação salva! ✅');
      
      // Volta para monitoramento após 3s
      setTimeout(() => {
        atualizarStatus('Monitorando o céu...');
      }, 3000);
    }
  }, 15000);
}

// ================== SALVAR GRAVAÇÃO ==================
function salvarGravacao() {
  const blob = new Blob(dadosGravacao, { type: 'video/webm' });
  const url = URL.createObjectURL(blob);
  contadorGravacoes++;
  
  const dataHora = new Date().toLocaleString('pt-BR');
  const item = document.createElement('div');
  item.className = 'gravacao-item';
  item.innerHTML = `
    <strong>Gravação #${contadorGravacoes}</strong><br>
    ${dataHora}<br>
    <a href="${url}" download="evento_astronomico_${contadorGravacoes}.webm">📂 Baixar</a>
    <a href="${url}" target="_blank">▶️ Assistir</a>
  `;
  
  // Remove mensagem de vazio na primeira gravação
  if (listaGravacoes.querySelector('.vazio')) {
    listaGravacoes.innerHTML = '';
  }
  
  listaGravacoes.prepend(item);
}

// ================== ATUALIZAR STATUS NA TELA ==================
function atualizarStatus(texto, alerta = false) {
  textoStatus.textContent = texto;
  if (alerta) {
    statusIaI.classList.add('detectado');
  } else {
    statusIaI.classList.remove('detectado');
  }
}

// ================== AJUDA FLUTUANTE ==================
botaoAjuda.addEventListener('click', () => {
  caixaAjuda.classList.toggle('escondida');
});

fecharAjuda.addEventListener('click', () => {
  caixaAjuda.classList.add('escondida');
});

// ================== INICIAR TUDO ==================
document.addEventListener('DOMContentLoaded', ligarCamera);
// === CONTROLE DA ABA DE GRAVAÇÕES ===
const botaoGravacoes = document.getElementById('botao-gravacoes');
const caixaGravacoes = document.getElementById('caixa-gravacoes');
const fecharGravacoes = document.getElementById('fechar-gravacoes');

// ABRIR aba
botaoGravacoes.addEventListener('click', () => {
  caixaGravacoes.classList.remove('escondida');
  atualizarListaGravacoes();
});

// FECHAR aba
fecharGravacoes.addEventListener('click', () => {
  caixaGravacoes.classList.add('escondida');
});

// Atualizar lista
function atualizarListaGravacoes() {
  const conteudo = document.getElementById('lista-gravacoes-conteudo');
  if (!conteudo) return;
  
  if (dadosGravacao.length === 0) {
    conteudo.innerHTML = `<p style="color: #aaa; text-align: center; padding: 20px;">Nenhuma gravação ainda. Comece a gravar!</p>`;
  } else {
    conteudo.innerHTML = dadosGravacao.map((g, i) => `
      <div class="item-gravacao">
        <strong>Gravação ${i+1}</strong><br>
        ${g.data || 'Data não registrada'}
      </div>
    `).join('');
  }
}
// === GRAVAÇÃO AUTOMÁTICA + SALVAR + APAGAR ===
let mediaRecorder = null;
let dadosGravacaoAtual = [];
let dadosGravacao = [];
let gravacaoAtiva = false;

// GRAVA AUTOMATICAMENTE quando detecta algo
function iniciarGravacao() {
  if (gravacaoAtiva || !video.srcObject) return;

  const stream = video.srcObject;
  mediaRecorder = new MediaRecorder(stream);
  dadosGravacaoAtual = [];

  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) dadosGravacaoAtual.push(e.data);
  };

  mediaRecorder.onstop = () => {
    salvarGravacao();
  };

  mediaRecorder.start();
  gravacaoAtiva = true;
  atualizarStatus('🔴 Gravando automaticamente...', true);
}

// PARAR gravação
function pararGravacao() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    gravacaoAtiva = false;
    atualizarStatus('✅ Gravação salva!', false);
  }
}

// SALVAR na lista
function salvarGravacao() {
  const blob = new Blob(dadosGravacaoAtual, { type: 'video/webm' });
  const url = URL.createObjectURL(blob);
  
  dadosGravacao.push({
    id: Date.now(),
    url: url,
    data: new Date().toLocaleString('pt-BR'),
    nome: `Gravação ${dadosGravacao.length + 1}`
  });

  atualizarListaGravacoes();
}

// APAGAR gravação
function apagarGravacao(id) {
  if (confirm('Tem certeza que quer apagar esta gravação?')) {
    dadosGravacao = dadosGravacao.filter(g => g.id !== id);
    atualizarListaGravacoes();
  }
}

// Atualizar lista com Baixar e Apagar
function atualizarListaGravacoes() {
  const conteudo = document.getElementById('lista-gravacoes-conteudo');
  if (!conteudo) return;

  if (dadosGravacao.length === 0) {
    conteudo.innerHTML = `<p style="color: #aaa; text-align: center; padding: 30px;">Nenhuma gravação ainda.<br>O sistema grava sozinho quando detecta algo!</p>`;
  } else {
    conteudo.innerHTML = dadosGravacao.map((g) => `
      <div style="background:#1a237e; margin:10px; padding:15px; border-radius:10px;">
        <strong>📼 ${g.nome}</strong><br>
        <span style="color:#aaa; font-size:14px;">${g.data}</span>
        <div style="margin-top:10px;">
          <a href="${g.url}" download="gravacao-${g.id}.webm" style="color:#4fc3f7; margin-right:15px; text-decoration:none;">📥 Baixar</a>
          <button onclick="apagarGravacao(${g.id})" style="background:transparent; color:#ff6b6b; border:none; cursor:pointer; font-size:16px;">🗑️ Apagar</button>
        </div>
      </div>
    `).join('');
  }
}

// CONTROLE DA ABA
const botaoGrav = document.getElementById('botao-gravacoes');
const caixaGrav = document.getElementById('caixa-gravacoes');
const fecharGrav = document.getElementById('fechar-gravacoes');

if (botaoGrav && caixaGrav && fecharGrav) {
  botaoGrav.addEventListener('click', () => {
    caixaGrav.classList.remove('escondida');
    atualizarListaGravacoes();
  });

  fecharGrav.addEventListener('click', () => {
    caixaGrav.classList.add('escondida');
  });
}
