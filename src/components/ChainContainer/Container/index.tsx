import style from './chaincontainer.module.css';
import { createRef, useEffect, useState } from "react";
import ChainNode from "../../../classes/chain/ChainNode";
import { useStateValue } from "../../../state";
import ChainActions, { ChainOperationTarget } from '../../../state/actions/chain';
import { OperationChangeEventProps, onFrequencyChange, onAmplitudeChange, onOffsetChange, onBypassChange, onDeleteNode, onPhaseChange, onEditNode } from '../../../events';
import ChainContainerNode from '../Node';
import AddNode from '../../AddNode';
import Overlay from '../../Overlay';
import BooleanFunction from '../../../classes/functions/preset/BooleanFunction';

const ChainContainer = () => {
    const [{ chain: { chain }}, dispatch] = useStateValue();
    const containerRef = createRef<HTMLDivElement>();       // used for adding custom even listeners
    const [bypass, setBypass] = useState<boolean>(false);   // whether all nodes bypassed
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    const [editIndex, setEditIndex] = useState<number | undefined>(undefined);

    // returns true if all nodes are bypassed
    const isAllBypassed = () => {
        return chain.nodes.reduce((bp, n) => (n as ChainNode<any>).bypass && bp , true);
    }

    // bypass all nodes
    const bypassAll = async () => {
        chain.nodes.forEach((_n, i) => dispatch(ChainActions.bypass(i, !bypass)));
        setBypass(v => !v);
    };

    // NOTE
    // We could have used dispatch directly in the child component instead
    // Proceeded with the publish-subscribe pattern for educational purposes!
    const onBypassChangeHandler = async (e: Event) => {
        e.stopPropagation();
        const { index, value } = (e as CustomEvent).detail as OperationChangeEventProps
        dispatch(ChainActions.bypass(index, Boolean(value)));
    }

    const onFrequencyChangeHandler = async (e: Event) => {
        e.stopPropagation();
        const { index, value, opTarget } = (e as CustomEvent).detail as OperationChangeEventProps
        dispatch(ChainActions.setFrequency(index, opTarget as ChainOperationTarget, Number.parseFloat(value)));
    };

    const onPhaseChangeHandler = async (e: Event) => {
        e.stopPropagation();
        const { index, value, opTarget } = (e as CustomEvent).detail as OperationChangeEventProps
        dispatch(ChainActions.setPhase(index, opTarget as ChainOperationTarget, Number.parseFloat(value)));
    };

    const onAmplitudeChangeHandler = async (e: Event) => {
        e.stopPropagation();
        const { index, value, opTarget } = (e as CustomEvent).detail as OperationChangeEventProps
        dispatch(ChainActions.setAmplitude(index, opTarget as ChainOperationTarget, Number.parseFloat(value)));
    };

    const onOffsetChangeHandler = async (e: Event) => {
        e.stopPropagation();
        const { index, value, opTarget } = (e as CustomEvent).detail as OperationChangeEventProps
        (chain.nodes[index] as ChainNode<any>)[opTarget as ChainOperationTarget] instanceof BooleanFunction
            ? dispatch(ChainActions.setOffset(index, opTarget as ChainOperationTarget, Boolean(value)))
            : dispatch(ChainActions.setOffset(index, opTarget as ChainOperationTarget, Number.parseFloat(value)));
    };

    const onDeleteNodeHandler = async (e: Event) => {
        e.stopPropagation();
        const toDelete = (e.currentTarget as HTMLElement).children.item((e as CustomEvent).detail.index);
        if(window.confirm('Delete node?')) {
            toDelete?.setAttribute('deleting', '');
            // wait 1s for the animation to complete, then dispatch action
            await new Promise((resolve) => {
                setTimeout(() => {
                    try {
                        resolve(dispatch(ChainActions.remove((e as CustomEvent).detail.index as number)));
                    }
                    catch(e: any) {
                        console.log(e.message);
                    }
                }, 1000);
            });
        }
    };

    const onEditNodeHandler = (e: Event) => {
        setEditIndex((e as CustomEvent).detail.index);
        setShowOverlay(true);
    };

    useEffect(() => {
        if(containerRef.current) {
            containerRef.current.addEventListener(onFrequencyChange.eventName, onFrequencyChangeHandler);
            containerRef.current.addEventListener(onPhaseChange.eventName, onPhaseChangeHandler);
            containerRef.current.addEventListener(onAmplitudeChange.eventName, onAmplitudeChangeHandler);
            containerRef.current.addEventListener(onOffsetChange.eventName, onOffsetChangeHandler);
            containerRef.current.addEventListener(onBypassChange.eventName, onBypassChangeHandler);
            containerRef.current.addEventListener(onDeleteNode.eventName, onDeleteNodeHandler);
            containerRef.current.addEventListener(onEditNode.eventName, onEditNodeHandler);
        }
        
        return () => {
            if(containerRef.current) {
                containerRef.current.removeEventListener(onFrequencyChange.eventName, onFrequencyChangeHandler);
                containerRef.current.removeEventListener(onPhaseChange.eventName, onPhaseChangeHandler);
                containerRef.current.removeEventListener(onAmplitudeChange.eventName, onAmplitudeChangeHandler);
                containerRef.current.removeEventListener(onOffsetChange.eventName, onOffsetChangeHandler);
                containerRef.current.removeEventListener(onBypassChange.eventName, onBypassChangeHandler);
                containerRef.current.removeEventListener(onDeleteNode.eventName, onDeleteNodeHandler);
                containerRef.current.removeEventListener(onEditNode.eventName, onEditNodeHandler);
            }
        }
    }, []);
    
    return (
        <>
        <div className={style['chain-container']} ref={containerRef}>
            
            { chain.nodes.map((n, i) => <ChainContainerNode node={n as ChainNode<any>} key={`node_${i}`} index={i} />) }
        </div>
        <div className={style['chain-container-control']}>
            <button
                disabled={!chain.nodes.length}
                all-bypassed={isAllBypassed().toString()}
                className={style['bypass-all-btn']}
                onClick={bypassAll}
            />
            <button className={style['add-node-btn']} onClick={() => { setShowOverlay(true); }}>add node</button>
        </div>
        <Overlay onClose={() => { setShowOverlay(false); setEditIndex(undefined); }} show={showOverlay}>
            <AddNode onReset={() => { setShowOverlay(false); setEditIndex(undefined); }} index={editIndex} />
        </Overlay>
        </>
    )
}

export default ChainContainer;