import { createContext } from "react";

export interface Context<Permission extends string> {
    userHasPermissions<Data>(
        permissions: Permission | Permission[],
        data?: Data,
    ): boolean;
}

const AbacContext = createContext<Context<any>>({
    userHasPermissions: () => {
        throw new Error(`Wrap your app with an AbacProvider.`);
    },
});

export default AbacContext;
