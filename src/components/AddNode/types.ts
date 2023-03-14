import { ArithmeticFunctionProps } from "../../classes/functions/preset/ArithmeticFunction";
import { BooleanFunctionProps } from "../../classes/functions/preset/BooleanFunction";
import { PeriodicFunctionProps } from "../../classes/functions/preset/PeriodicFunction";
import { presetArithmeticOperations } from "../../presets/arithmetic";
import { presetBooleanOperations } from "../../presets/boolean";
import { presetPeriodicOperations } from "../../presets/periodic";
import { ChainOperationTarget } from "../../state/actions";
import { generator as arithmeticGenerator } from '../../presets/arithmetic';
import { generator as periodicGenerator} from '../../presets/periodic';
import { generator as booleanGenerator } from '../../presets/boolean';

export enum OperationType {
    arithmetic = 'arithmetic',
    periodic = 'periodic',
    boolean = 'boolean'
};

export enum OperationStyle {
    none = 'none',
    preset = 'preset',
    custom = 'custom'
};

// https://stackoverflow.com/questions/49401866/all-possible-keys-of-an-union-type/49402091#49402091
type KeysOfUnion<T> = T extends T ? keyof T: never;

interface ExtraOperationProps {
    type: OperationType,
    style: OperationStyle
}

type AllOperationsKeys = KeysOfUnion<Required<PeriodicFunctionProps | ArithmeticFunctionProps | BooleanFunctionProps | ExtraOperationProps>>;

export type OperationProps = {
    [key in AllOperationsKeys]: string
};

export const FormFieldName: OperationProps = {
    style: 'style',
    type: 'type',
    callback: 'callback',
    symbol: 'symbol',
    offset: 'offset',
    phase: 'phase',
    frequency: 'frequency',
    amplitude: 'amplitude'
};

export type TargetOperationProps = {
    [key in ChainOperationTarget]: OperationProps;
};

export const allOperationsPresets = {
    [OperationType.arithmetic]: presetArithmeticOperations,
    [OperationType.periodic]: presetPeriodicOperations,
    [OperationType.boolean]: presetBooleanOperations
};

export const allGenerators: {
    [key in OperationType]: any
} = {
    [OperationType.arithmetic]: arithmeticGenerator,
    [OperationType.periodic]: periodicGenerator,
    [OperationType.boolean]: booleanGenerator
};