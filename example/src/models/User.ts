import { Permission } from "../config/abac";
import { Role } from "./Role";

export interface User {
    id: number;
    name: string;
    roles: Role[];
    permissions: Permission[];
}

export const findUserById = (id: string | number) =>
    users.find(user => Number(id) === user.id) as User;

export const users: User[] = [
    {
        id: 1,
        name: "admin",
        roles: [Role.ADMIN, Role.USER],
        permissions: [],
    },
    {
        id: 2,
        name: "user",
        roles: [Role.USER],
        permissions: [],
    },
    {
        id: 3,
        name: "user2",
        roles: [Role.USER],
        permissions: [],
    },
    {
        id: 4,
        name: "user with no roles and DELETE_POST permission",
        roles: [],
        permissions: [Permission.DELETE_POST],
    },
    {
        id: 5,
        name: "user with USER role and DELETE_POST permission",
        roles: [Role.USER],
        permissions: [Permission.DELETE_POST],
    },
];
