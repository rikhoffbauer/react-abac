import React from "react";

import AbacContext from "../contexts/AbacContext";
import { RolePermissions } from "../interfaces";
import rolesHavePermissions from "../utils/rolesHavePermissions";

interface RbacProviderProps<
    Role extends string,
    Permission extends string,
    User
> {
    rules: RolePermissions<Role, Permission, User>;
    children?: React.ReactNode;
    getUser(): User;
    getRoles(user: User): Role[];
}

const AbacProvider = <Role extends string, Permission extends string, User>({
    children,
    rules,
    getRoles,
    getUser,
}: RbacProviderProps<Role, Permission, User>) => {
    const user = getUser();

    const userHasPermissions = (
        permissions: Permission | Permission[],
        data: any,
    ) => rolesHavePermissions(rules, getRoles(user), permissions, data, user);

    return (
        <AbacContext.Provider value={{ userHasPermissions }}>
            {children}
        </AbacContext.Provider>
    );
};

export default AbacProvider;
