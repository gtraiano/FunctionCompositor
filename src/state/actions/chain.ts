import ChainNode from "../../classes/chain/ChainNode";

export enum ChainActionType {
    add = 'ADD_NODE',
    remove = 'REMOVE_NODE',
    replace = 'REPLACE_NODE',
    exchange = 'EXCHANGE_NODE',
    move = 'MOVE_NODE',
    bypass = 'BYPASS_NODE',
    setSymbol = 'SET_SYMBOL_NODE',
    setOffset = 'SET_OFFSET_NODE',
    setFrequency = 'SET_FREQUENCY_NODE',
    setPhase = 'SET_PHASE_NODE',
    setAmplitude = 'SET_AMPLITUDE_NODE'
};

export type ChainOperationTarget = 'mainOperation' | 'inputOperation' | 'outputOperation';

export type ChainOperationTargetLabels = {
    [x in ChainOperationTarget]: string;
};

export const operationLabels: ChainOperationTargetLabels = {
    mainOperation: 'main operation',
    inputOperation: 'pre operation',
    outputOperation: 'post operation'
};

export interface ChainActionPayload<T> {
    index?: number,
    node?: ChainNode<T>,
    target?: ChainOperationTarget,
    value?: any,
    from?: number,
    to?: number
};

export interface ChainAction<T> {
    type: ChainActionType,
    payload: ChainActionPayload<T>
}

export const addNode = <T>(node: ChainNode<T>, index?: number): ChainAction<T> => {
    return {
        type: ChainActionType.add,
        payload: {
            node,
            index
        }
    };
};

export const removeNode = <T>(index?: number): ChainAction<T> => {
    return {
        type: ChainActionType.remove,
        payload: { index }
    };
};

export const replaceNode = <T>(node: ChainNode<T>, index: number): ChainAction<T> => {
    return {
        type: ChainActionType.replace,
        payload: {
            node,
            index
        }
    };
};

export const exchangeNode = <T>(from: number, to: number): ChainAction<T> => {
    return {
        type: ChainActionType.exchange,
        payload: {
            from,
            to
        }
    };
};

export const moveNode = <T>(from: number, to: number): ChainAction<T> => {
    return {
        type: ChainActionType.move,
        payload: {
            from,
            to
        }
    };
};

export const bypassNode = <T>(index: number, value: boolean): ChainAction<T> => {
    return {
        type: ChainActionType.bypass,
        payload: {
            index,
            value
        }
    };
};

export const setOffsetNode = <T>(index: number, target: ChainOperationTarget, value: T) => {
    return {
        type: ChainActionType.setOffset,
        payload: {
            index,
            target,
            value
        }
    }
}

export const setFrequencyNode = <T>(index: number, target: ChainOperationTarget, value: number): ChainAction<T> => {
    return {
        type: ChainActionType.setFrequency,
        payload: {
            index,
            target,
            value
        }
    };
};

export const setPhaseNode = <T>(index: number, target: ChainOperationTarget, value: number): ChainAction<T> => {
    return {
        type: ChainActionType.setPhase,
        payload: {
            index,
            target,
            value
        }
    };
};

export const setAmplitudeNode = <T>(index: number, target: ChainOperationTarget, value: T): ChainAction<T> => {
    return {
        type: ChainActionType.setAmplitude,
        payload: {
            index,
            target,
            value
        }
    };
};

export default {
    add: addNode,
    remove: removeNode,
    replace: replaceNode,
    exchange: exchangeNode,
    move: moveNode,
    bypass: bypassNode,
    setOffset: setOffsetNode,
    setFrequency: setFrequencyNode,
    setPhase: setPhaseNode,
    setAmplitude: setAmplitudeNode
};