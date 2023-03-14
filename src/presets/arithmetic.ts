import ArithmeticFunction from "../classes/functions/preset/ArithmeticFunction";
import { GenericFunctionProps } from "../classes/functions/GenericFunction";
import CustomFunction from "../classes/functions/custom/CustomFunction";
import { ArithmeticOperations, ArithmeticOperationGenerator, ArithmeticOperatorSymbol } from "../types";
import CustomArithmeticFunction from "../classes/functions/custom/CustomArithmetic";

export const presetArithmeticOperations: ArithmeticOperations = {
    [ArithmeticOperatorSymbol.ADD]: {
        symbol: ArithmeticOperatorSymbol.ADD,
        callback: (...args: number[]) => (offset?: number) => args.reduce((s, n) => s + n, offset ?? 0)
    },

    [ArithmeticOperatorSymbol.SUB]: {
        symbol: ArithmeticOperatorSymbol.SUB,
        callback: (...args: number[]) => (offset?: number) => args.reduce((s, n) => n + s, 0) - (offset ?? 0)
    },

    [ArithmeticOperatorSymbol.MUL]: {
        symbol: ArithmeticOperatorSymbol.MUL,
        callback: (...args: number[]) => (offset?: number) => args.reduce((s, n) => n * s, offset ?? 1)
    },

    [ArithmeticOperatorSymbol.DIV]: {
        symbol: ArithmeticOperatorSymbol.DIV,
        callback: (...args: number[]) => (offset?: number) => args.reduce((s, n) => n / s, offset ?? 1)
    },

    [ArithmeticOperatorSymbol.EXP]: {
        symbol: ArithmeticOperatorSymbol.EXP,
        callback: (a: number) => (b?: number) => a ** (b ?? 1)
    },

    [ArithmeticOperatorSymbol.EQ]: {
        symbol: ArithmeticOperatorSymbol.EQ,
        callback: (t: number) => (offset?: number) => t + (offset ?? 0)
    },

    [ArithmeticOperatorSymbol.SQRT]: {
        symbol: ArithmeticOperatorSymbol.SQRT,
        callback: (...args: number[]) => (offset?: number) => Math.sqrt(args[0] + (offset ?? 0))
    },

    [ArithmeticOperatorSymbol.CBRT]: {
        symbol: ArithmeticOperatorSymbol.CBRT,
        callback: (...args: number[]) => (offset?: number) => Math.cbrt(args[0] + (offset ?? 0))
    },

    [ArithmeticOperatorSymbol.ABS]: {
        symbol: ArithmeticOperatorSymbol.ABS,
        callback: (...args: number[]) => (offset?: number) => Math.abs(args[0] + (offset ?? 0))
    },

    [ArithmeticOperatorSymbol.E_EXP]: {
        symbol: ArithmeticOperatorSymbol.E_EXP,
        callback: (...args: number[]) => (offset?: number) => Math.exp(args[0] + (offset ?? 0))
    },

    [ArithmeticOperatorSymbol.E_EXP_M1]: {
        symbol: ArithmeticOperatorSymbol.E_EXP_M1,
        callback: (...args: number[]) => (offset?: number) => Math.expm1(args[0] + (offset ?? 0))
    },

    [ArithmeticOperatorSymbol.LN]: {
        symbol: ArithmeticOperatorSymbol.LN,
        callback: (...args: number[]) => (offset?: number) => Math.log(args[0] + (offset ?? 0))
    },

    [ArithmeticOperatorSymbol.LOG_10]: {
        symbol: ArithmeticOperatorSymbol.LOG_10,
        callback: (...args: number[]) => (offset?: number) => Math.log10(args[0] + (offset ?? 0))
    },

    [ArithmeticOperatorSymbol.LOG_2]: {
        symbol: ArithmeticOperatorSymbol.LOG_2,
        callback: (...args: number[]) => (offset?: number) => Math.log2(args[0] + (offset ?? 0))
    },

    [ArithmeticOperatorSymbol.HYPOT]: {
        symbol: ArithmeticOperatorSymbol.HYPOT,
        callback: (...args: number[]) => (offset?: number) => Math.hypot(...args)+ (offset ?? 0)
    }
};

