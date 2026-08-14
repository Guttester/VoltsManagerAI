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
  userAvatar.textContent = senderRole === 'user' ? '⚡' : '🤖';

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
async function sendVoltsRequest(userPrompt) {
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

    if (response.status === 429) {
      appendVoltsMessage(
        "assistant",
        "Limite de requisições atingido (1/30s) para proteger a VPS. Aguarde alguns segundos."
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

    appendVoltsMessage(
      "assistant",
      `${error.name}: ${error.message}`
    );
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