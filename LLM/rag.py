from .Embedding import Embedding

class Rag:
    def __init__(self, embedding_service: Embedding):
        self.embedding = embedding_service

    def SearchContext(self, query: str):
        """Busca os trechos relevantes no VoltsManagerAI (JSONs/DB)"""
        pass