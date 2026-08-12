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