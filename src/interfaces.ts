export type AbacPredicate<User = any, Data = any> = (
    data?: Data,
    user?: User,
) => boolean | undefined;

export type Rules<Role extends string, Permission extends string, User> = {
    [R in Role]?: RolePermissions<Permission, User>
};

export type RolePermissions<Permission extends string, User> = {
    [P in Permission]?: Rule<User, any>
};

export type Rule<User, Data> = boolean | (AbacPredicate<User, Data>);
