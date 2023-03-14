import { Calculate, OperationCallback, OperationCallbackWithOffset } from "../../types";

// generic function props
export interface GenericFunctionProps<T> {
    symbol: string,
    callback: OperationCallback<T>,
    offset?: T
}

class GenericFunction<T> implements Calculate<T> {
    private symbol: string;                     // function name
    protected callback: OperationCallback<T>;   // function implementation
    private offset?: T;                         // offset to use in callback
    public calculate: (...t: T[]) => Promise<T>;

    protected cbWithArgs = (...t: T[]) => (this.callback as OperationCallbackWithOffset<T>)(...t)(this.offset);

    constructor(config: GenericFunctionProps<T>) {
        this.symbol = config.symbol;
        this.offset = config.offset;
        this.callback = config.callback;
        this.calculate = (...t: T[]) => new Promise<T>((resolve) => {
            resolve(this.cbWithArgs(...t));
        });
    }

    getSymbol = () => this.symbol;

    setSymbol = (symbol: string) => {
        this.symbol = symbol;
    }

    getOffset = () => this.offset;

    setOffset = (offset: T) => {
        this.offset = offset;
    }

    getCallback = () => this.callback;

    setCallback = (callback: OperationCallback<T>) => {
        this.callback = callback;
    }
}

export default GenericFunction;