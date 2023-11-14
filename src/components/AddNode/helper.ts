import ChainNode from "../../classes/chain/ChainNode";
import CustomArithmeticFunction from "../../classes/functions/custom/CustomArithmetic";
import CustomBooleanFunction from "../../classes/functions/custom/CustomBoolean";
import CustomFunction from "../../classes/functions/custom/CustomFunction";
import CustomPeriodicFunction from "../../classes/functions/custom/CustomPeriodic";
import GenericFunction from "../../classes/functions/GenericFunction";
import ArithmeticFunction from "../../classes/functions/preset/ArithmeticFunction";
import BooleanFunction from "../../classes/functions/preset/BooleanFunction";
import PeriodicFunction from "../../classes/functions/preset/PeriodicFunction";
import { generateCustom as generateCustomArithmetic } from '../../presets/arithmetic';
import { generateCustom as generateCustomPeriodic } from '../../presets/periodic';
import { generateCustom as generateCustomBoolean } from '../../presets/boolean';
import { OperationType, OperationStyle, allOperationsPresets, TargetOperationProps, allGenerators, OperationProps } from "./types";

const determineType = (op: GenericFunction<any> | undefined) => {
    if(!op) return undefined;
    else if(op instanceof PeriodicFunction || op instanceof CustomPeriodicFunction) return OperationType.periodic;
    else if(op instanceof BooleanFunction || op instanceof CustomBooleanFunction) return OperationType.boolean;
    else if(op instanceof ArithmeticFunction || op instanceof CustomArithmeticFunction) return OperationType.arithmetic;
}

const determineCallback = (op: GenericFunction<any> | undefined, style: OperationStyle, type: OperationType) => {
    if(!op) return '';
    if(style === OperationStyle.custom) return op.getCallback().toString();
    return Object.keys(allOperationsPresets[type]).find(s => s === op.getSymbol()) ?? Object.keys(allOperationsPresets[OperationType.arithmetic])[0];
}

const analyzeOperation = (op: GenericFunction<any> | undefined) => {
    const style = !op
        ? OperationStyle.none
        : op instanceof CustomFunction
            ? OperationStyle.custom
            : OperationStyle.preset;
    
    const type = determineType(op) ?? OperationType.arithmetic;
    
    return {
        type,
        style,
        symbol: op?.getSymbol() ?? '',
        callback: determineCallback(op, style, type),
        frequency: op instanceof PeriodicFunction ? (op as PeriodicFunction)?.getFrequency()?.toString() : '0',
        phase: op instanceof PeriodicFunction ? (op as PeriodicFunction)?.getPhase()?.toString() : '0',
        amplitude: op instanceof PeriodicFunction ? (op as PeriodicFunction)?.getAmplitude()?.toString() : '0',
        offset: op?.getOffset()?.toString() ?? '0'
    }
};

const analyzeNode = (node: ChainNode<any>): TargetOperationProps | undefined => {
    if(!node) return undefined;
    return {
        mainOperation: analyzeOperation(node.mainOperation),
        inputOperation: analyzeOperation(node.inputOperation),
        outputOperation: analyzeOperation(node.outputOperation)
    }
};

export const parseOperation = (op: OperationProps) => {
    if(op.style === OperationStyle.none) return undefined;

    if(op.style === OperationStyle.preset) {
        switch(op.type) {
            case OperationType.arithmetic:
                return allGenerators[op.type][op.symbol as OperationStyle](Number.parseFloat(op.offset) || undefined);
            case OperationType.periodic:
                return allGenerators[op.type][op.symbol as OperationStyle](
                    Number.parseFloat(op.frequency) || undefined,
                    Number.parseFloat(op.phase) || undefined,
                    Number.parseFloat(op.amplitude) || undefined,
                    Number.parseFloat(op.offset) || undefined
                );
            case OperationType.boolean:
                return allGenerators[op.type][op.symbol as OperationStyle](Boolean(op.offset));
        }
    }

    if(op.style === OperationStyle.custom) {
        switch(op.type) {
            case OperationType.arithmetic:
                return generateCustomArithmetic({
                    symbol: op.symbol ?? '',
                    callback: eval(op.callback as string),
                    offset: Number.parseFloat(op.offset) || undefined
                });
                case OperationType.periodic:
                    return generateCustomPeriodic({
                        symbol: op.symbol ?? '',
                        callback: eval(op.callback as string),
                        offset: Number.parseFloat(op.offset) || undefined,
                        frequency: Number.parseFloat(op.frequency) || undefined,
                        phase: Number.parseFloat(op.phase) || undefined,
                        amplitude: Number.parseFloat(op.amplitude) || undefined
                    });
                case OperationType.boolean:
                    return generateCustomBoolean({
                        symbol: op.symbol ?? '',
                        callback: eval(op.callback as string),
                        offset: /true|false/i.test(op.offset)
                            ? op.offset.trim() === 'true' ? true : false
                            : !!op.offset ?? true,
                    })
        }
    }
};

export default analyzeNode;