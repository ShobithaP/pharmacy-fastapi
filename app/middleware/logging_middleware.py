import time
import logging

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware


logging.basicConfig(
    level=logging.INFO,
    format=(
        "%(asctime)s | "
        "%(levelname)s | "
        "%(message)s"
    )
)

logger = logging.getLogger(
    "pharmacy_logger"
)

request_count = {}


class LoggingMiddleware(
    BaseHTTPMiddleware
):

    async def dispatch(
        self,
        request: Request,
        call_next
    ):

        start_time = time.time()

        path = request.url.path

        request_count[path] = (
            request_count.get(path, 0) + 1
        )

        try:

            response = await call_next(
                request
            )

            process_time = round(
                time.time() - start_time,
                4
            )

            user = getattr(
                request.state,
                "user",
                None
            )

            username = (
                user.username
                if user
                else "Anonymous"
            )

            role = (
                user.role.name
                if user and user.role
                else "N/A"
            )

            logger.info(
                f"""
USER={username}
ROLE={role}
METHOD={request.method}
PATH={path}
STATUS={response.status_code}
TIME={process_time}s
COUNT={request_count[path]}
"""
            )

            return response

        except Exception as e:

            logger.exception(
                f"""
ERROR OCCURRED

METHOD={request.method}
PATH={path}
MESSAGE={str(e)}
COUNT={request_count[path]}
"""
            )

            raise