import { Rule } from "../interfaces";

const evaluateRule = <User, Data>(
    rule: Rule<User, Data>,
    user?: User,
    data?: Data,
) => {
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

export default evaluateRule;
