import React, { createContext, useContext } from "react";

import { Rules } from "./interfaces";
import ensureArray from "./utils/ensureArray";
import rolesHavePermissions from "./utils/rolesHavePermissions";

export interface AbacProviderProps<
    Role extends string,
    Permission extends string,
    User,
> {
    rules: Rules<Role, Permission, User>;
    children?: React.ReactNode;
    user?: User;
    roles?: Role[];
    permissions?: Permission[];
}

export interface AbacContextProps<Permission extends string> {
    userHasPermissions: <Data>(
        permissions: Permission | Permission[],
        data?: Data,
    ) => boolean;
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

const create = <Role extends string, Permission extends string, User>() => {
    const AbacContextDefaults = {
        userHasPermissions: () => {
            console.error(
                `Can't call userHasPermissions, wrap your app with an <AbacProvider />.`,
            );
            return false;
        },
    };

    const AbacContext =
        createContext<AbacContextProps<Permission>>(AbacContextDefaults);

    const AbacProvider = ({
        children,
        rules,
        roles = [],
        permissions = [],
        user,
    }: AbacProviderProps<Role, Permission, User>) => {
        const userHasPermissions = (
            requiredPermissions: Permission[] | Permission,
            data: any,
        ) =>
            rolesHavePermissions(
                rules,
                roles,
                permissions,
                requiredPermissions,
                user,
                data,
            );

        return (
            <AbacContext.Provider value={{ userHasPermissions }}>
                {children}
            </AbacContext.Provider>
        );
    };

    const AllowedTo = ({
        perform = [],
        children,
        yes: Yes,
        no: No,
        data,
    }: AllowedToProps<Permission>) => {
        const ctx = useAbac();

        if (ctx === AbacContextDefaults) {
            console.error(
                `Can't render <AllowedTo />, wrap your app with an <AbacProvider />.`,
            );
            return null;
        }

        if (ctx.userHasPermissions(ensureArray(perform), data)) {
            return Yes ? <Yes /> : <React.Fragment>{children}</React.Fragment>;
        }

        return No ? <No /> : null;
    };

    const NotAllowedTo = ({
        perform = [],
        children,
        yes: Yes,
        no: No,
        data,
    }: AllowedToProps<Permission>) => {
        const ctx = useAbac();

        if (ctx === AbacContextDefaults) {
            console.error(
                `Can't render <AllowedTo />, wrap your app with an <AbacProvider />.`,
            );
            return null;
        }

        if (!ctx.userHasPermissions(ensureArray(perform), data)) {
            return Yes ? <Yes /> : <React.Fragment>{children}</React.Fragment>;
        }

        return No ? <No /> : null;
    };

    const secured =
        <Props, Data>({
            permissions,
            noAccess: No,
            mapPropsToData,
        }: SecuredOptions<Permission, Props, Data>) =>
        <T extends React.ComponentType<Props>>(Component: T): T =>
            Object.assign(
                class SecuredComponent extends React.Component<Props> {
                    render() {
                        const data =
                            mapPropsToData && mapPropsToData(this.props);
                        // TODO figure out why we need to cast this to any
                        const C: any = Component;

                        return (
                            <AllowedTo
                                perform={permissions}
                                no={No && (() => <No {...this.props} />)}
                                yes={() => <C {...this.props} />}
                                data={data}
                            />
                        );
                    }
                } as any,
                Component,
            );

    const useAbac = () => useContext(AbacContext);

    return {
        AbacProvider,
        AllowedTo,
        AbacContext,
        NotAllowedTo,
        AbacContextDefaults,
        secured,
        useAbac,
    };
};

export default create;
