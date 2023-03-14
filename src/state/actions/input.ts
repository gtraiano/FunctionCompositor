export enum InputActionType {
    setInput = 'SET_INPUT',
    setOutput = 'SET_OUTPUT',
    setInputAtIndex = 'SET_INPUT_INDEX',
    insertInputAtIndex = 'INSERT_INPUT_INDEX',
    removeInputAtIndex = 'REMOVE_INPUT_INDEX'
};

type InputActionPayload<T> = T[] | T[][];

export interface InputActionAtIndex<T> {
    index: number,
    value: T
}

export interface InputAction<T> {
    type: InputActionType,
    payload: InputActionPayload<T> | InputActionAtIndex<T>
};

export const setInput = <T>(values: T[]): InputAction<T> => {
    return {
        type: InputActionType.setInput,
        payload: values as T[]
    }
};

export const setOutput = <T>(values: T[][]): InputAction<T> => {
    return {
        type: InputActionType.setOutput,
        payload: values
    }
};

export const setInputAtIndex = <T>(value: T, index: number): InputAction<T> => {
    return {
        type: InputActionType.setInputAtIndex,
        payload: {
            index,
            value
        }
    }
};

export const insertInputAtIndex = <T>(value: T, index: number): InputAction<T> => {
    return {
        type: InputActionType.insertInputAtIndex,
        payload: {
            index,
            value
        }
    }
};

export const removeInputAtIndex = <T>(index: number): InputAction<T> => {
    return {
        type: InputActionType.removeInputAtIndex,
        payload: {
            index,
            value: undefined as T
        }
    }
};

export default {
    setInput,
    setOutput,
    setInputAtIndex,
    insertInputAtIndex,
    removeInputAtIndex
};