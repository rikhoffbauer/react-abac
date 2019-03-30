import { Rules } from "../interfaces";

const roleHasPermission = <
    Role extends string,
    Permission extends string,
    User,
    Data
>(
    rules: Rules<Role, Permission, User>,
    role: Role,
    permission: Permission,
    user?: User,
    data?: Data,
) => {
    if (!(role in rules)) {
        // no rules defined for role
        return false;
    }

    // rule for the provided permission for the provided role
    const rule = rules[role][permission as any]; // true, false or (data, user) => boolean

    if (!rule) {
        // role is not permitted to perform the provided action/permission,
        // permission not present
        return false;
    }

    if (typeof rule === "function") {
        // ABAC rule, use a predicate to determine if the user is allowed access
        return Boolean(rule(data, user));
    }

    // rule is truthy, role has permission
    return true;
};

export default roleHasPermission;
