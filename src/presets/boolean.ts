import CustomBooleanFunction from "../classes/functions/custom/CustomBoolean";
import { GenericFunctionProps } from "../classes/functions/GenericFunction";
import BooleanFunction from "../classes/functions/preset/BooleanFunction";
import { BooleanOperationGenerator, BooleanOperations, BooleanOperatorSymbol } from "../types";

export const presetBooleanOperations: BooleanOperations = {
    [BooleanOperatorSymbol.AND]: {
        symbol: 'AND',
        callback: (...args: boolean[]) => (offset?: boolean) => args.reduce((s, n) => n && s, offset ?? true)
    },

    [BooleanOperatorSymbol.OR]: {
        symbol: 'OR',
        callback: (...args: boolean[]) => (offset?: boolean) => args.reduce((s, n) => n || s, offset ?? true)
    },

    [BooleanOperatorSymbol.NOT]: {
        symbol: 'NOT',
        callback: (...args: boolean[]) => (offset?: boolean) => args.reduce((s, n) => !(n && s), offset ?? true)
    },

    [BooleanOperatorSymbol.XOR]: {
        symbol: 'XOR',
        callback: (...args: boolean[]) => (offset?: boolean) => args.reduce((s, n) => (s && !n) || (!s && n), offset ?? true)
    },

    [BooleanOperatorSymbol.NAND]: {
        symbol: 'NAND',
        callback: (...args: boolean[]) => (offset?: boolean) => !args.reduce((s, n) => (s && n), offset ?? true)
    },

    [BooleanOperatorSymbol.NOR]: {
        symbol: 'NOR',
        callback: (...args: boolean[]) => (offset?: boolean) => !args.reduce((s, n) => (s || n), offset ?? true)
    },

    [BooleanOperatorSymbol.XNOR]: {
        symbol: 'XNOR',
        callback: (...args: boolean[]) => (offset?: boolean) => args.reduce((s, n) => (s && n) || (!s && !n), offset ?? true)
    }
}

const generateAnd = (offset: boolean = true) => new BooleanFunction({ ...presetBooleanOperations.AND, offset });
const generateOr = (offset: boolean = true) => new BooleanFunction({ ...presetBooleanOperations.OR, offset });
const generateNot = (offset: boolean = true) => new BooleanFunction({ ...presetBooleanOperations.NOT, offset });
const generateXor = (offset: boolean = true) => new BooleanFunction({ ...presetBooleanOperations.XOR, offset });
const generateNand = (offset: boolean = true) => new BooleanFunction({ ...presetBooleanOperations.NAND, offset });
const generateNor = (offset: boolean = true) => new BooleanFunction({ ...presetBooleanOperations.NOR, offset });
const generateXnor = (offset: boolean = true) => new BooleanFunction({ ...presetBooleanOperations.XNOR, offset });
export const generateCustom = ({ symbol, callback, offset }: GenericFunctionProps<boolean>) => new CustomBooleanFunction({ symbol, callback, offset });

export const generator: BooleanOperationGenerator = {
    [BooleanOperatorSymbol.AND]: generateAnd,
    [BooleanOperatorSymbol.OR]: generateOr,
    [BooleanOperatorSymbol.NOT]: generateNot,
    [BooleanOperatorSymbol.XOR]: generateXor,
    [BooleanOperatorSymbol.NAND]: generateNand,
    [BooleanOperatorSymbol.NOR]: generateNor,
    [BooleanOperatorSymbol.XNOR]: generateXnor
};

export const generate = {
    and: generateAnd,
    or: generateOr,
    not: generateNot,
    xor: generateXor,
    nand: generateNand,
    nor: generateNor,
    xnor: generateXnor
};