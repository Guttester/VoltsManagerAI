const chatWindow = document.getElementById('chatWindow');
const chatLauncher = document.getElementById('chatLauncher');
const expandChat = document.getElementById('expandChat');
const minimizeChat = document.getElementById('minimizeChat');

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

/* ============================== GLOBAL ============================== */
let isFirstInteraction = true; 
const voltsChatHistory = [];
const API_ENDPOINT = "/api/chat";

const voltsAiChat = document.getElementById('VoltsAiChat');
const welcomeScreen = document.getElementById('welcomeScreen');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendMessage');

function loadVoltsInitialGreeting() {
  const welcomeText = 'Olá! 👋 Sou o assistente inteligente do <strong>VoltsManager</strong>. Como posso ajudar?';
  appendVoltsMessage('assistant', welcomeText);
}

/* ======================== FUNÇÃO DE CONTROLE ======================== */

/* ======================== REQUISIÇÃO / ENVIO ======================== */
function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;
  handleFirstMessage();
  chatInput.value = '';
}

/* ============================ EVENTOS ============================== */
function renderVoltsBubble(senderRole, messageContent) {
  const messageCard = document.createElement('article');
  messageCard.className = `volts-msg volts-${senderRole}`;

  const metaSide = document.createElement('div');
  metaSide.className = 'volts-meta';

  const userAvatar = document.createElement('div');
  userAvatar.className = 'volts-avatar';
  userAvatar.textContent = senderRole === 'user' ? '👤' : '⚡';

  const timeStamp = document.createElement('div');
  timeStamp.className = 'volts-time';
  timeStamp.textContent = new Date().toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  metaSide.append(userAvatar, timeStamp);

  const textBubble = document.createElement('div');
  textBubble.className = 'volts-bubble';
  textBubble.innerHTML = messageContent;

  messageCard.append(metaSide, textBubble);
  return messageCard;
}

function appendVoltsMessage(senderRole, messageContent) {
  const chatContainer = document.getElementById('VoltsAiChat');
  if (!chatContainer) return;

  if (voltsChatHistory.length === 0 && senderRole === 'user') {
    chatContainer.innerHTML = '';
  }

  voltsChatHistory.push({
    role: senderRole,
    content: messageContent,
    timestamp: new Date().toISOString()
  });

  const newBubble = renderVoltsBubble(senderRole, messageContent);
  chatContainer.appendChild(newBubble);
  
  const scrollArea = chatContainer.closest('.messages-area') || chatContainer;
  requestAnimationFrame(() => {
    scrollArea.scrollTo({
      top: scrollArea.scrollHeight,
      behavior: 'smooth'
    });
  });

}

function loadVoltsInitialGreeting() {
  const welcomeText = 'Olá! 👋 Sou o assistente inteligente do <strong>VoltsManager</strong>. Como posso ajudar?';
  appendVoltsMessage('assistant', welcomeText);
}

/* ====================================================================
   REQUISIÇÃO / ENVIO
   ==================================================================== */
function showVoltsLoading() {
  const chatContainer = document.getElementById('VoltsAiChat');
  if (!chatContainer) return;

  // Cria a estrutura usando a mesma classe que definimos pro seu layout
  const loadingCard = document.createElement('article');
  loadingCard.className = 'volts-msg volts-assistant volts-loading-card';
  loadingCard.id = 'voltsAiLoading';

  loadingCard.innerHTML = `
    <div class="volts-meta">
      <div class="volts-avatar">⚡</div>
    </div>
    <div class="volts-bubble volts-loading-bubble">
      <span class="volts-dots">Pensando<span>.</span><span>.</span><span>.</span></span>
    </div>
  `;

  chatContainer.appendChild(loadingCard);

  // Auto-scroll para acompanhar o aparecimento do loading
  const scrollArea = chatContainer.closest('.messages-area') || chatContainer;
  requestAnimationFrame(() => {
    scrollArea.scrollTo({ top: scrollArea.scrollHeight, behavior: 'smooth' });
  });
}

// Remove a bolha de loading da tela
function removeVoltsLoading() {
  const loadingCard = document.getElementById('voltsAiLoading');
  if (loadingCard) loadingCard.remove();
}

