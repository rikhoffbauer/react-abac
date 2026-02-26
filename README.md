[![Rate on Openbase](https://badges.openbase.com/js/rating/react-abac.svg)](https://openbase.com/js/react-abac?utm_source=embedded&utm_medium=badge&utm_campaign=rate-badge)
[![kandi X-Ray](https://kandi.openweaver.com/badges/xray.svg)](https://kandi.openweaver.com/typescript/rikhoffbauer/react-abac)

# react-abac

Attribute Based Access Control and Role Based Access Control for React.

## Installing

```
npm install react-abac
```

## Example

An example implementation can be found on codesandbox.io.

[![Edit react-abac example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/react-abac-example-njzig?fontsize=14&hidenavigation=1&theme=dark)

## Tutorial

A short tutorial video is available.

[![react-abac tutorial](https://img.youtube.com/vi/Qjcht9p83bY/0.jpg)](https://www.youtube.com/watch?v=Qjcht9p83bY)

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

See the `./example` directory for a full example. This example is deployed [here](https://rik-hoffbauer.gitlab.io/npm/react-abac/).

## API reference

### Functions

#### create

The `create` function allows you to create a new instance of the library, this allows you to run multiple instances completely separated from each other within the same application.

This is especially useful when developing a library that uses `react-abac` internally but you want consuming applications to use their own `react-abac` configuration.

##### Example usage

```typescript jsx
export const {
    AllowedTo,
    secured,
    NotAllowedTo,
    AbacContextDefaults,
    AbacProvider,
    AbacContext,
    useAbac,
} = create<Role, Permission, User>();
```

### Components

#### AbacProvider

The `AbacProvider` is used to provide the `AllowedTo` component and the `useAbac` hook with access to the logged in user and the permission rules.

##### Props

| name | type | required | description |
| --- | --- | --- | --- |
| rules | `object` | yes | An object describing the permission rules, see the [Rules section](#rules). |
| user | `object` | no | The logged in user. |
| roles | `string[]` | no | The roles of the logged in user. |
| permissions | `string[]` | no | The permissions of the logged in user. |

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

#### AllowedTo

The `AllowedTo` component is used to restrict certain component trees based on whether the logged in user is allowed access.

##### Props

| name | type | required | description |
| --- | --- | --- | --- |
| perform | `string` or `string[]` | yes | A single permission or a list of permissions, if a list is provided all permissions are required. |
| yes | `React.ComponentType` | no | The jsx element to render if permission is granted. |
| no | `React.ComponentType` | no | The jsx element to render if permission is **not** granted. |
| data | `any` | no | Data to pass to abac rules as first argument. E.g. When editing a post you might want to pass the post model as data so the abac rule can check if the post is owned by the logged in user. |

##### Example usage

```typescript jsx
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

#### NotAllowedTo

The `NotAllowedTo` component is used to restrict certain component trees based on whether the logged in user is **not** allowed access.

The same as the `AllowedTo` component but with the no and yes props switched.

See [AllowedTo](#allowedto).

### Hooks

#### useAbac

##### Properties

| name | type | description |
| --- | --- | --- |
| userHasPermissions | <code>(permissions: string &#124; string[], data?: any) => boolean</code> | Checks if the logged in user has one or more permissions. |

##### Example usage

```typescript jsx
const EditPost = (props: { post: { owner: string } }) => {
    const { userHasPermissions } = useAbac();

    if (!userHasPermissions(permissions.EDIT_POST, props.post)) {
        return <span>Not allowed to edit post</span>;
    }

    return <span>Allowed to edit post</span>;
};
```

### Decorators/Higher Order Components

#### secured

A decorator/hoc that can be used to allow or deny access to a component.

##### Options

| name | type | description |
| --- | --- | --- | --- |
| permissions | `string` or `string[]` | yes | A single permission or a list of permissions, if a list is provided all permissions are required. |
| mapPropsToData | `(props: Props) => Data` | Maps the props provided to the component to data passed to abac rules (like the data prop on the AllowedTo component) |
| noAccess | `React.ComponentType<Props>` | Component that should be rendered if no permission is granted |

##### Example usage

```typescript jsx
const EditPost = (props: { post: Post }) => {
    return <span>Allowed to edit post</span>;
};

secured({
    permissions: permissions.EDIT_POST,
    mapPropsToData: (props) => props.post,
    noAccess: () => <div>You are not allowed to edit this post</div>,
})(EditPost);
```

or

```typescript jsx
@secured({
    permissions: permissions.EDIT_POST,
    mapPropsToData: (props) => props.post,
    noAccess: () => <div>You are not allowed to edit this post</div>,
})
class EditPost extends React.Component<{ post: Post }> {
    render() {
        return <span>Allowed to edit post</span>;
    }
}
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
