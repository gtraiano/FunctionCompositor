import { identity } from "../../presets/generic";
import { Calculate } from "../../types";
import GenericFunction from "../functions/GenericFunction";

export interface ChainNodeProps<T> {
    input?: T;
    mainOperation?: GenericFunction<T>;
    inputOperation?: GenericFunction<T>;
    outputOperation?: GenericFunction<T>;
    bypass?: boolean;
}

class ChainNode<T> implements Calculate<T> {
    input: T;                                           // input value to be used in operations
    output: T;                                          // output value
    bypass: boolean;                                    // bypass operations and forward unaltered input value
    mainOperation: GenericFunction<T>;                  // main operation applied to input
    inputOperation: GenericFunction<T> | undefined;     // operation applied to input value before main operation
    outputOperation: GenericFunction<T> | undefined;    // operation applied to output value after main operation
    
    constructor(config: ChainNodeProps<T>) {
        this.input = config.input ?? undefined as T;
        // undefined main operation defaults to identity function
        this.mainOperation = config.mainOperation ?? identity;
        this.inputOperation = config.inputOperation;
        this.outputOperation = config.outputOperation;
        this.output = this.input;
        this.bypass = config.bypass ?? false;
    }

    calculate = async (t: T) => {
        // do not apply input and output operations
        if(this.bypass) return this.input ?? t;
        // apply input operation
        this.input = this.inputOperation
            ? await this.inputOperation.calculate(this.input ?? t)
            : this.input ?? t;
        // apply main operation
        this.output = await this.mainOperation.calculate(this.input);
        // apply output operation
        this.output = this.outputOperation
            ? await this.outputOperation.calculate(this.output)
            : this.output
        return this.output;
    }

    setMainOperation = (op: GenericFunction<T> | undefined | null) => {
        if(!op) this.mainOperation = identity;
        else this.mainOperation = op;
    }

    setInputOperation = (op: GenericFunction<T> | undefined | null) => {
        if(!op) this.inputOperation = undefined;
        else this.mainOperation = op;
    }

    setOutputOperation = (op: GenericFunction<T> | undefined | null) => {
        if(!op) this.outputOperation = undefined;
        else this.outputOperation = op;
    }

    setBypass = (value: boolean) => {
        this.bypass = value;
    }

    setInput = (value: T | undefined) => {
        this.input = value as T;
    }
}

export default ChainNode;