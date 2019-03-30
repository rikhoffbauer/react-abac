declare module "@storybook/addon-knobs" {
    export * from "storybook__addon-knobs";
    export function optionsKnob<T, T2 extends T[keyof T]>(
        label: string,
        valuesObj: T,
        defaultValue: T2 | T2[],
        options: {
            display:
                | "radio"
                | "inline-radio"
                | "check"
                | "inline-check"
                | "select"
                | "multi-select";
        },
        groupId?: string,
    ): any;
}
