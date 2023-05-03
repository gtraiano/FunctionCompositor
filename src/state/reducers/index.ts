import { reducer as chainReducer } from "./chain";
import { reducer as inputReducer } from "./input";
import { State } from "..";
import { Action, ChainAction, InputAction } from "../actions";
import { canvasDimensions } from "../initialState";

export const reducer = <T>({ chain, input }: State<T>, action: Action<T>): State<T> => ({
  chain: chainReducer(chain, action as ChainAction<T>),
  input: inputReducer(input, action as InputAction<T>),
  canvas: canvasDimensions
});