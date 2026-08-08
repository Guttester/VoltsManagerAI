# ==============================================================================
# -------------------------> Configuração do Sistema <--------------------------
# ==============================================================================

-- #1 - Criar ambiente python.
--   + python -m venv .venv
-- 
-- #2 - Ativar ambiente virtual.
--   + source .venv/bin/activate ( or ) .\.venv\Scripts\activate
-- 
-- #3 - Instalar depedências dentro do arquivo requeriments.
--   + pip install -r requirements.txt
-- 



[fastApi.py (OWASP / Endpoints)] 
       │
       ▼
   [main.py (Orquestrador)]
       │
       ├─► [security.py (Validações de entrada/saída)]
       │
       └─► [LLM/llm.py (Geração de texto)]
                │
                └─► [LLM/rag.py (Vetores / Embeddings)]
                         │
                         └─► [AgenteAI/VoltsManagerAI.py (Prompts / Regras)]