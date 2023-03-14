// operation callback function type

import ArithmeticFunction from "../classes/functions/preset/ArithmeticFunction";
import BooleanFunction from "../classes/functions/preset/BooleanFunction";
import PeriodicFunction from "../classes/functions/preset/PeriodicFunction";

//export type OperationCallbackWithoutOffset<T> = (...args: T[]) => T;
export type OperationCallbackWithOffset<T> = (...args: T[]) => (offset?: T) => T;
//export type OperationCallback<T> = OperationCallbackWithoutOffset<T> | OperationCallbackWithOffset<T>;
export type OperationCallback<T> = OperationCallbackWithOffset<T>;

// operation symbol
export type OperationSymbol = string;

// named operation with callback and offset (i.e. initial value for callback)
export interface Operation<T> {
    symbol: OperationSymbol,            // e.g. +, -, *, /, ...
    callback: OperationCallback<T>,     // function which implements operation
    offset?: T                          // offset value for operation
};

// arithmetic operation
export type ArithmeticOperation = Operation<number>;

// arithmetic operators
export enum ArithmeticOperatorSymbol {
    ADD = '+',
    SUB = '-',
    MUL = '*',
    DIV = '/',
    EXP = '^',
    EQ = '=',
    SQRT = '√',
    CBRT = '∛',
    ABS = 'abs',
    E_EXP = 'eˣ',
    E_EXP_M1 = 'eˣ-1',
    HYPOT = 'hypot',
    LN = 'ln',
    LOG_10 = 'log',
    LOG_2 = 'log2'
};

// all arithmetic operations
export type ArithmeticOperations = {
    [op in ArithmeticOperatorSymbol]: ArithmeticOperation
};

export type ArithmeticOperationGenerator = {
    [key in ArithmeticOperatorSymbol]: (...args: number[]) => ArithmeticFunction
};

// periodic operators
export enum PeriodicOperatorSymbol {
    SIN = 'sin',
    COS = 'cos',
    TAN = 'tan',
    SQR = 'square',
    TRN = 'triangle',
    SAW = 'sawtooth'
}

export type PeriodicOperation = Operation<number> & {
    amplitude: number,
    frequency: number,
    phase: number
};

// all periodic operators
export type PeriodicOperations = {
    [op in PeriodicOperatorSymbol]: PeriodicOperation
};

export type PeriodicOperationGenerator = {
    [key in PeriodicOperatorSymbol]: (...args: number[]) => PeriodicFunction
};


// boolean operators
export enum BooleanOperatorSymbol {
    AND = 'AND',
    OR = 'OR',
    NOT = 'NOT',
    NAND = 'NAND',
    NOR = 'NOR',
    XOR = 'XOR',
    XNOR = 'XNOR'
}

// boolean operation
export type BooleanOperation = Operation<boolean>;

export type BooleanOperations = {
    [op in BooleanOperatorSymbol]: BooleanOperation
};

export type BooleanOperationGenerator = {
    [key in BooleanOperatorSymbol]: (...args: boolean[]) => BooleanFunction
};

// common function to calculate value
export interface Calculate<T> {
    calculate: (...args: T[]) => Promise<T>
}
