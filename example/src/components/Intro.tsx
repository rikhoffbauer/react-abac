import React from "react";
import CodeBlock from "./CodeBlock";

const code = `export enum Role {
    ADMIN = "ADMIN",
    USER = "USER",
}

export enum Permission {
    EDIT_POST = "EDIT_POST",
    DELETE_POST = "DELETE_POST",
}

export const rules = {
    [Role.ADMIN]: {
        // 1. admins can edit all posts
        [Permission.EDIT_POST]: true,
        // 2. admins can delete all posts
        [Permission.DELETE_POST]: true,
    },
    [Role.USER]: {
        // 3. normal users can edit their own posts
        [Permission.EDIT_POST]: (post: Post, user?: User) =>
            user && post.owner === user.id,
    },
    // 4. users with the DELETE_POST permission can delete their own posts
    [Permission.DELETE_POST]: (post: Post, user?: User) =>
        user && post.owner === user.id,
};
`;

const Intro = () => (
    <div>
        <h1>react-abac example</h1>
        <hr />
        <p>
            This example demonstrates the abac and rbac capabilities of the
            library.
        </p>
        <p>It implements four permission rules:</p>
        <ol>
            <li>admins can edit all posts (rbac)</li>
            <li>admins can delete all posts (rbac)</li>
            <li>normal users can only edit their own posts (abac)</li>
            <li>
                users with the DELETE_POST permission can delete their own posts
                (abac)
            </li>
        </ol>
        <CodeBlock>{code}</CodeBlock>
    </div>
);

export default Intro;
