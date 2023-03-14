import React, { createContext, useContext, useReducer } from "react";
import { ChainState } from "./reducers/chain";
import { Action } from "./actions";
import { InputState } from "./reducers/input";
import { reducer } from "./reducers";
import { initialState } from "./initialState";

export interface State<T> {
    chain: ChainState<T>;
    input: InputState<T>;
    canvas: {
        width: number,
        height: number
    }
};

export const StateContext = createContext<[State<number>, React.Dispatch<Action<number>>]>([
    initialState,
    () => initialState
]);
  
type StateProviderProps = {
    children: React.ReactElement;
};

export const StateProvider: React.FC<StateProviderProps> = ({ children }: StateProviderProps) => {
    const [state, dispatch] = useReducer(reducer<number>, initialState);
    return (
      <StateContext.Provider value={React.useMemo(() => [state, dispatch], [state, dispatch])}>
          {children}
      </StateContext.Provider>
    );
};

export const useStateValue = () => useContext(StateContext);