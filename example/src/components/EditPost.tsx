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
    perform={Permission.EDIT_POST}
    no={() => <div style={{ color: "red" }}>Not allowed to edit post</div>}
    data={post}
>
    <div>
        You are <b>allowed</b> to edit post owned by{" "}
        <b>{findUserById(post.owner).name}</b>
    </div>
</AllowedTo>`;

const EditPost = ({ post }: Props) => (
    <div>
        <h2>Edit post</h2>
        <AllowedTo
            perform={Permission.EDIT_POST}
            no={() => (
                <div style={{ color: "red" }}>Not allowed to edit post</div>
            )}
            data={post}
        >
            <div>
                You are <b>allowed</b> to edit post owned by{" "}
                <b>{findUserById(post.owner).name}</b>
            </div>
        </AllowedTo>
        <CodeBlock>{code}</CodeBlock>
    </div>
);

export default EditPost;
