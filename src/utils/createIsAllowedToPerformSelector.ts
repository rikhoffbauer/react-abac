import { rolesHavePermissions } from "../index";
import { RolePermissions } from "../interfaces";

const createIsAllowedToPerformSelector = <
    State,
    User,
    Role extends string,
    Permission extends string
>(
    rules: RolePermissions<Role, Permission, User>,
    userSelector: (state: State) => User | undefined,
    getRoles: (user?: User) => Role[],
) => (state: State) => <T = any>(
    permissions?: Permission | Permission[],
    data?: T,
) => {
    const user = userSelector(state);
    const roles = getRoles(user);

    return rolesHavePermissions(rules, roles, permissions, data);
};

export default createIsAllowedToPerformSelector;
