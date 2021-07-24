import { Rule } from "../interfaces";
declare const evaluateRule: <User, Data>(rule: Rule<User, Data>, user?: User | undefined, data?: Data | undefined) => boolean;
export default evaluateRule;
