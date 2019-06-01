import { mount } from "enzyme";
import React from "react";

import {
    AbacProvider,
    AbacProviderProps,
    AllowedTo,
    Rules,
    useAbac,
} from "../src";

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
        permissions: Permission[];
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
        [Permission.DELETE_USER]: (data: User, user?: User) =>
            user && data.uuid === user.uuid,
    };

    const Provider: React.FC<
        Partial<AbacProviderProps<Role, Permission, User>>
    > = ({ user, ...props }) => (
        <AbacProvider
            roles={user && user.roles}
            permissions={user && user.permissions}
            user={user}
            rules={rules}
            {...props}
        />
    );

    const admin: User = {
        uuid: "admin-uuid",
        roles: [Role.ADMIN],
        permissions: [],
    };
    const user: User = {
        uuid: "user-uuid",
        roles: [Role.USER],
        permissions: [],
    };
    const userWithRbacPermissions: User = {
        uuid: "user-with-rbac-permission",
        roles: [],
        permissions: [Permission.EDIT_USER],
    };
    const userWithAbacPermissions: User = {
        uuid: "user-with-abac-permission",
        roles: [],
        permissions: [Permission.DELETE_USER],
    };

    describe("useAbac()", () => {
        describe("userHasPermissions(permissions, data)", () => {
            it("should return true if permission is granted", () => {
                const TestComponent = () => {
                    const { userHasPermissions } = useAbac();

                    expect(userHasPermissions(Permission.VIEW_HOMEPAGE)).toBe(
                        true,
                    );

                    return null;
                };

                mount(
                    <Provider user={user}>
                        <TestComponent />
                    </Provider>,
                );
            });

            it("should return false if permission is denied", () => {
                const TestComponent = () => {
                    const { userHasPermissions } = useAbac();

                    expect(
                        userHasPermissions(Permission.DELETE_USER, admin),
                    ).toBe(false);

                    return null;
                };

                mount(
                    <Provider user={user}>
                        <TestComponent />
                    </Provider>,
                );
            });

            it("should return true if called with no permissions", () => {
                const TestComponent = () => {
                    const { userHasPermissions } = useAbac();

                    expect(userHasPermissions([], user)).toBe(true);

                    return null;
                };

                mount(
                    <Provider user={user}>
                        <TestComponent />
                    </Provider>,
                );
            });

            it("should log an error and return false if app is not wrapped with an AbacProvider", () => {
                const TestComponent = () => {
                    const { userHasPermissions } = useAbac();

                    spyOn(console, `error`);

                    expect(
                        userHasPermissions(Permission.VIEW_HOMEPAGE, admin),
                    ).toBe(false);
                    expect(console.error).toHaveBeenCalled();

                    return null;
                };

                mount(<TestComponent />);
            });
        });
    });

    describe("<AllowedTo />", () => {
        describe("<AllowedTo perform={'PERMISSION'} />", () => {
            it("Should log an error if used without a provider and render nothing", () => {
                const renderWithoutProvider = () =>
                    mount(
                        <AllowedTo
                            perform={Permission.EDIT_USER}
                            data={user}
                            no={() => <div>No</div>}
                        >
                            <div>yes</div>
                        </AllowedTo>,
                    );

                spyOn(console, "error");

                const wrapper = renderWithoutProvider();

                expect(wrapper.text()).toBe(null);
                expect(console.error).toHaveBeenCalled();
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

                expect(wrapper.text()).toBe("yes");
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

                expect(wrapper.text()).toBe("no");
            });

            it("Should render children if required abac rules/permissions are met", () => {
                const wrapper = mount(
                    <Provider user={user}>
                        <AllowedTo perform={Permission.EDIT_USER} data={user}>
                            <div>yes</div>
                        </AllowedTo>
                    </Provider>,
                );

                expect(wrapper.text()).toBe("yes");
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

                expect(wrapper.text()).toBe("no");
            });

            it("Should render children if no rules/permissions are required", () => {
                const wrapper = mount(
                    <Provider user={user}>
                        <AllowedTo data={user}>
                            <div>yes</div>
                        </AllowedTo>
                    </Provider>,
                );

                expect(wrapper.text()).toBe("yes");
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

            it("Should render if the user has the required permission directly defined on it and no rule for it is defined", () => {
                const wrapper = mount(
                    <Provider user={userWithRbacPermissions}>
                        <AllowedTo
                            data={userWithRbacPermissions}
                            perform={Permission.EDIT_USER}
                        >
                            <div>yes</div>
                        </AllowedTo>
                    </Provider>,
                );

                expect(wrapper.text()).toBe("yes");
            });

            it("Should render if the user has the required permission directly defined on it and its abac rule returns true", () => {
                const wrapper = mount(
                    <Provider user={userWithAbacPermissions}>
                        <AllowedTo
                            data={userWithAbacPermissions}
                            perform={Permission.DELETE_USER}
                        >
                            <div>yes</div>
                        </AllowedTo>
                    </Provider>,
                );

                expect(wrapper.text()).toBe("yes");
            });

            it("Should not render if the user has the required permission directly defined on it and its abac rule returns false", () => {
                const wrapper = mount(
                    <Provider user={userWithAbacPermissions}>
                        <AllowedTo
                            data={user}
                            perform={Permission.DELETE_USER}
                            no={() => <div>no</div>}
                        >
                            <div>yes</div>
                        </AllowedTo>
                    </Provider>,
                );

                expect(wrapper.text()).toBe("no");
            });

            it("Should render as if no permission if there is no roles or permissions provided", () => {
                const wrapper = mount(
                    <Provider
                        user={admin}
                        roles={undefined}
                        permissions={undefined}
                    >
                        <AllowedTo
                            perform={Permission.VIEW_HOMEPAGE}
                            no={() => <div>no</div>}
                        >
                            <div>yes</div>
                        </AllowedTo>
                    </Provider>,
                );

                expect(wrapper.text()).toBe("no");
            });

            it("Should render as if no permission if user has role that has no rules", () => {
                const wrapper = mount(
                    <Provider user={admin} rules={{}}>
                        <AllowedTo
                            perform={Permission.VIEW_HOMEPAGE}
                            no={() => <div>no</div>}
                        >
                            <div>yes</div>
                        </AllowedTo>
                    </Provider>,
                );

                expect(wrapper.text()).toBe("no");
            });
        });
    });
});
