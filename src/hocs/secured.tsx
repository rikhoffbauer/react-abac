import * as React from "react";
import AllowedTo from "../components/AllowedTo";

export interface SecuredOptions<Permission extends string, Props, Data> {
    permissions: Permission[] | Permission;
    noAccess?: React.ComponentType<Props>;
    mapPropsToData?(props: Props): Data;
}

const secured = <Permission extends string, Props, Data>({
    permissions,
    noAccess: No,
    mapPropsToData,
}: SecuredOptions<Permission, Props, Data>) => <
    T extends React.ComponentType<Props>
>(
    Component: T,
): T =>
    class SecuredComponent extends React.Component<Props> {
        render() {
            const data = mapPropsToData && mapPropsToData(this.props);
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
    } as any;

export default secured;
