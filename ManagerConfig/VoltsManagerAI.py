import json
import os

class VoltsManagerAI:
    nome: str
    versao: str
    criador: str
    github: str
    papel: str
    instrucoes_sistema: str
    
    def __init__(self, config_file: str = "agente.json"):
        base_path = os.path.dirname(__file__)
        config_path = os.path.join(base_path, config_file)
        
        with open(config_path, "r", encoding="utf-8") as f:
            self.data = json.load(f) # <-- Salva no self.data!

        # Seta nos atributos da classe, para consulta dinamica.
        self.nome = self.data.get("nome", "")
        self.versao = self.data.get("versao", "")
        self.criador = self.data.get("criador", "")
        self.github = self.data.get("github", "")
        self.papel = self.data.get("papel", "")
        self.instrucoes_sistema = self.data.get("instrucoes_sistema", "")
        
    def CarregaAgenteAI(self) -> dict:
        return self.data
    
    def CarregaPoliticas(self, config_file: str = "politicas.json") -> dict:
            base_path = os.path.dirname(__file__)
            config_path = os.path.join(base_path, config_file)
            
            with open(config_path, "r", encoding="utf-8") as f:
                self.politicas = json.load(f)
                
            return self.politicas