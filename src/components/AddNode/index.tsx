import style from './style.module.css';
import { useStateValue } from '../../state';
import ChainActions from '../../state/actions/chain';
import { BaseSyntheticEvent, SyntheticEvent, useEffect, useState } from 'react';
import ChainNode from '../../classes/chain/ChainNode';
import { operationLabels, ChainOperationTarget } from '../../state/actions';
import { allOperationsPresets, TargetOperationProps, FormFieldName, OperationProps, OperationStyle, OperationType } from './types';
import analyzeNode, { parseOperation } from './helper';

interface AddNodeProps {
    onReset?: () => void,   // if defined, overrides default form reset behaviour
    onSubmit?: () => void,  // if defined, overrides default form submit behaviour
    index?: number          // if defined, loads values from existing node in chain
};

const defaultOperation: OperationProps = {
    type: OperationType.arithmetic,
    style: OperationStyle.preset,
    symbol: Object.keys(allOperationsPresets[OperationType.arithmetic])[0],
    callback: Object.keys(allOperationsPresets[OperationType.arithmetic])[0],
    frequency: '0',
    phase: '0',
    amplitude: '1',
    offset: '0'
};

const defaultInitialNode: TargetOperationProps = {
    mainOperation: { ...defaultOperation },
    inputOperation: { ...defaultOperation, style: OperationStyle.none },
    outputOperation: { ...defaultOperation, style: OperationStyle.none }
};

