export type AbacPredicate<User = any, Data = any> = (
    data: Data | undefined,
    user: User | undefined,
) => boolean | undefined;

export type Rules<Role extends string, Permission extends string, User> = {
    [R in Role]?: PermissionMap<Permission, User>;
} &
    PermissionMap<Permission, User>;

export type PermissionMap<Permission extends string, User> = {
    [P in Permission]?: Rule<User, any>;
};

export type Rule<User, Data> = boolean | AbacPredicate<User, Data>;
