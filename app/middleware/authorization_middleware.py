from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware


ROLE_MAPPING = {

    "/users": [
        "SUPER_ADMIN",
        "ADMIN"
    ],

    "/medicines": [
        "SUPER_ADMIN",
        "ADMIN",
        "PHARMACIST"
    ],

    "/warehouse-stock": [
        "SUPER_ADMIN",
        "WAREHOUSE_MANAGER"
    ],

    "/orders": [
        "SUPER_ADMIN",
        "PHARMACIST",
        "CUSTOMER",
        "WAREHOUSE_MANAGER"
    ]

}


class AuthorizationMiddleware(
    BaseHTTPMiddleware
):

    async def dispatch(
        self,
        request,
        call_next
    ):

        user = getattr(
            request.state,
            "user",
            None
        )

        if not user:
            return await call_next(
                request
            )

        path = request.url.path

        for route, roles in (
            ROLE_MAPPING.items()
        ):

            if path.startswith(route):

                role_name = (
                    user.role.name.upper()
                )

                if role_name not in roles:

                    return JSONResponse(
                        status_code=403,
                        content={
                            "detail":
                            "Access denied"
                        }
                    )

        return await call_next(
            request
        )