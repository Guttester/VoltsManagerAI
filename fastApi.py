import os
import asyncio
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from LLM.llm import LLM

# Imports do Rate Limit (slowapi)
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Inicialização da instância da arquitetura do LLM
llm_agent = LLM()
llm_semaphore = asyncio.Semaphore(1)

# Configuração do Rate Limiter por IP
limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# 1. Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Substitua pelo domínio em produção
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    history: list = []

base_dir = os.path.dirname(os.path.abspath(__file__))
front_dir = os.path.join(base_dir, "Front")

@app.get("/")
def read_root():
    return FileResponse(os.path.join(front_dir, "index.html"))

@app.post("/api/chat")
@limiter.limit("2/30seconds")
async def chat_endpoint(request: Request, payload: ChatRequest):
    user_msg = payload.message
    
    # Controle de concorrência global (Fila):
    # Garante que apenas 1 requisição processe o LLM por vez, evitando 
    # o gargalo de CPU/RAM em servidores VPS com poucos vCores.
    # 
    # Nota: Se no futuro a infraestrutura contar com um gerenciador de filas externo 
    # (ex: Redis/Celery/RabbitMQ), remova este 'async with' e chame a task diretamente.
    async with llm_semaphore:
        resposta = await asyncio.to_thread(llm_agent.GerateChat, prompt=user_msg)
        
    return {"reply": resposta}

if os.path.exists(front_dir):
    app.mount("/static", StaticFiles(directory=front_dir), name="static")