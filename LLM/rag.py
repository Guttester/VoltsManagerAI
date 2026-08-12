from .Embedding import Embedding
from ManagerConfig.VoltsManagerAI import VoltsManagerAI

class Rag:
    def __init__(self, embedding_service: Embedding):
        self.embedding = embedding_service  # Sem a vírgula no final!
        self.manager = VoltsManagerAI()

    def SearchContext(self, query: str) -> str:
        """Busca os dados relevantes dos JSONs para montar o contexto textual."""
        agente_data = self.manager.CarregaAgenteAI()
        #politicas_data = self.manager.CarregaPoliticas()

        # Monta um contexto em texto legível para o LLM
        contexto_texto = (
            f"Instruções do Agente: {agente_data.get('instrucoes_sistema')}\n"
            f"Papel: {agente_data.get('papel')}\n"
            #f"Políticas: {politicas_data}"
        )
        return contexto_texto