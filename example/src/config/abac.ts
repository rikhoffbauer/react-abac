import { Post } from "../models/Post";
import { Role } from "../models/Role";
import { User } from "../models/User";

export enum Permission {
    EDIT_POST = "EDIT_POST",
    DELETE_POST = "DELETE_POST",
}

export const rules = {
    [Role.ADMIN]: {
        [Permission.EDIT_POST]: true,
        [Permission.DELETE_POST]: true,
    },
    [Role.USER]: {
        [Permission.EDIT_POST]: (post: Post, user?: User) =>
            user && post.owner === user.id,
    },
    [Permission.DELETE_POST]: (post: Post, user?: User) =>
        user && post.owner === user.id,
};
