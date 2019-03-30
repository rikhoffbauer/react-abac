import { optionsKnob, text, withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import React from "react";
import { Rules } from "../../interfaces";
import { AbacProvider, AllowedTo } from "../index";

enum Role {
    ADMIN = "ADMIN",
    USER = "USER",
}

interface User {
    uuid: string;
    roles: Role[];
}

interface Entity {
    owner: string; // user uuid
}

enum Permission {
    EDIT_ENTITY = "EDIT_ENTITY",
    DELETE_USER = "DELETE_USER",
}

const rules: Rules<Role, Permission, User> = {
    [Role.ADMIN]: {
        // admins can edit any entity
        [Permission.EDIT_ENTITY]: true,
        [Permission.DELETE_USER]: true,
    },
    [Role.USER]: {
        // users can only edit entities they own
        [Permission.EDIT_ENTITY]: (data: Entity, user?: User) =>
            data && user && data.owner === user.uuid,
    },
};

storiesOf("AllowedTo", module)
    .addDecorator(withKnobs)
    .add(
        "Attribute Based Access Control",
        () => {
            const userUuid = text("uuid", "user-uuid", "user");
            const roles = optionsKnob(
                "roles",
                Role,
                [Role.USER],
                { display: "multi-select" },
                "user",
            );
            const entityOwnerUuid = text("owner", "user-uuid", "entity");
            const user: User = { roles: roles, uuid: userUuid };
            const entity: Entity = { owner: entityOwnerUuid };

            return (
                <AbacProvider roles={user.roles} user={user} rules={rules}>
                    <AllowedTo
                        perform={Permission.EDIT_ENTITY}
                        data={entity}
                        no={() => <span>Not allowed to edit entity.</span>}
                    >
                        Allowed to edit entity.
                    </AllowedTo>
                </AbacProvider>
            );
        },
        { notes: "Test note" },
    );