// Trava/Destrava o input e o botão de enviar
function toggleChatControls(disabled) {
  const chatInput = document.getElementById("chatInput");
  const sendButton = document.getElementById("sendMessage");

  if (chatInput) chatInput.disabled = disabled;
  if (sendButton) sendButton.disabled = disabled;
}

/* ====================================================================
   FUNÇÕES AUXILIARES DE LOADING E DESABILITAÇÃO
   ==================================================================== */

// Mostra a bolha de "Pensando..." no chat
function showVoltsLoading() {
  const chatContainer = document.getElementById('VoltsAiChat');
  if (!chatContainer) return;

  // Cria a estrutura usando a mesma classe que definimos pro seu layout
  const loadingCard = document.createElement('article');
  loadingCard.className = 'volts-msg volts-assistant volts-loading-card';
  loadingCard.id = 'voltsAiLoading';

  loadingCard.innerHTML = `
    <div class="volts-meta">
      <div class="volts-avatar">⚡</div>
    </div>
    <div class="volts-bubble volts-loading-bubble">
      <span class="volts-dots">Pensando<span>.</span><span>.</span><span>.</span></span>
    </div>
  `;

  chatContainer.appendChild(loadingCard);

  // Auto-scroll para acompanhar o aparecimento do loading
  const scrollArea = chatContainer.closest('.messages-area') || chatContainer;
  requestAnimationFrame(() => {
    scrollArea.scrollTo({ top: scrollArea.scrollHeight, behavior: 'smooth' });
  });
}

// Remove a bolha de loading da tela
function removeVoltsLoading() {
  const loadingCard = document.getElementById('voltsAiLoading');
  if (loadingCard) loadingCard.remove();
}

// Trava/Destrava o input e o botão de enviar
function toggleChatControls(disabled) {
  const chatInput = document.getElementById("chatInput");
  const sendButton = document.getElementById("sendMessage");

  if (chatInput) chatInput.disabled = disabled;
  if (sendButton) sendButton.disabled = disabled;
}

/* ====================================================================
   REQUISIÇÃO COM LOADING INTEGRADO
   ==================================================================== */

async function sendVoltsRequest(userPrompt) {
  // 1. Inicia o estado de carregamento e trava a interface
  toggleChatControls(true);
  showVoltsLoading();

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userPrompt,
        history: voltsChatHistory
      })
    });

    console.log("STATUS:", response.status);

    // 2. Remove o loading antes de exibir a resposta/erro na tela
    removeVoltsLoading();

    if (response.status === 429) {
      appendVoltsMessage(
        "assistant",
        "Já estou processando sua mensagem anterior! Por favor, aguarde a resposta antes de enviar outra."
      );
      return;
    }

    if (response.status === 504 || response.status === 503) {
      appendVoltsMessage(
        "assistant",
        "O servidor está muito ocupado no momento. Tente novamente em instantes."
      );
      return;
    }

    if (!response.ok) {
      appendVoltsMessage(
        "assistant",
        `Erro no servidor (${response.status})`
      );
      return;
    }

    const data = await response.json();

    console.log("RESPOSTA COMPLETA:", data);
    console.log("REPLY:", data.reply);
    console.log("MESSAGE:", data.message);

    appendVoltsMessage(
      "assistant",
      data.reply || data.message || "O modelo não retornou nenhuma mensagem."
    );

  } catch (error) {
    console.error("ERRO:", error);
    removeVoltsLoading();
    appendVoltsMessage(
      "assistant",
      `${error.name}: ${error.message}`
    );
  } finally {
    toggleChatControls(false);
    
    const chatInput = document.getElementById("chatInput");
    if (chatInput) chatInput.focus();
  }
}

function sendMessage() {
  const chatInput = document.getElementById("chatInput");
  if (!chatInput) return;

  const text = chatInput.value.trim();
  if (!text) return;

  appendVoltsMessage("user", text);
  chatInput.value = "";
  sendVoltsRequest(text);
}

document.addEventListener('DOMContentLoaded', () => {
  loadVoltsInitialGreeting();

  const chatInput = document.getElementById("chatInput");
  if (chatInput) {
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }
});