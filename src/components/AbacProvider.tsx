import React from "react";

import AbacContext from "../context";
import { Rules } from "../interfaces";
import rolesHavePermissions from "../utils/rolesHavePermissions";

interface Props<Role extends string, Permission extends string, User> {
    rules: Rules<Role, Permission, User>;
    children?: React.ReactNode;
    user?: User;
    roles?: Role[];
}

export const AbacProvider = <
    Role extends string,
    Permission extends string,
    User
>({
    children,
    rules,
    roles = [],
    user,
}: Props<Role, Permission, User>) => {
    const userHasPermissions = (permissions: Permission[], data: any) =>
        rolesHavePermissions(rules, roles, permissions, user, data);

    return (
        <AbacContext.Provider value={{ userHasPermissions }}>
            {children}
        </AbacContext.Provider>
    );
};

export default AbacProvider;
