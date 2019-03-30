import React from "react";

const Intro = () => (
    <div>
        <h1>react-abac example</h1>
        <hr />
        <p>
            This example demonstrates the abac and rbac capabilities of the
            library.
        </p>
        <p>
            It implements two permission rules:
            <ul>
                <li>admins can edit all posts (rbac)</li>
                <li>normal users can only edit their own posts (abac)</li>
            </ul>
        </p>
    </div>
);

export default Intro;
