# ==============================================================================
#  Projeto: VoltsManagerAI
#  Versão: 0.0.1
#  Contexto: Agente de IA integrado ao Volt’s Manager, projetado para atuar como um 
#            assistente inteligente no gerenciamento de produtos. Ele automatiza 
#            consultas, auxilia no suporte operacional e otimiza a interação com a 
#            aplicação, simulando a atuação de um agente de IA em um ambiente real de
#            produção.
#
#  Licença: MIT License (Copyright)
# ==============================================================================
# ---------------------------------> Notas <------------------------------------
# ==============================================================================
--
-- [+] main.py: Serve para executar o fluxo sem subir o servidor.
-- [+] Model: Baixar modelo conforme VPS, estrutura do vCore da máquina e capacidade.
-- [+] politicas.json: Você adiciona politicas de segurança
-- [+] Pode ser substituído por API Keys (Azure/AWS) ou configurações no .env.
--
# ==============================================================================
# -------------------------> Configuração do Sistema <--------------------------
# ==============================================================================
--
-- #1 - Criar ambiente python.
--   + python -m venv .venv
-- 
-- #2 - Ativar ambiente virtual.
--   + source .venv/bin/activate ( or ) .\.venv\Scripts\activate
-- 
-- #3 - Instalar dependências dentro do arquivo requeriments.
--   + pip install -r requeriments.txt
-- 
-- #4 - Executar serviço.
--   + uvicorn fastApi:app --reload
--
[Front (Index,Style,Script)]
-- │
-- ▼
[fastApi.py (API / Rate Limit / Endpoints)]
--     │
--     ├─► [owasp.py (Segurança / CORS / Headers)]
--     │
--     └─► [LLM/llm.py (Geração de Texto / Orquestrador Llama)]
--             │
--             ├─► [Model/Llama-3.2-3B-Instruct-Q4_K_M.gguf (Modelo AI)]
--             │
--             ├─► [LLM/Embedding.py (Vetores / SentenceTransformer)]
--             │
--             └─► [LLM/rag.py (Montagem de Contexto RAG)]
--                     │
--                     └─► [ManagerConfig/VoltsManagerAI.py (Carrega JSONs / Prompts)]