from sentence_transformers import SentenceTransformer

class Embedding:

    def __init__(self):
        self.model = SentenceTransformer(
            "sentence-transformers/all-MiniLM-L6-v2"
        )

    def GetEmbedding(self, text: str):
        """Gera o vetor de embedding do texto."""
        return self.model.encode(text)