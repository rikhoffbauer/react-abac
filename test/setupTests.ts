const reactTestGlobal = globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
};

reactTestGlobal.IS_REACT_ACT_ENVIRONMENT = true;
