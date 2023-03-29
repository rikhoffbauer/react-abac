import { Rules } from "../interfaces";
import evaluateRule from "./evaluateRule";

const roleHasPermission = <
    Role extends string,
    Permission extends string,
    User,
    Data,
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
    // true, false or (data, user) => boolean
   const rule = (rules[role] as Record<Permission, any>)[permission];

    return evaluateRule(rule, user, data);
};

export default roleHasPermission;
