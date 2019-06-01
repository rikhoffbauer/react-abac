# react-abac

Attribute Based Access Control and Role Based Access Control for React.

## Installing

```
npm install react-abac
```

## Usage

```typescript jsx
import * as React from "react";
import { AbacProvider, AllowedTo } from "react-abac";

interface User {
    uuid: string;
    roles: Role[];
    permissions: permissions[];
}

interface Post {
    owner: string; // user uuid
}

// an object with all permissions
enum permissions {
    EDIT_POST = "EDIT_POST",
}

enum Role {
    ADMIN = "ADMIN",
    USER = "USER",
}

// rules describing what roles have what permissions
const rules = {
    [Role.ADMIN]: {
        [permissions.EDIT_POST]: true,
    },
    [Role.USER]: {
        // an abac rule
        // user can only edit the post if it is the owner of it
        [permissions.EDIT_POST]: (post, user) => post.owner === user.uuid,
    },
};

interface Props {
    user: User;
    post: Post;
}

const App = (props: Props) => (
    // Add an AbacProvider somewhere near the root of your component tree
    // where you have access to the logged in user
    <AbacProvider
        user={props.user}
        roles={props.user.roles}
        rules={rules}
        permissions={props.user.permissions}
    >
        <EditPost post={props.post} />
    </AbacProvider>
);

const EditPost = (props: { post: { owner: string } }) => (
    // restrict parts of the application using the AllowedTo component
    <AllowedTo
        // can be an array too, in which case the user must have all permissions
        perform={permissions.EDIT_POST}
        // optional, data to pass to abac rules as first argument
        data={props.post}
        // both no and yes props are optional
        no={() => <span>Not allowed to edit post</span>}
        //yes={() => <span>Allowed to edit post</span>}
    >
        {/* the yes prop will default to rendering the children */}
        <span>Allowed to edit post</span>
    </AllowedTo>
);
```

See the `./example` directory for a full example. This example is deployed at [here](https://rik-hoffbauer.gitlab.io/npm/react-abac/).

## API reference

### Components

#### AbacProvider

The `AbacProvider` is used to provide the `AllowedTo` component and the `useAbac` hook with access to the logged in user and the permission rules.

##### Props

| name        | type       | required | description                                                                |
| ----------- | ---------- | -------- | -------------------------------------------------------------------------- |
| rules       | `object`   | [ x ]    | An object describing the permission rules, see the [Rules section](#Rules) |
| user        | `object`   | [ ]      | The logged in user                                                         |
| roles       | `string[]` | [ ]      | The roles of the logged in user                                            |
| permissions | `string[]` | [ ]      | The permissions of the logged in user                                      |

##### Example usage

```typescript jsx
interface Props {
    user: User;
    post: Post;
}

const App = (props: Props) => (
    // Add an AbacProvider somewhere near the root of your component tree
    // where you have access to the logged in user
    <AbacProvider
        user={props.user}
        roles={props.user.roles}
        rules={rules}
        permissions={props.user.permissions}
    >
        <EditPost post={props.post} />
    </AbacProvider>
);
```

## Concepts

### Roles

A role describes what purpose (role) a user has within the system on a very high level. A user can have multiple roles.

It is recommended when using typescript to define the roles as an enum like so:

```typescript
enum Role {
    ADMIN = "ADMIN",
    USER = "USER",
}
```

When using javascript a regular object can be used.

```javascript
const Role = {
    ADMIN: "ADMIN",
    USER: "USER",
};
```

### Permissions

A permission describes an action you might want to restrict, such as editing a post.

Permissions can be attached to a role (e.g. ADMIN role has DELETE_POST permission) or directly to a user.

Feel free to use whatever naming conventions you find appropriate, e.g. `EDIT_POST` or `post:edit`.

It is recommended when using typescript to define the permissions as an enum like so:

```typescript
enum Permission {
    EDIT_POST = "EDIT_POST",
}
```

When using javascript a regular object can be used.

```javascript
const Permission = {
    EDIT_POST: "EDIT_POST",
};
```

### Rules

A rule describes the relationship between a Role and a Permission.

A rule can be:

-   a `boolean`
    -   rbac, role either has permission or doesn't
-   a `function`
    -   abac, user has permission based on user attributes and other data

Rules are described in an object like this:

```typescript
const rules = {
    [Role.USER]: {
        // only allow editing if post is owned by user
        [Permission.EDIT_POST]: (post, user) => post.owner === user.uuid,
    },
    [Role.ADMIN]: {
        // always allow editing
        [Permission.EDIT_POST]: true,
    },
};
```
