const chatWindow = document.getElementById('chatWindow');
const chatLauncher = document.getElementById('chatLauncher');
const expandChat = document.getElementById('expandChat');
const minimizeChat = document.getElementById('minimizeChat');

/* ============================== GLOBAL ============================== */
let isFirstInteraction = true; 
const voltsAiChat = document.getElementById('VoltsAiChat');
const welcomeScreen = document.getElementById('welcomeScreen');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendMessage');

/* ======================== FUNÇÃO DE CONTROLE ======================== */
function handleFirstMessage() {
  if (isFirstInteraction) {
    isFirstInteraction = false;
    
    // Oculta a tela de boas-vindas ao enviar a 1ª mensagem
    if (welcomeScreen) {
      welcomeScreen.style.display = 'none';
      // Ou alternativamente: welcomeScreen.remove();
    }
  }
}
/* ======================== REQUISIÇÃO / ENVIO ======================== */
function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  // 1. Esconde o welcome na primeira mensagem
  handleFirstMessage();

  // 2. Adiciona a mensagem do usuário na tela
  // 3. Dispara o request para o seu Agente / Backend
  // triggerAgentRequest(text);

  chatInput.value = '';
}

/* ============================ EVENTOS ============================== */
sendButton.addEventListener('click', () => {
  console.log('🟢 BOTÃO ENVIAR CLICADO');
  sendMessage();
});

chatInput.addEventListener('keydown', (event) => {
  console.log('⌨️ TECLA PRESSIONADA:', event.key);

  if (event.key === 'Enter') {
    console.log('🟢 ENTER DETECTADO');
    sendMessage();
  }
});


// 1. ABRIR / FECHAR PELO BOTÃO FLUTUANTE
chatLauncher.addEventListener('click', () => {
  chatWindow.classList.toggle('hidden');
});

// 2. EXPANDIR PARA TELA INTEIRA (DENTRO DA JANELA)
expandChat.addEventListener('click', () => {
  chatWindow.classList.toggle('fullscreen');
});

// 3. RECOLHER / FECHAR O CHAT
minimizeChat.addEventListener('click', () => {
  chatWindow.classList.remove('fullscreen');
  chatWindow.classList.add('hidden');
});


