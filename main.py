import sys
from LLM.llm import LLM

def ChatLoop(bot: LLM):
    UserInput = input("\nVocê: ").strip()

    # Condição de saída do loop
    if UserInput.lower() in ["sair", "exit", "quit"]:
        print("\nSaindo do chat... Até mais!")
        sys.exit(0)

    if UserInput:
        resposta = bot.GerateChat(UserInput)
        print(f"\nVoltsAI: {resposta}")

    # Chamada recursiva para manter o chat ativo
    ChatLoop(bot)

if __name__ == "__main__":
    BotAgent = LLM()
    print(f"Carregando modelo em: \033[31m{BotAgent.GetModelPath()}\033[0m... \n")
    
    print("=== VoltsManagerAI Inicializado ===")
    print("Digite sua mensagem (ou 'sair' para encerrar):\n")

    ChatLoop(BotAgent)