import { Rules } from "../interfaces";
import roleHasPermission from "./roleHasPermissions";

const rolesHavePermissions = <
    Role extends string,
    Permission extends string,
    User,
    Data
>(
    rules: Rules<Role, Permission, User>,
    roles: Role[],
    permissions: Permission[],
    user?: User,
    data?: Data,
) =>
    // for *every* required permission
    permissions.every(permission =>
        // check that *some* role has that permission
        roles.some(role =>
            roleHasPermission(rules, role, permission, user, data),
        ),
    );

export default rolesHavePermissions;
