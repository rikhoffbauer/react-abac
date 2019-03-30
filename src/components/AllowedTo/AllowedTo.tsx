import React from "react";

import useAbac from "../../hooks/useAbac";
import ensureArray from "../../utils/ensureArray";

interface AllowedToProps<Permission extends string> {
    perform?: Permission | Permission[];
    yes?: () => JSX.Element | null;
    no?: () => JSX.Element | null;
    children?: React.ReactNode;
    data?: any;
}

export const AllowedTo = <Permission extends string>({
    perform = [],
    children,
    yes = () => <React.Fragment>{children}</React.Fragment>,
    no = () => null,
    data,
}: AllowedToProps<Permission>) => {
    const { userHasPermissions } = useAbac();

    return userHasPermissions(ensureArray(perform), data) ? yes() : no();
};

export default AllowedTo;
