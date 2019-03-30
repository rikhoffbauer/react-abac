import { mount } from "enzyme";
import React from "react";

import { AbacProvider, AllowedTo, Rules } from "./index";

describe("Functional tests", () => {
    enum Role {
        ADMIN = "ADMIN",
        USER = "USER",
    }

    enum Permission {
        EDIT_USER = "EDIT_USER",
        DELETE_USER = "DELETE_USER",
        VIEW_HOMEPAGE = "VIEW_HOMEPAGE",
    }

    interface User {
        uuid: string;
        roles: Role[];
    }

    const rules: Rules<Role, Permission, User> = {
        [Role.ADMIN]: {
            [Permission.EDIT_USER]: true,
            [Permission.VIEW_HOMEPAGE]: true,
            [Permission.DELETE_USER]: true,
        },
        [Role.USER]: {
            // only edit own user
            [Permission.EDIT_USER]: (data: User, user?: User) =>
                user && data.uuid === user.uuid,
            [Permission.VIEW_HOMEPAGE]: true,
        },
    };

    interface ProviderProps {
        user: User;
    }

    const Provider: React.FC<ProviderProps> = ({ user, children }) => (
        <AbacProvider
            roles={user.roles}
            user={user}
            rules={rules}
            children={children}
        />
    );

    const admin: User = { uuid: "admin-uuid", roles: [Role.ADMIN] };
    const user: User = { uuid: "user-uuid", roles: [Role.USER] };

    describe("<AllowedTo />", () => {
        describe("<AllowedTo perform={'PERMISSION'} />", () => {
            it("Should throw an error if used without a provider", () => {
                const renderWithoutProvider = () =>
                    mount(
                        <AllowedTo perform={Permission.EDIT_USER} data={user}>
                            <div>yes</div>
                        </AllowedTo>,
                    );

                expect(renderWithoutProvider).toThrow(
                    `Wrap your app with an AbacProvider.`,
                );
            });

            it("Should render children if required rbac rules/permissions are met", () => {
                const wrapper = mount(
                    <Provider user={user}>
                        <AllowedTo
                            perform={Permission.VIEW_HOMEPAGE}
                            yes={() => <div>yes</div>}
                        />
                    </Provider>,
                );

                expect(wrapper.find("div").text()).toBe("yes");
            });

            it("Should not render children if required rbac rules/permissions are not met", () => {
                const wrapper = mount(
                    <Provider user={user}>
                        <AllowedTo
                            perform={Permission.DELETE_USER}
                            no={() => <div>no</div>}
                        >
                            <div>yes</div>
                        </AllowedTo>
                    </Provider>,
                );

                expect(wrapper.find("div").text()).toBe("no");
            });

            it("Should render children if required abac rules/permissions are met", () => {
                const wrapper = mount(
                    <Provider user={user}>
                        <AllowedTo perform={Permission.EDIT_USER} data={user}>
                            <div>yes</div>
                        </AllowedTo>
                    </Provider>,
                );

                expect(wrapper.find("div").text()).toBe("yes");
            });

            it("Should not render children if required abac rules/permissions are not met", () => {
                const wrapper = mount(
                    <Provider user={user}>
                        <AllowedTo
                            perform={Permission.EDIT_USER}
                            no={() => <div>no</div>}
                            data={admin}
                        >
                            <div>yes</div>
                        </AllowedTo>
                    </Provider>,
                );

                expect(wrapper.find("div").text()).toBe("no");
            });

            it("Should render children if no rules/permissions are required", () => {
                const wrapper = mount(
                    <Provider user={user}>
                        <AllowedTo data={user}>
                            <div>yes</div>
                        </AllowedTo>
                    </Provider>,
                );

                expect(wrapper.find("div").text()).toBe("yes");
            });

            it("Should render nothing if no yes/no/children prop is required", () => {
                const wrapper = mount(
                    <Provider user={user}>
                        <AllowedTo data={user} perform={Permission.DELETE_USER}>
                            <div>yes</div>
                        </AllowedTo>
                    </Provider>,
                );

                expect(wrapper.find("div").length).toBe(0);
            });
        });
    });
});
