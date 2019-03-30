import React, { useState } from "react";
import { AbacProvider } from "react-abac";
import EditPost from "./components/EditPost";
import Intro from "./components/Intro";
import Options from "./components/Options";
import { rules } from "./config/abac";
import { Post } from "./models/Post";
import { User, users } from "./models/User";

const App = () => {
    const [post, setPost] = useState<Post>({ id: 1, owner: 1 });
    const [user, setUser] = useState(users[0]);
    const setPostOwner = (user: User) =>
        setPost(post => ({ ...post, owner: user.id }));

    return (
        <AbacProvider rules={rules} user={user} roles={user.roles}>
            <div className="App">
                <Intro />
                <Options
                    post={post}
                    user={user}
                    setPostOwner={setPostOwner}
                    setUser={setUser}
                />
                <EditPost post={post} />
            </div>
        </AbacProvider>
    );
};

export default App;
