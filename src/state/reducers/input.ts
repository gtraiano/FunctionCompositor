import { InputAction, InputActionAtIndex, InputActionType } from "../actions/input";

export type InputState<T> = {
    input: T[],     // holds input values
    output: T[][]   // holds [input, output] value pairs
};

export const reducer = <T>(state: InputState<T>, action: InputAction<T>): InputState<T> => {
    switch (action.type) {
        case InputActionType.setInput:
            return {
                ...state,
                input: action.payload as unknown as T[]
            }

        case InputActionType.setInputAtIndex:
            return (action.payload as InputActionAtIndex<T>).index < 0 || (action.payload as InputActionAtIndex<T>).index > state.input.length - 1 
                ? state
                : {
                      ...state,
                      input: state.input.map((n, i) => i !== (action.payload as InputActionAtIndex<T>).index ? n : (action.payload as InputActionAtIndex<T>).value)
                  }

        case InputActionType.setOutput:
            return {
                ...state,
                output: action.payload as unknown as T[][]
            }

        case InputActionType.insertInputAtIndex:
            return (action.payload as InputActionAtIndex<T>).index < 0 || (action.payload as InputActionAtIndex<T>).index > state.input.length + 1
                    || (action.payload as InputActionAtIndex<T>).value === undefined
                ? state
                : {
                    input: [
                        ...state.input.slice(0, (action.payload as InputActionAtIndex<T>).index),
                        (action.payload as InputActionAtIndex<T>).value,
                        ...state.input.slice((action.payload as InputActionAtIndex<T>).index)
                    ],
                    output: [
                        ...state.output.slice(0, (action.payload as InputActionAtIndex<T>).index),
                        [(action.payload as InputActionAtIndex<T>).value, undefined as T],
                        ...state.output.slice((action.payload as InputActionAtIndex<T>).index)
                    ]
                };

        case InputActionType.removeInputAtIndex:
            return (action.payload as InputActionAtIndex<T>).index < 0 || (action.payload as InputActionAtIndex<T>).index > state.input.length - 1
                ? state
                : {
                    input: [
                        ...state.input.slice(0, (action.payload as InputActionAtIndex<T>).index),
                        ...state.input.slice((action.payload as InputActionAtIndex<T>).index + 1)
                    ],
                    output: [
                        ...state.output.slice(0, (action.payload as InputActionAtIndex<T>).index),
                        ...state.output.slice((action.payload as InputActionAtIndex<T>).index + 1)
                    ]
                };

        default:
            return state;
    }
};