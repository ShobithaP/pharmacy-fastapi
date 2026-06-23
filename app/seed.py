from sqlalchemy.orm import Session

from config.db import SessionLocal
from models import (
    Role,
    Permission,
    RolePermission,
)


def seed():

    db: Session = SessionLocal()

    try:

        # -----------------------
        # Roles
        # -----------------------

        roles = [
            "SUPER_ADMIN",
            "ADMIN",
            "PHARMACIST",
            "WAREHOUSE_MANAGER",
            "CUSTOMER",
        ]

        for role_name in roles:

            role = (
                db.query(Role)
                .filter(Role.name == role_name)
                .first()
            )

            if not role:
                db.add(Role(name=role_name))

        db.commit()

        # -----------------------
        # Permissions
        # -----------------------

        permissions = [
            "CREATE_MEDICINE",
            "UPDATE_MEDICINE",
            "DELETE_MEDICINE",
            "VIEW_MEDICINE",
            "SEARCH_MEDICINE",
            "PURCHASE_MEDICINE",
            "VIEW_WAREHOUSE",
            "UPDATE_WAREHOUSE",
            "MANAGE_USERS",
        ]

        for permission_name in permissions:

            permission = (
                db.query(Permission)
                .filter(Permission.name == permission_name)
                .first()
            )

            if not permission:
                db.add(Permission(name=permission_name))

        db.commit()

        roles = {
            role.name: role
            for role in db.query(Role).all()
        }

        permissions = {
            permission.name: permission
            for permission in db.query(Permission).all()
        }

        # -----------------------
        # Role Permission Mapping
        # -----------------------

        role_permissions = {

            "SUPER_ADMIN": [
                "CREATE_MEDICINE",
                "UPDATE_MEDICINE",
                "DELETE_MEDICINE",
                "VIEW_MEDICINE",
                "SEARCH_MEDICINE",
                "PURCHASE_MEDICINE",
                "VIEW_WAREHOUSE",
                "UPDATE_WAREHOUSE",
                "MANAGE_USERS",
            ],

            "ADMIN": [
                "CREATE_MEDICINE",
                "UPDATE_MEDICINE",
                "DELETE_MEDICINE",
                "VIEW_MEDICINE",
                "SEARCH_MEDICINE",
                "PURCHASE_MEDICINE",
                "VIEW_WAREHOUSE",
                "UPDATE_WAREHOUSE",
                "MANAGE_USERS",
            ],

            "PHARMACIST": [
                "VIEW_MEDICINE",
                "SEARCH_MEDICINE",
                "PURCHASE_MEDICINE",
            ],

            "WAREHOUSE_MANAGER": [
                "VIEW_MEDICINE",
                "SEARCH_MEDICINE",
                "VIEW_WAREHOUSE",
                "UPDATE_WAREHOUSE",
            ],

            "CUSTOMER": [
                "VIEW_MEDICINE",
                "SEARCH_MEDICINE",
                "PURCHASE_MEDICINE",
            ],
        }

        for role_name, permission_list in role_permissions.items():

            role = roles[role_name]

            for permission_name in permission_list:

                permission = permissions[permission_name]

                exists = (
                    db.query(RolePermission)
                    .filter(
                        RolePermission.role_id == role.id,
                        RolePermission.permission_id == permission.id,
                    )
                    .first()
                )

                if not exists:

                    db.add(
                        RolePermission(
                            role_id=role.id,
                            permission_id=permission.id,
                        )
                    )

        db.commit()

        print("Database seeded successfully.")

    finally:
        db.close()


if __name__ == "__main__":
    seed()