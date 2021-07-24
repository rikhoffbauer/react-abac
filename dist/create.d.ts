import React from "react";
import { Rules } from "./interfaces";
export interface AbacProviderProps<Role extends string, Permission extends string, User> {
    rules: Rules<Role, Permission, User>;
    children?: React.ReactNode;
    user?: User;
    roles?: Role[];
    permissions?: Permission[];
}
export interface AbacContextProps<Permission extends string> {
    userHasPermissions<Data>(permissions: Permission | Permission[], data?: Data): boolean;
}
export interface AllowedToProps<Permission extends string> {
    perform?: Permission | Permission[];
    yes?: React.ComponentType;
    no?: React.ComponentType;
    children?: React.ReactNode;
    data?: any;
}
export interface SecuredOptions<Permission extends string, Props, Data> {
    permissions: Permission[] | Permission;
    noAccess?: React.ComponentType<Props>;
    mapPropsToData?(props: Props): Data;
}
declare const create: <Role extends string, Permission extends string, User>() => {
    AbacProvider: ({ children, rules, roles, permissions, user, }: AbacProviderProps<Role, Permission, User>) => JSX.Element;
    AllowedTo: ({ perform, children, yes: Yes, no: No, data, }: AllowedToProps<Permission>) => JSX.Element | null;
    AbacContext: React.Context<AbacContextProps<Permission>>;
    NotAllowedTo: ({ children, yes, no, ...props }: AllowedToProps<Permission>) => JSX.Element;
    AbacContextDefaults: {
        userHasPermissions: () => boolean;
    };
    secured: <Props, Data>({ permissions, noAccess: No, mapPropsToData, }: SecuredOptions<Permission, Props, Data>) => <T extends React.ComponentType<Props>>(Component: T) => T;
    useAbac: () => AbacContextProps<Permission>;
};
export default create;
