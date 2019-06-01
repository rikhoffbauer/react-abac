import { createContext } from "react";

export interface AbacContextProps<Permission extends string> {
    userHasPermissions<Data>(
        permissions: Permission | Permission[],
        data?: Data,
    ): boolean;
}

const AbacContext = createContext<AbacContextProps<any>>({
    userHasPermissions: () => {
        console.error(
            `Can't call userHasPermissions, wrap your app with an <AbacProvider />.`,
        );
        return false;
    },
});

export default AbacContext;
