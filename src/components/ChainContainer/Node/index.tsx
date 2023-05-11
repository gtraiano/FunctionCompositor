import style from './chaincontainernode.module.css';
import { SyntheticEvent } from "react";
import ChainNode from "../../../classes/chain/ChainNode";
import PeriodicFunction from "../../../classes/functions/preset/PeriodicFunction";
import GenericFunction from '../../../classes/functions/GenericFunction';
import { ChainOperationTarget, operationLabels } from '../../../state/actions/chain';
import { onBypassChange, onFrequencyChange, onAmplitudeChange, onOffsetChange, onDeleteNode, onPhaseChange, onEditNode } from '../../../events';
import BooleanFunction from '../../../classes/functions/preset/BooleanFunction';
import CustomFunction from '../../../classes/functions/custom/CustomFunction';
import CustomBooleanFunction from '../../../classes/functions/custom/CustomBoolean';
import Tab from '../../Tabs/Tab';
import Tabs from '../../Tabs/Tabs';

interface ChainNodeProps<T> {
    node: ChainNode<T>, // ChainNode object
    index: number       // ChainNode index in Chain
}

function ChainContainerNode<T>({ node, index }: ChainNodeProps<T>) {
    if(!node) return null;

    // NOTE
    // We could have used dispatch directly instead of emitting events to the parent component
    // Proceeded with the publish-subscribe for educational purposes!
    // dispatch custom events to parent element
    const handleBypassInput = (e: SyntheticEvent) => {
        const value = (e.currentTarget as HTMLInputElement).checked;
        onBypassChange.dispatch(e.currentTarget as HTMLElement, { index, value, opTarget: undefined });
    };

    // general handler for numeric input
    const numberInputHandler = (e: SyntheticEvent, onValid: () => any, onInvalid?: () => any) => {
        e.stopPropagation();
        (e.target as HTMLInputElement).setCustomValidity('');
        // tab, left and right arrow are no-operation input values
        if(/tab|left|right/gi.test((e.nativeEvent as KeyboardEvent).key)) return;
        // we expect only numeric values
        if(Number.isNaN((e.target as HTMLInputElement).valueAsNumber)) {
            // mark input as invalid
            // combine with css in order to draw attention to erroneous field
            (e.target as HTMLInputElement).setCustomValidity('Input must be a number');
        }
        // execute callback depending on input validity
        if((e.target as HTMLInputElement).validity.valid) {
            typeof onValid === 'function' && onValid();
        }
        else {
            typeof onInvalid === 'function' && onInvalid();
        }
    };

    const handleFrequencyInput = (opTarget: ChainOperationTarget) => (e: SyntheticEvent) => {
        const value = (e.currentTarget as HTMLInputElement).valueAsNumber;
        numberInputHandler(
            e,
            () => {
                value !== ((node as ChainNode<any>)[opTarget] as PeriodicFunction).getFrequency()
                && onFrequencyChange.dispatch(e.currentTarget as HTMLElement, { index, value, opTarget });
            },
            () => {
                // on Esc key press, update input value with actual value from ChainNode
                if((e.nativeEvent as KeyboardEvent).key === 'Escape') {
                    (e.target as HTMLInputElement).value = ((node as ChainNode<any>)[opTarget] as PeriodicFunction).getFrequency().toString();
                    (e.target as HTMLInputElement).setCustomValidity('');
                }   
            }
        );
    };

    const handlePhaseInput = (opTarget: ChainOperationTarget) => (e: SyntheticEvent) => {
        const value = (e.currentTarget as HTMLInputElement).valueAsNumber;
        numberInputHandler(
            e,
            () => {
                value !== ((node as ChainNode<any>)[opTarget] as PeriodicFunction).getPhase()
                && onPhaseChange.dispatch(e.currentTarget as HTMLElement, { index, value, opTarget });
            },
            () => {
                if((e.nativeEvent as KeyboardEvent).key === 'Escape') {
                    (e.target as HTMLInputElement).value = ((node as ChainNode<any>)[opTarget] as PeriodicFunction).getPhase().toString();
                    (e.target as HTMLInputElement).setCustomValidity('');
                }   
            }
        );
    };

    const handleAmplitudeInput = (opTarget: ChainOperationTarget) => (e: SyntheticEvent) => {
        const value = (e.currentTarget as HTMLInputElement).valueAsNumber;
        numberInputHandler(
            e,
            () => {
                value !== ((node as ChainNode<any>)[opTarget] as PeriodicFunction).getAmplitude()
                && onAmplitudeChange.dispatch(e.currentTarget as HTMLElement, { index, value, opTarget });
            },
            () => {
                if((e.nativeEvent as KeyboardEvent).key === 'Escape') {
                    (e.target as HTMLInputElement).value = ((node as ChainNode<any>)[opTarget] as PeriodicFunction).getAmplitude().toString();
                    (e.target as HTMLInputElement).setCustomValidity('');
                }   
            }
        );
    };

    const handleOffsetInput = (opTarget: ChainOperationTarget) => (e: SyntheticEvent) => {
        const value = (e.currentTarget as HTMLInputElement).valueAsNumber;
        numberInputHandler(
            e,
            () => {
                value !== node[opTarget]?.getOffset()
                && onOffsetChange.dispatch(e.currentTarget as HTMLElement, { index, value, opTarget });
            },
            () => {
                if((e.nativeEvent as KeyboardEvent).key === 'Escape') {
                    (e.target as HTMLInputElement).value = ((node as ChainNode<any>)[opTarget] as PeriodicFunction).getOffset()?.toString() ?? '0';
                    (e.target as HTMLInputElement).setCustomValidity('');
                }   
            }
        );
    };

    const handleDeleteNode = (e: SyntheticEvent) => {
        onDeleteNode.dispatch(e.currentTarget as HTMLElement, index);
    }

    const handleEditNode = (e: SyntheticEvent) => {
        onEditNode.dispatch(e.currentTarget as HTMLElement, index);
    }

    // generates control panel for node operation
    const generateOperationPanel = (op: GenericFunction<any> | undefined, role: ChainOperationTarget) => {
        if(!op) return 'none';
        return (
            <div className={style['operation']}>
                <div>
                    <label>function</label>
                    <span
                        key={op?.getSymbol()}
                        title={op?.getCallback().toString()}
                    >
                        {op?.getSymbol()}
                    </span>
                </div>
                {
                    op instanceof CustomFunction
                    &&
                    <div>
                        <label>definition</label>
                        <textarea
                            key={op?.getCallback().toString()}
                            readOnly
                            defaultValue={op?.getCallback().toString()}
                        />
                    </div>
                }
                {
                    op instanceof PeriodicFunction
                    &&
                    <>
                    <div>
                        <label>frequency</label>
                        <input
                            key={op.getFrequency()}
                            type="number"
                            step="any"
                            defaultValue={op.getFrequency() ?? ''}
                            onKeyUp={handleFrequencyInput(role)}
                            onMouseUp={handleFrequencyInput(role)}
                            disabled={node.bypass}
                        />
                    </div>
                    <div>
                        <label>phase</label>
                        <input
                            key={op.getPhase()}
                            type="number"
                            step="any"
                            defaultValue={op.getPhase() ?? ''}
                            onKeyUp={handlePhaseInput(role)}
                            onMouseUp={handlePhaseInput(role)}
                            disabled={node.bypass}
                        />
                    </div>
                    <div>
                        <label>amplitude</label>
                        <input
                            key={op.getAmplitude()}
                            type="number"
                            step="any" min="0"
                            defaultValue={op.getAmplitude() ?? ''}
                            onKeyUp={handleAmplitudeInput(role)}
                            onMouseUp={handleAmplitudeInput(role)}
                            disabled={node.bypass}
                        />
                    </div>
                    </>
                }
                <div>
                    <label>offset</label>
                    {
                        op instanceof BooleanFunction || op instanceof CustomBooleanFunction
                        ? <select
                            key={String(op.getOffset())}
                            defaultValue={String(op.getOffset() ?? 0)}
                            onChange={handleOffsetInput(role)}
                            disabled={node.bypass || op.getOffset() === undefined}
                          >
                            <option value="1">true</option>
                            <option value="0">false</option>
                          </select>
                        : <input
                            key={op.getOffset()}
                            type="number"
                            step="any"
                            defaultValue={op.getOffset() ?? ''}
                            onKeyUp={handleOffsetInput(role)}
                            onMouseUp={handleOffsetInput(role)}
                            disabled={node.bypass || op.getOffset() === undefined}
                          />
                    }
                </div>
            </div>
        );
    };
    
    return (
        <div
            className={`${style['chain-container-node']} ${node.bypass ? style['bypassed'] : ''}`}
        >
            <span className={style['delete-btn']} title="delete node" onClick={handleDeleteNode}/>
            <span className={style['edit-btn']} title="edit node" onClick={handleEditNode}/>
            <div className={style['bypass']}>
                <input id={`bypass_${index}`} type="checkbox" checked={node.bypass} onChange={handleBypassInput} />
                <label htmlFor={`bypass_${index}`}>bypass</label>
            </div>
            <Tabs>
            {
                Object.entries(operationLabels).map(([key, value]) =>
                    // extract first word from operation label for title
                    (<Tab
                        key={`tab_${index}_${key}`}
                        title={(value.match(/^\w+\b/) as RegExpMatchArray)[0] ?? value}
                     >
                        <div key={`node_${index}_${key}`} className={style['operation-container']}>
                            <h4 className={style['operation-header']}>{value}</h4>
                            {generateOperationPanel(node[key as ChainOperationTarget], key as ChainOperationTarget)}
                        </div>
                    </Tab>)
                )
            }
            </Tabs>
        </div>
    );
};

export default ChainContainerNode;