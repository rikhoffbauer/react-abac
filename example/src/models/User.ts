import { Role } from "./Role";

export interface User {
    id: number;
    name: string;
    roles: Role[];
}

export const findUserById = (id: string | number) =>
    users.find(user => Number(id) === user.id) as User;

export const users: User[] = [
    {
        id: 1,
        name: "admin",
        roles: [Role.ADMIN, Role.USER],
    },
    {
        id: 2,
        name: "user",
        roles: [Role.USER],
    },
    {
        id: 3,
        name: "user2",
        roles: [Role.USER],
    },
];
