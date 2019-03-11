import { RolePermissions } from "../interfaces";
import roleHasPermission from "./roleHasPermissions";

const rolesHavePermissions = <
    Role extends string,
    Permission extends string,
    User,
    Data
>(
    rules: RolePermissions<Role, Permission, User>,
    roles: Role[],
    permission: Permission | Permission[] = [],
    data?: Data,
    user?: User,
) =>
    // for *every* required permission
    (Array.isArray(permission) ? permission : [permission]).every(permission =>
        // check that *some* role that permission
        roles.some(role =>
            roleHasPermission(rules, role, permission, data, user),
        ),
    );

export default rolesHavePermissions;
