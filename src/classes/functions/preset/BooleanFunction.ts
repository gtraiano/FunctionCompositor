import GenericFunction, { GenericFunctionProps } from "../GenericFunction";

export type BooleanFunctionProps = GenericFunctionProps<boolean>;

class BooleanFunction extends GenericFunction<boolean> {
    constructor(config: BooleanFunctionProps) {
        super(config);
    }

    calculate = (...t: boolean[]): Promise<boolean> => new Promise(resolve => {
        resolve(this.cbWithArgs(...t));
    });
}

export default BooleanFunction;