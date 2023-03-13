import Environment from "jest-environment-jsdom-global";
import { TextEncoder } from "util";

/**
 * A custom environment to set the TextEncoder
 */
class CustomTestEnvironment extends Environment {
    constructor({ globalConfig, projectConfig }, context) {
        super({ globalConfig, projectConfig }, context);

        if (typeof this.global.TextEncoder === 'undefined') {
            this.global.TextEncoder = TextEncoder;
        }
    }
};

export default CustomTestEnvironment;

