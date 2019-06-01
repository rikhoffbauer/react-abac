import { createContext } from "react";

export interface AbacContextProps<Permission extends string> {
    userHasPermissions<Data>(
        permissions: Permission | Permission[],
        data?: Data,
    ): boolean;
}

export const AbacContextDefaults = {
    userHasPermissions: () => {
        console.error(
            `Can't call userHasPermissions, wrap your app with an <AbacProvider />.`,
        );
        return false;
    },
};

const AbacContext = createContext<AbacContextProps<any>>(AbacContextDefaults);

export default AbacContext;
