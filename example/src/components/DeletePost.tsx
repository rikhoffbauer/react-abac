import * as React from "react";
import { AllowedTo } from "react-abac";

import { Permission } from "../config/abac";
import { Post } from "../models/Post";
import { findUserById } from "../models/User";
import CodeBlock from "./CodeBlock";

interface Props {
    post: Post;
}

const code = `<AllowedTo
    perform={Permission.DELETE_POST}
    no={() => <div style={{ color: "red" }}>Not allowed to delete post</div>}
    data={post}
>
    <div>
        You are <b>allowed</b> to delete post owned by{" "}
        <b>{findUserById(post.owner).name}</b>
    </div>
</AllowedTo>`;

const DeletePost = ({ post }: Props) => (
    <div>
        <h2>Delete post</h2>
        <AllowedTo
            perform={Permission.DELETE_POST}
            no={() => (
                <div style={{ color: "red" }}>Not allowed to delete post</div>
            )}
            data={post}
        >
            <div>
                You are <b>allowed</b> to delete post owned by{" "}
                <b>{findUserById(post.owner).name}</b>
            </div>
        </AllowedTo>
        <CodeBlock>{code}</CodeBlock>
    </div>
);

export default DeletePost;
