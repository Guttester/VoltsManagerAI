const chatWindow = document.getElementById('chatWindow');
const chatLauncher = document.getElementById('chatLauncher');
const expandChat = document.getElementById('expandChat');
const minimizeChat = document.getElementById('minimizeChat');

chatLauncher.addEventListener('click', () => chatWindow.classList.toggle('hidden'));
expandChat.addEventListener('click', () => chatWindow.classList.toggle('fullscreen'));
minimizeChat.addEventListener('click', () => {
  chatWindow.classList.remove('fullscreen');
  chatWindow.classList.add('hidden');
});

/* ============================== GLOBAL ============================== */
let isFirstInteraction = true; 
const voltsChatHistory = [];
const API_ENDPOINT = "/api/chat";

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
  
  // CORREÇÃO OWASP: Proteção XSS
  if (senderRole === 'user') {
    textBubble.textContent = messageContent; 
  } else {
    textBubble.innerHTML = messageContent; 
  }

  messageCard.append(metaSide, textBubble);
  return messageCard;
}

function appendVoltsMessage(senderRole, messageContent) {
  const chatContainer = document.getElementById('VoltsAiChat');
  if (!chatContainer) return;

  if (voltsChatHistory.length === 0 && senderRole === 'user') {
    chatContainer.innerHTML = '';
  }

  voltsChatHistory.push({ role: senderRole, content: messageContent, timestamp: new Date().toISOString() });

  const newBubble = renderVoltsBubble(senderRole, messageContent);
  chatContainer.appendChild(newBubble);
  
  const scrollArea = chatContainer.closest('.messages-area') || chatContainer;
  requestAnimationFrame(() => scrollArea.scrollTo({ top: scrollArea.scrollHeight, behavior: 'smooth' }));
}

function loadVoltsInitialGreeting() {
  const welcomeText = 'Olá! 👋 Sou o assistente inteligente do <strong>VoltsManager</strong>. Como posso ajudar?';
  appendVoltsMessage('assistant', welcomeText);
}

/* ================== FUNÇÕES AUXILIARES E LOADING ==================== */
function showVoltsLoading() {
  const chatContainer = document.getElementById('VoltsAiChat');
  if (!chatContainer) return;

  const loadingCard = document.createElement('article');
  loadingCard.className = 'volts-msg volts-assistant volts-loading-card';
  loadingCard.id = 'voltsAiLoading';
  loadingCard.innerHTML = `
    <div class="volts-meta"><div class="volts-avatar">⚡</div></div>
    <div class="volts-bubble volts-loading-bubble">
      <span class="volts-dots">Pensando<span>.</span><span>.</span><span>.</span></span>
    </div>`;

  chatContainer.appendChild(loadingCard);
  const scrollArea = chatContainer.closest('.messages-area') || chatContainer;
  requestAnimationFrame(() => scrollArea.scrollTo({ top: scrollArea.scrollHeight, behavior: 'smooth' }));
}

function removeVoltsLoading() {
  const loadingCard = document.getElementById('voltsAiLoading');
  if (loadingCard) loadingCard.remove();
}

function toggleChatControls(disabled) {
  const chatInput = document.getElementById("chatInput");
  const sendButton = document.getElementById("sendMessage");
  if (chatInput) chatInput.disabled = disabled;
  if (sendButton) sendButton.disabled = disabled;
}

/* ======================== REQUISIÇÃO / ENVIO ======================== */
async function sendVoltsRequest(userPrompt) {
  toggleChatControls(true);
  showVoltsLoading();

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userPrompt, history: voltsChatHistory })
    });

    removeVoltsLoading();

    if (response.status === 429) {
      return appendVoltsMessage("assistant", "Já estou processando sua mensagem anterior! Por favor, aguarde.");
    }
    if (response.status === 504 || response.status === 503) {
      return appendVoltsMessage("assistant", "O servidor está muito ocupado no momento. Tente novamente em instantes.");
    }
    if (!response.ok) {
      return appendVoltsMessage("assistant", `Erro no servidor (${response.status})`);
    }

    const data = await response.json();
    appendVoltsMessage("assistant", data.reply || data.message || "O modelo não retornou nenhuma mensagem.");

  } catch (error) {
    removeVoltsLoading();
    appendVoltsMessage("assistant", `${error.name}: ${error.message}`);
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