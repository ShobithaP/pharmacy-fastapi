import time
import logging

from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from config.db import SessionLocal


from models import User


logger = logging.getLogger("auth_middleware")


class AuthenticationMiddleware(
    BaseHTTPMiddleware
):

    async def dispatch(
        self,
        request,
        call_next
    ):

        start_time = time.time()

        public_routes = [
            "/login",
            "/register",
            "/docs",
            "/openapi.json",
            "/redoc"
        ]

        path = request.url.path

        if path in public_routes:

            response = await call_next(
                request
            )

            return response

        auth_header = request.headers.get(
            "Authorization"
        )

        if (
            not auth_header or
            not auth_header.startswith(
                "Bearer "
            )
        ):

            logger.warning(
                f"UNAUTHORIZED ACCESS | PATH={path}"
            )

            return JSONResponse(
                status_code=401,
                content={
                    "detail":
                    "Authentication required"
                }
            )

        token = auth_header.split(
            " "
        )[1]

        db = SessionLocal()

        try:

            payload = decode_access_token(
                token
            )

            username = payload.get(
                "sub"
            )

            user = (
                db.query(User)
                .filter(
                    User.username ==
                    username
                )
                .first()
            )

            if not user:

                logger.warning(
                    f"USER NOT FOUND | USER={username}"
                )

                return JSONResponse(
                    status_code=401,
                    content={
                        "detail":
                        "User not found"
                    }
                )

            request.state.user = user

            response = await call_next(
                request
            )

            process_time = round(
                time.time() - start_time,
                4
            )

            logger.info(
                f"""
USER={user.username}
ROLE={user.role.name}
METHOD={request.method}
PATH={path}
STATUS={response.status_code}
TIME={process_time}s
"""
            )

            return response

        except Exception as e:

            logger.exception(
                f"""
AUTH ERROR
PATH={path}
ERROR={str(e)}
"""
            )

            return JSONResponse(
                status_code=401,
                content={
                    "detail":
                    "Invalid token"
                }
            )

        finally:

            db.close()