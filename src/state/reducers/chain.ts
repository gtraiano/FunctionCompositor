import Chain from "../../classes/chain/Chain";
import ChainNode from "../../classes/chain/ChainNode";
import GenericFunction from "../../classes/functions/GenericFunction";
import PeriodicFunction from "../../classes/functions/preset/PeriodicFunction";
import { ChainAction, ChainActionType } from "../actions/chain";

export interface ChainState<T> {
    chain: Chain<T>,
    lastChangedOn: number   // since the Chain class handles its own state internally, we use this property to signal changes
}

export const reducer = <T>(state: ChainState<T>, action: ChainAction<T>): ChainState<T> => {
    try {
        switch (action.type) {
            // chain actions
            case ChainActionType.add:
                action.payload.node && state.chain.add(action.payload.node, action.payload.index);
                break;
            
            case ChainActionType.remove:
                state.chain.remove(action.payload?.index);
                break;

            case ChainActionType.replace:
                action.payload.index !== undefined
                && (state.chain.nodes[action.payload.index] as ChainNode<T>) !== undefined
                && action.payload.node !== undefined
                && (state.chain.nodes[action.payload.index] = action.payload.node);
                break;
    
            case ChainActionType.exchange:
                action.payload.from !== undefined && action.payload.to !== undefined
                && state.chain.swap(action.payload.from, action.payload.to);
                break;
    
            case ChainActionType.move:
                action.payload.from !== undefined && action.payload.to !== undefined
                && state.chain.move(action.payload.from, action.payload.to);
                break;
            
            // node actions
            case ChainActionType.bypass:
                action.payload.index !== undefined && (action.payload.value !== undefined)
                && ((state.chain.nodes[action.payload.index] as ChainNode<T>).bypass = action.payload.value as boolean);
                break;
    
            case ChainActionType.setOffset:
                action.payload.index !== undefined
                && action.payload.target !== undefined
                && action.payload.value !== undefined
                && (state.chain.nodes[action.payload.index] as ChainNode<T>)[action.payload.target] instanceof GenericFunction
                && (
                    ((state.chain.nodes[action.payload.index] as ChainNode<T>)
                        [action.payload.target] as unknown as GenericFunction<T>)
                            ?.setOffset(action.payload.value as T)
                );
                break;
            
            case ChainActionType.setFrequency:
                action.payload.index !== undefined
                && action.payload.target !== undefined
                && typeof action.payload.value === 'number'
                && (state.chain.nodes[action.payload.index] as ChainNode<T>)[action.payload.target] instanceof PeriodicFunction
                && (
                    ((state.chain.nodes[action.payload.index] as ChainNode<T>)
                        [action.payload.target] as unknown as PeriodicFunction)
                            ?.setFrequency(action.payload.value as number)
                );    
                break;

            case ChainActionType.setPhase:
                action.payload.index !== undefined
                && action.payload.target !== undefined
                && typeof action.payload.value === 'number'
                && (state.chain.nodes[action.payload.index] as ChainNode<T>)[action.payload.target] instanceof PeriodicFunction
                && (
                    ((state.chain.nodes[action.payload.index] as ChainNode<T>)
                        [action.payload.target] as unknown as PeriodicFunction)
                            ?.setPhase(action.payload.value as number)
                );    
                break;
                
            case ChainActionType.setAmplitude:
                action.payload.index !== undefined
                && action.payload.target !== undefined
                && typeof action.payload.value === 'number'
                && (state.chain.nodes[action.payload.index] as ChainNode<T>)[action.payload.target] instanceof PeriodicFunction
                && (
                    ((state.chain.nodes[action.payload.index] as ChainNode<T>)
                        [action.payload.target] as unknown as PeriodicFunction)
                            ?.setAmplitude(action.payload.value as number)
                );
                break;
    
            default:
                return state;
        }
        return { chain: state.chain, lastChangedOn: Date.now() };
    }
    catch(e: any) {
        console.error(`Error in action ${action.type}: ${e.message}`)
        return state;
    }
};