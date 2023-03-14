import GenericFunction, { GenericFunctionProps } from "../GenericFunction";

export type ArithmeticFunctionProps = GenericFunctionProps<number>;

class ArithmeticFunction extends GenericFunction<number> {
    constructor(config: ArithmeticFunctionProps) {
        super(config);
    }
}

export default ArithmeticFunction;