export type AbacPredicate<User = any, Data = any> = (
    data?: Data,
    user?: User,
) => boolean | undefined;

export type RolePermissions<
    Role extends string,
    Permission extends string,
    User
> = {
    [R in Role]?: { [P in Permission]?: boolean | (AbacPredicate<User, any>) }
};
