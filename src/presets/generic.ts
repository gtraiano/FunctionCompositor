import GenericFunction from "../classes/functions/GenericFunction";

export const identity = new GenericFunction<any>({
    symbol: '=',
    callback: (...args: any[]) => (offset?: any) => args[0]
});