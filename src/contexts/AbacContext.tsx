import { createContext } from "react";

export interface Context<User, Permission extends string> {
    userHasPermissions<Data>(
        permissions: Permission | Permission[],
        data?: Data,
    ): boolean;
}

const AbacContext = createContext<Context<any, any>>({
    userHasPermissions: () => {
        throw new Error(
            `You need to wrap your application with an AbacProvider.`,
        );
    },
});

export default AbacContext;
