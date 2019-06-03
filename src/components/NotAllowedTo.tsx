import * as React from "react";
import AllowedTo, { AllowedToProps } from "./AllowedTo";

const NotAllowedTo = <Permission extends string>({
    children,
    yes = () => <React.Fragment>{children}</React.Fragment>,
    no,
    ...props
}: AllowedToProps<Permission>) => <AllowedTo no={yes} yes={no} {...props} />;

export default NotAllowedTo;
