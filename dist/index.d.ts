import React from "react";
import { AbacContextProps, AbacProviderProps, AllowedToProps, SecuredOptions } from "./create";
export * from "./utils";
export * from "./interfaces";
export { AbacContextProps, SecuredOptions, AllowedToProps, AbacProviderProps, default as create, } from "./create";
export declare const AllowedTo: <Permission extends string>(props: AllowedToProps<Permission>) => JSX.Element, secured: <Permission extends string, Props, Data>(options: SecuredOptions<Permission, Props, Data>) => <T extends React.ComponentType<Props>>(Component: T) => T, NotAllowedTo: <Permission extends string>(props: AllowedToProps<Permission>) => JSX.Element, AbacContextDefaults: AbacContextProps<any>, AbacProvider: <Role extends string, Permission extends string, User>(props: AbacProviderProps<Role, Permission, User>) => JSX.Element, AbacContext: AbacContextProps<any>, useAbac: <Permission extends string>() => AbacContextProps<Permission>;
