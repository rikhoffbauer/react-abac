import React from "react";

import create, {
    AbacContextProps,
    AbacProviderProps,
    AllowedToProps,
    SecuredOptions,
} from "./create";

export * from "./utils";
export * from "./interfaces";
export {
    AbacContextProps,
    SecuredOptions,
    AllowedToProps,
    AbacProviderProps,
} from "./create";
export { create };

export const {
    AllowedTo,
    secured,
    NotAllowedTo,
    AbacContextDefaults,
    AbacProvider,
    AbacContext,
    useAbac,
} = create() as unknown as {
    AbacContextDefaults: AbacContextProps<any>;
    AbacContext: AbacContextProps<any>;
    AllowedTo: <Permission extends string>(
        props: AllowedToProps<Permission>,
    ) => JSX.Element;
    NotAllowedTo: <Permission extends string>(
        props: AllowedToProps<Permission>,
    ) => JSX.Element;
    AbacProvider: <Role extends string, Permission extends string, User>(
        props: AbacProviderProps<Role, Permission, User>,
    ) => JSX.Element;
    useAbac: <Permission extends string>() => AbacContextProps<Permission>;
    secured: <Permission extends string, Props, Data>(
        options: SecuredOptions<Permission, Props, Data>,
    ) => <T extends React.ComponentType<Props>>(Component: T) => T;
};
