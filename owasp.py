import os
from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware


def configure_security(app):
    hosts = os.getenv("ALLOWED_HOSTS", "*").split(",")
    origins = os.getenv("ALLOW_ORIGINS", "*").split(",")

    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=hosts
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["GET", "POST"],
        allow_headers=["Content-Type"],
    )


async def security_headers(request: Request, call_next):
    if request.method in {"POST", "PUT", "PATCH"}:
        content_length = request.headers.get("content-length")

        if content_length and int(content_length) > 65536:
            return JSONResponse(
                status_code=413,
                content={"detail": "Requisição muito grande."}
            )

    response = await call_next(request)

    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = (
        "camera=(), microphone=(), geolocation=()"
    )

    return response