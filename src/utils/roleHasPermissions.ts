import { RolePermissions } from "../interfaces";

const roleHasPermission = <
    Role extends string,
    Permission extends string,
    User,
    Data
>(
    rules: RolePermissions<Role, Permission, User>,
    role: Role,
    permission: Permission,
    data?: Data,
    user?: User,
) => {
    // Permission of the provided role
    const roleRules = rules[role] || {};

    if (!roleRules) {
        // no rules defined for role
        return false;
    }

    // rule for the provided permission for the provided role
    const rule = (roleRules as any)[permission]; // true, false or (data, user) => boolean

    if (!rule) {
        // role is not permitted to perform the provided action/permission
        return false;
    }

    if (typeof rule === "function") {
        // ABAC permission, predicate that determines if user is permitted access
        return rule(data, user);
    }

    // rule is truthy, role has permission
    return true;
};

export default roleHasPermission;
