import { Rules } from "../interfaces";
declare const rolesHavePermissions: <Role extends string, Permission extends string, User, Data>(rules: Rules<Role, Permission, User>, roles: Role[], permissions: Permission[], requiredPermissions: Permission | Permission[], user?: User | undefined, data?: Data | undefined) => boolean;
export default rolesHavePermissions;
