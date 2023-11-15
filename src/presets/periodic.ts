import CustomPeriodicFunction from "../classes/functions/custom/CustomPeriodic";
import PeriodicFunction, { PeriodicFunctionProps } from "../classes/functions/preset/PeriodicFunction";
import { PeriodicOperationGenerator, PeriodicOperations, PeriodicOperatorSymbol } from "../types";

const sine = (t: number, frequency: number, phase: number = 0) => (offset?: number) => Math.sin(((t * frequency) + phase) / 2*Math.PI / 360) + (offset ?? 0);
const cosine = (t: number, frequency: number, phase: number = 0) => (offset?: number) => Math.cos(((t * frequency) + phase) / 2*Math.PI / 360) + (offset ?? 0);
const tangent = (t: number, frequency: number, phase: number = 0) => (offset?: number) => Math.tan(((t * frequency) + phase) / 2*Math.PI / 360) + (offset ?? 0);
const square = (t: number, frequency: number, phase: number = 0) => (offset?: number) => Math.sign(Math.sin(((t * frequency) + phase) / 2*Math.PI / 360)) + (offset ?? 0);
const triangle = (t: number, frequency: number, phase: number = 0) => (offset?: number) => Math.asin(Math.sin(((t * frequency) + phase) / 2*Math.PI / 360)) + (offset ?? 0);
//const triangle = (t: number, period: number) => 2 * Math.abs((t / period) - Math.floor((t / period) + 1/2));
const sawtooth = (t: number, frequency: number, phase: number = 0) => (offset?: number) => Math.atan(1 / Math.tan(((t * frequency) + phase) / 2*Math.PI / 360)) + (offset ?? 0);
//const sawtooth = (t: number, period: number) => 2 * ((t / period) - Math.floor(1/2 + (t / period)));

const defaultPropValues: Required<Omit<PeriodicFunctionProps, "symbol" | "callback">> = {
    amplitude: 1,
    frequency: 1,
    phase: 0,
    offset: 0
};

export const presetPeriodicOperations: PeriodicOperations = {
    [PeriodicOperatorSymbol.SIN]: {
        symbol: PeriodicOperatorSymbol.SIN,
        callback: sine,
        ...defaultPropValues
    },

    [PeriodicOperatorSymbol.COS]: {
        symbol: PeriodicOperatorSymbol.COS,
        callback: cosine,
        ...defaultPropValues
    },

    [PeriodicOperatorSymbol.TAN]: {
        symbol: PeriodicOperatorSymbol.TAN,
        callback: tangent,
        ...defaultPropValues
    },

    [PeriodicOperatorSymbol.SQR]: {
        symbol: PeriodicOperatorSymbol.SQR,
        callback: square,
        ...defaultPropValues
    },

    [PeriodicOperatorSymbol.TRN]: {
        symbol: PeriodicOperatorSymbol.TRN,
        callback: triangle,
        ...defaultPropValues
    },

    [PeriodicOperatorSymbol.SAW]: {
        symbol: PeriodicOperatorSymbol.SAW,
        callback: sawtooth,
        ...defaultPropValues
    },
};

const generatePeriodicFunction = (symbol: PeriodicOperatorSymbol, frequency?: number, phase?: number, amplitude?: number, offset?: number) =>
    new PeriodicFunction({
        ...presetPeriodicOperations[symbol],
        frequency: frequency ?? defaultPropValues.frequency,
        phase: phase ?? defaultPropValues.phase,
        amplitude: amplitude ?? defaultPropValues.amplitude,
        offset: offset ?? defaultPropValues.offset
    });

const generateSin = (frequency?: number, phase?: number, amplitude?: number, offset?: number) => generatePeriodicFunction(PeriodicOperatorSymbol.SIN, frequency, phase, amplitude, offset);
const generateCos = (frequency?: number, phase?: number, amplitude?: number, offset?: number) => generatePeriodicFunction(PeriodicOperatorSymbol.COS, frequency, phase, amplitude, offset);
const generateTan = (frequency?: number, phase?: number, amplitude?: number, offset?: number) => generatePeriodicFunction(PeriodicOperatorSymbol.TAN, frequency, phase, amplitude, offset);
const generateSqr = (frequency?: number, phase?: number, amplitude?: number, offset?: number) => generatePeriodicFunction(PeriodicOperatorSymbol.SQR, frequency, phase, amplitude, offset);
const generateTrn = (frequency?: number, phase?: number, amplitude?: number, offset?: number) => generatePeriodicFunction(PeriodicOperatorSymbol.TRN, frequency, phase, amplitude, offset);
const generateSaw = (frequency?: number, phase?: number, amplitude?: number, offset?: number) => generatePeriodicFunction(PeriodicOperatorSymbol.SAW, frequency, phase, amplitude, offset);
export const generateCustom = ({ symbol, callback, offset, frequency, phase, amplitude }: PeriodicFunctionProps) => new CustomPeriodicFunction({ symbol, callback, offset, frequency, phase, amplitude });

export const generator: PeriodicOperationGenerator = {
    [PeriodicOperatorSymbol.SIN]: generateSin,
    [PeriodicOperatorSymbol.COS]: generateCos,
    [PeriodicOperatorSymbol.TAN]: generateTan,
    [PeriodicOperatorSymbol.SQR]: generateSqr,
    [PeriodicOperatorSymbol.TRN]: generateTrn,
    [PeriodicOperatorSymbol.SAW]: generateSaw
};

export const generate = {
    sin: generateSin,
    cos: generateCos,
    tan: generateTan,
    sqr: generateSqr,
    trn: generateTrn,
    saw: generateSaw
};