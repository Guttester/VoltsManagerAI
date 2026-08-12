import os
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()

base_dir = os.path.dirname(os.path.abspath(__file__))
front_dir = os.path.join(base_dir, "Front")

# Monta a pasta Front para carregar CSS/JS estáticos
app.mount("/static", StaticFiles(directory=front_dir), name="static")

@app.get("/")
def read_root():
    return FileResponse(os.path.join(front_dir, "index.html"))