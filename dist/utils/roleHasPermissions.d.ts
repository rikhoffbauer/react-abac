import { Rules } from "../interfaces";
declare const roleHasPermission: <Role extends string, Permission extends string, User, Data>(rules: Rules<Role, Permission, User>, role: Role, permission: Permission, user?: User | undefined, data?: Data | undefined) => boolean;
export default roleHasPermission;
