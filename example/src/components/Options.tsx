import React from "react";
import { Post } from "../models/Post";
import { findUserById, User } from "../models/User";
import UserSelect from "./UserSelect";

interface Props {
    post: Post;
    user: User;
    setPostOwner(user: User): any;
    setUser(user: User): any;
}

const Options = ({ setUser, setPostOwner, user, post }: Props) => (
    <div>
        <h2>OPTIONS</h2>
        <p>
            Change the logged in user and the owner of the post to see what
            effect it has on the UI.
        </p>
        <table>
            <tbody>
                <tr>
                    <td>Logged in user</td>
                    <td>
                        <UserSelect value={user} onChange={setUser} />
                    </td>
                </tr>
                <tr>
                    <td />
                    <td>
                        <pre>{JSON.stringify(user, null, 4)}</pre>
                    </td>
                </tr>
                <tr>
                    <td>Post owner</td>
                    <td>
                        <UserSelect
                            value={findUserById(post.owner)}
                            onChange={setPostOwner}
                        />
                    </td>
                </tr>
                <tr>
                    <td />
                    <td>
                        <pre>{JSON.stringify(post, null, 4)}</pre>
                    </td>
                </tr>
            </tbody>
        </table>
        <hr />
    </div>
);

export default Options;
