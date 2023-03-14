import GenericFunction, { GenericFunctionProps } from "../GenericFunction";

class CustomFunction<T> extends GenericFunction<T> {
    constructor(config: GenericFunctionProps<T>) {
        super(config);
    }
}

export default CustomFunction;