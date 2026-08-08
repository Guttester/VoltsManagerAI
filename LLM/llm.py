import os
from pathlib import Path
from dotenv import load_dotenv
from llama_cpp import Llama

BaseDir = Path(__file__).resolve().parent.parent
load_dotenv(BaseDir / ".env")

class LLM:
    def __init__(self):
        self.Model= None
        MODELnome = os.getenv("ModelNome")
        self.__ModelPath = BaseDir / "Model" / MODELnome if MODELnome else None

        if not self.__ModelPath or not self.__ModelPath.exists():
            raise FileNotFoundError(f"Erro no .env: O modelo '{MODELnome}' não foi encontrado em: {self.ModelPath}")

    def GetModelPath(self):
        obj= self.__ModelPath
        return obj
    
    def LoadModel(self, nThreads: int = 4):
            n_ctx = int(os.getenv("ModelContext", 2048))
            self.Model = Llama(
                model_path=str(self.__ModelPath),
                n_ctx=n_ctx,
                n_threads=nThreads,
                verbose=False
            )
    
    def GerateChat(self, prompt: str) -> str:
        """Gera a resposta do modelo a partir de um prompt."""
        if not self.Model:
            self.LoadModel()

        MaxTokens = int(os.getenv("ModelMaxToken", 512))
        Temperature = float(os.getenv("ModelTemperature", 0.7))

        PromptInjetor = f"<|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n"

        response = self.Model(
            PromptInjetor,
            max_tokens= MaxTokens,
            temperature= Temperature,
            stop=["<|eot_id|>"]
        )

        return response["choices"][0]["text"].strip()