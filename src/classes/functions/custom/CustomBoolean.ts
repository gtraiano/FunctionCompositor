import { GenericFunctionProps } from "../GenericFunction";
import CustomFunction from "./CustomFunction";

class CustomBooleanFunction extends CustomFunction<boolean> {
    constructor(props: GenericFunctionProps<boolean>) {
        super(props);
    }
}

export default CustomBooleanFunction;