const AddNode = ({ onReset, onSubmit, index }: AddNodeProps) => {
    const [{ chain: { chain }}, dispatch] = useStateValue();
    const [insertIndex, setInsertIndex] = useState<number>(index !== undefined && index >= 0 && index < chain.nodes.length ? index : -1);
    const [insertOperations, setInsertOperations] = useState<TargetOperationProps>(
        index === undefined
            ? defaultInitialNode
            : analyzeNode(chain.nodes[index] as ChainNode<any>) ?? defaultInitialNode
    );

    useEffect(() => {
        if(index !== undefined && chain.nodes[index] === undefined) {
            console.warn(`AddNode: chain node at index ${index} is undefined, loaded default initial node values`);
        }
    }, [index]);

    const parseNode = (node: TargetOperationProps = insertOperations) => {
        return new ChainNode<number>({
            mainOperation: parseOperation(node.mainOperation),
            inputOperation: parseOperation(node.inputOperation),
            outputOperation: parseOperation(node.outputOperation)
        });
    };

    const updateInsertOperations = (targetOp: ChainOperationTarget) => (e: BaseSyntheticEvent) => {
        const prop = e.currentTarget.name;
        const value = e.currentTarget.value;

        if(prop === FormFieldName.style) {
            setInsertOperations(op => ({
                ...op,
                [targetOp]: {
                    ...op[targetOp],
                    [prop]: value,
                    offset: '0',
                    frequency: '1',
                    phase: '0',
                    amplitude: '1',
                    callback: value !== OperationStyle.custom ? Object.keys(allOperationsPresets[op[targetOp].type as OperationType])[0] : '',
                    symbol: value !== OperationStyle.custom ? Object.keys(allOperationsPresets[op[targetOp].type as OperationType])[0] : ''
                }
            }));
        }
        else if(prop === FormFieldName.type) {
            setInsertOperations(op => ({
                ...op,
                [targetOp]: {
                    ...op[targetOp],
                    [prop]: value,
                    offset: '0',
                    frequency: '1',
                    phase: '0',
                    amplitude: '1',
                    callback: value !== OperationStyle.custom ? Object.keys(allOperationsPresets[value as OperationType])[0] : '',
                    symbol: value !== OperationStyle.custom ? Object.keys(allOperationsPresets[value as OperationType])[0] : ''
                }
            }));
        }
        else if(prop === FormFieldName.callback) {
            // need to sync callback and symbol properties
            setInsertOperations(op => ({
                ...op,
                [targetOp]: {
                    ...op[targetOp],
                    callback: value,
                    symbol: op[targetOp].style === OperationStyle.custom ? op[targetOp].symbol : value
                }
            }));
        }
        else {
            setInsertOperations(op => ({
                ...op,
                [targetOp]: {
                    ...op[targetOp],
                    [prop]: value
                }
            }));
        }
    };
    
    const defaultOnSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        if(window.confirm(`${insertIndex === -1 ? 'Add' : 'Save'} node?`)) {
            try {
                // inserting new node in chain
                if(index === undefined) {
                    dispatch(ChainActions.add(parseNode(), insertIndex === -1 ? undefined : insertIndex));
                }
                // replacing existing node in chain
                else {
                    dispatch(ChainActions.replace(parseNode(), index));
                    // swap with node at given index
                    if(index !== insertIndex)
                        dispatch(ChainActions.exchange(index, insertIndex));
                }
                onReset && onReset();
            }
            catch(error: any) {
                console.log('add node error', error.message);
                window.alert(`Could not ${insertIndex === -1 ? 'add' : 'save'} node. Reason: ${error.message}`);
            }
        }
    };

    const generateOperation = (target: ChainOperationTarget) => {
        return (
            <fieldset key={target}>
                <legend>{operationLabels[target]}</legend>

                <div className={style['row']}>
                    <label>style</label>
                    <select
                        name={FormFieldName.style}
                        value={insertOperations[target].style}
                        onChange={updateInsertOperations(target)}
                    >
                        <option value={OperationStyle.preset} label={OperationStyle.preset} />
                        <option value={OperationStyle.custom} label={OperationStyle.custom} />
                        <option value={OperationStyle.none} label={OperationStyle.none} />
                    </select>
                </div>

                {
                    insertOperations[target].style !== OperationStyle.none &&
                    <div className={style['row']}>
                        <label>type</label>
                        <select
                            name={FormFieldName.type}
                            value={insertOperations[target].type}
                            onChange={updateInsertOperations(target)}
                        >
                            <option value={OperationType.arithmetic} label={OperationType.arithmetic} />
                            <option value={OperationType.periodic} label={OperationType.periodic} />
                            <option value={OperationType.boolean} label={OperationType.boolean} />
                        </select>
                    </div>
                }

                {
                    insertOperations[target].style === OperationStyle.preset &&
                    <div className={style['row']}>
                        <label>function</label>
                        <select
                            name={FormFieldName.callback}
                            onChange={updateInsertOperations(target)}
                            value={insertOperations[target].symbol}
                        >
                            {Object.keys(allOperationsPresets[insertOperations[target].type as OperationType]).map(k => <option key={k} value={k} label={k}/>)}
                        </select>
                    </div>
                }

                {
                    insertOperations[target].style !== OperationStyle.none &&
                        <div className={style['row']}>
                        <label>symbol</label>
                        <input
                            name={FormFieldName.symbol}
                            type="text"
                            required
                            value={insertOperations[target].symbol}
                            onChange={updateInsertOperations(target)}
                        />
                    </div>
                }

                {
                    insertOperations[target].style !== OperationStyle.none &&
                    <div className={style['row']}>
                        <label>offset</label>
                        {
                            insertOperations[target].type !== OperationType.boolean
                            ? <input
                                name={FormFieldName.offset}
                                type="number"
                                step='0.1'
                                value={insertOperations[target].offset ?? 0}
                                onChange={updateInsertOperations(target)}
                              />
                            : <select onChange={updateInsertOperations(target)}>
                                <option value="1">true</option>
                                <option value="0">false</option>
                              </select>
                        }
                    </div>
                }

                {
                    insertOperations[target].style !== OperationStyle.none &&
                    insertOperations[target].type === OperationType.periodic &&
                    <div className={style['row']}>
                        <label>frequency</label>
                        <input
                            name={FormFieldName.frequency}
                            type="number"
                            min="1"
                            step='0.1'
                            value={insertOperations[target].frequency ?? 1}
                            onChange={updateInsertOperations(target)}
                        />
                    </div>
                }

                {
                    insertOperations[target].style !== OperationStyle.none &&
                    insertOperations[target].type === OperationType.periodic &&
                    <div className={style['row']}>
                        <label>phase</label>
                        <input
                            name={FormFieldName.phase}
                            type="number"
                            step='0.1'
                            min="0"
                            value={insertOperations[target].phase ?? 0}
                            onChange={updateInsertOperations(target)}
                        />
                    </div>
                }

                {
                    insertOperations[target].style !== OperationStyle.none &&
                    insertOperations[target].type === OperationType.periodic &&
                    <div className={style['row']}>
                        <label>amplitude</label>
                        <input
                            name={FormFieldName.amplitude}
                            type="number"
                            min={0}
                            step='0.1'
                            value={insertOperations[target].amplitude ?? 1}
                            onChange={updateInsertOperations(target)}
                        />
                    </div>
                }

                {
                    insertOperations[target].style === OperationStyle.custom &&
                    <div className={style['row']}>
                        <label>definition</label>
                        <textarea
                            name={FormFieldName.callback}
                            placeholder={insertOperations[target].type === OperationType.periodic
                                ? '(x, frequency, phase, amplitude) => (offset) => function definition'
                                : '(x) => (offset) => function definition'
                            }
                            value={insertOperations[target].callback}
                            required
                            onChange={updateInsertOperations(target)}
                        />
                    </div>
                }
            </fieldset>
        );
    };

    return (
        <form
            className={style['add-node']}
            onSubmit={!onSubmit ? defaultOnSubmit : onSubmit}
            onReset={onReset}
        >
            <fieldset>
                <legend>position in chain</legend>
                <div className={style['row']}>
                    <label>index</label>
                    <select
                        value={insertIndex}
                        disabled={
                            typeof index === 'number'
                                ? chain.nodes[index] === undefined
                                : false
                        }
                        onChange={e => { setInsertIndex(Number.parseInt(e.currentTarget.value)) } }
                    >
                        {
                            new Array(chain.nodes.length + 1).fill(0).map((_n, i) =>
                                <option
                                    key={`insert_at_${i}`}
                                    value={i < chain.nodes.length ? i : -1}
                                    label={i < chain.nodes.length ? i.toString() : 'tail'}
                                    disabled={i === index}
                                />
                            )
                        }
                    </select>
                </div>
            </fieldset>
            
            {
                Object.keys(operationLabels).map(op => generateOperation(op as ChainOperationTarget))
            }

            <div className={style['form-control-btns']}>
                <button type="submit">{index === undefined ? 'Add' : 'Save'}</button>
                <button type='reset'>Cancel</button>
            </div>
        </form>
    )
}

export default AddNode;