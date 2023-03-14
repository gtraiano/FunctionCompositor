import { GenericFunctionProps } from "../GenericFunction";
import CustomFunction from "./CustomFunction";

class CustomArithmeticFunction extends CustomFunction<number> {
    constructor(props: GenericFunctionProps<number>) {
        super(props);
    }
}

export default CustomArithmeticFunction;