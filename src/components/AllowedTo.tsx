import React from "react";
import { AbacContextDefaults } from "../context";

import useAbac from "../hooks/useAbac";
import ensureArray from "../utils/ensureArray";

export interface AllowedToProps<Permission extends string> {
    perform?: Permission | Permission[];
    yes?: React.ComponentType;
    no?: React.ComponentType;
    children?: React.ReactNode;
    data?: any;
}

const AllowedTo = <Permission extends string>({
    perform = [],
    children,
    yes: Yes = () => <React.Fragment>{children}</React.Fragment>,
    no: No = () => null,
    data,
}: AllowedToProps<Permission>) => {
    const ctx = useAbac();

    if (ctx === AbacContextDefaults) {
        console.error(
            `Can't render <AllowedTo />, wrap your app with an <AbacProvider />.`,
        );
        return null;
    }

    return ctx.userHasPermissions(ensureArray(perform), data) ? (
        <Yes />
    ) : (
        <No />
    );
};

export default AllowedTo;
