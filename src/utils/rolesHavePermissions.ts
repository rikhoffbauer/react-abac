import { AbacPredicate, Rules } from "../interfaces";
import ensureArray from "./ensureArray";
import roleHasPermission from "./roleHasPermissions";

const rolesHavePermissions = <
    Role extends string,
    Permission extends string,
    User,
    Data,
>(
    rules: Rules<Role, Permission, User>,
    roles: Role[],
    permissions: Permission[],
    requiredPermissions: Permission[] | Permission,
    user?: User,
    data?: Data,
) =>
    // for *every* required permission
    ensureArray(requiredPermissions).every(
        permission =>
            // check that *some* role has that permission
            roles.some(role =>
                roleHasPermission(rules, role, permission, user, data),
            ) ||
            // or this specific permission is granted
            Boolean(
                permissions.includes(permission)
                    ? typeof rules[permission] === "function"
                        ? // is abac permission
                          (rules[permission] as AbacPredicate<User, Data>)(
                              data,
                              user,
                          )
                        : // permission doesn't need a predicate
                          true
                    : // permission not included
                      false,
            ),
    );

export default rolesHavePermissions;