const add = new ArithmeticFunction({ ...presetArithmeticOperations["+"] });
const sub = new ArithmeticFunction({ ...presetArithmeticOperations["-"] });
const mul = new ArithmeticFunction({ ...presetArithmeticOperations["*"] });
const div = new ArithmeticFunction({ ...presetArithmeticOperations["/"] });
const exp = new ArithmeticFunction({ ...presetArithmeticOperations["^"] });
const eq = new ArithmeticFunction({ ...presetArithmeticOperations["="] });
const sqrt = new ArithmeticFunction({ ...presetArithmeticOperations['√'] });
const cbrt = new ArithmeticFunction({ ...presetArithmeticOperations['∛'] });
const abs = new ArithmeticFunction({ ...presetArithmeticOperations['abs'] });
const eExp = new ArithmeticFunction({ ...presetArithmeticOperations['eˣ'] });
const eExpM1 = new ArithmeticFunction({ ...presetArithmeticOperations['eˣ-1'] });
const ln = new ArithmeticFunction({ ...presetArithmeticOperations['ln'] });
const log = new ArithmeticFunction({ ...presetArithmeticOperations['log'] });
const log2 = new ArithmeticFunction({ ...presetArithmeticOperations['log2'] });
const hypot = new ArithmeticFunction({ ...presetArithmeticOperations['hypot']});

const generateAdd = (offset: number = 0) => new ArithmeticFunction({ ...presetArithmeticOperations["+"], offset });
const generateSub = (offset: number = 0) => new ArithmeticFunction({ ...presetArithmeticOperations["-"], offset });
const generateMul = (offset: number = 1) => new ArithmeticFunction({ ...presetArithmeticOperations["*"], offset });
const generateDiv = (offset: number = 1) => new ArithmeticFunction({ ...presetArithmeticOperations["/"], offset });
const generateExp = (offset: number = 1) => new ArithmeticFunction({ ...presetArithmeticOperations["^"], offset });
const generateIdentity = (offset: number = 0) => new ArithmeticFunction({ ...presetArithmeticOperations["="], offset });
const generateSqrt = (offset: number = 0) => new ArithmeticFunction({ ...presetArithmeticOperations["√"], offset });
const generateCbrt = (offset: number = 0) => new ArithmeticFunction({ ...presetArithmeticOperations['∛'], offset });
const generateAbs = (offset: number = 0) => new ArithmeticFunction({ ...presetArithmeticOperations['abs'], offset });
const generateEExp = (offset: number = 0) => new ArithmeticFunction({ ...presetArithmeticOperations['eˣ'], offset });
const generateEExpM1 = (offset: number = 0) => new ArithmeticFunction({ ...presetArithmeticOperations['eˣ-1'], offset });
const generateLn = (offset: number = 0) => new ArithmeticFunction({ ...presetArithmeticOperations['ln'], offset });
const generateLog = (offset: number = 0) => new ArithmeticFunction({ ...presetArithmeticOperations['log'], offset });
const generateLog2 = (offset: number = 0) => new ArithmeticFunction({ ...presetArithmeticOperations['log2'], offset });
const generateHypot = (offset: number = 0) => new ArithmeticFunction({ ...presetArithmeticOperations['hypot'], offset });
//export const generateCustom = ({ symbol, callback, offset }: GenericFunctionProps<number>) => new ArithmeticFunction({ symbol, callback, offset });
export const generateCustom = ({ symbol, callback, offset }: GenericFunctionProps<number>) => new CustomArithmeticFunction({ symbol, callback, offset });

export const generate = {
    add: generateAdd,
    sub: generateSub,
    mul: generateMul,
    div: generateDiv,
    exp: generateExp,
    eq: generateIdentity,
    sqrt: generateSqrt,
    cbrt: generateCbrt,
    abs: generateAbs,
    eExp: generateEExp,
    eExpM1: generateEExpM1,
    ln: generateLn,
    log: generateLog,
    log2: generateLog2
};

export const generator: ArithmeticOperationGenerator = {
    [ArithmeticOperatorSymbol.ADD]: generateAdd,
    [ArithmeticOperatorSymbol.SUB]: generateSub,
    [ArithmeticOperatorSymbol.MUL]: generateMul,
    [ArithmeticOperatorSymbol.DIV]: generateDiv,
    [ArithmeticOperatorSymbol.EXP]: generateExp,
    [ArithmeticOperatorSymbol.EQ]: generateIdentity,
    [ArithmeticOperatorSymbol.SQRT]: generateSqrt,
    [ArithmeticOperatorSymbol.CBRT]: generateCbrt,
    [ArithmeticOperatorSymbol.ABS]: generateAbs,
    [ArithmeticOperatorSymbol.E_EXP]: generateEExp,
    [ArithmeticOperatorSymbol.E_EXP_M1]: generateEExpM1,
    [ArithmeticOperatorSymbol.LN]: generateLn,
    [ArithmeticOperatorSymbol.LOG_10]: generateLog,
    [ArithmeticOperatorSymbol.LOG_2]: generateLog2,
    [ArithmeticOperatorSymbol.HYPOT]: generateHypot
};

export const arithmeticOperations = { add, sub, mul, div, exp, eq, sqrt, cbrt, abs, eExp, eExpM1, ln, log, log2, hypot };
