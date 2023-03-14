import style from './style.module.css';
import { useState, SyntheticEvent } from "react";
import { useStateValue } from "../../../state";
import InputActions from '../../../state/actions/input';

interface EditInputCell {
    index: number | undefined,  // table cell index being edited
    value: string               // table cell edited value
};

const ValuesTable = () => {
    const [{ input: { input, output }}, dispatch] = useStateValue();
    // used to hold temp value of table cell being edited (inputs in table td's are controlled and thus do not allow editing)
    const [editInputCell, setEditInputCell] = useState<EditInputCell>({
        index: undefined,
        value: ''
    });

    const editableCellInputHandler = (index: number) => async (e: SyntheticEvent) => {
        // update temp value
        setEditInputCell({
            index,
            value: (e.currentTarget as HTMLInputElement).value
        });
    };

    const editableCellKeydownHandler = (index: number) => (e: SyntheticEvent) => {
        const key = (e as unknown as KeyboardEvent).key;
        // listen for enter keystroke
        if(key === 'Enter' || key === 'NumpadEnter') {
            // lose focus
            (e.currentTarget as HTMLInputElement).blur();
        }
        // esc will leave cell value unchanged
        else if(key === 'Escape') {
            (e.currentTarget as HTMLInputElement).value = input[index].toString();
            (e.currentTarget as HTMLInputElement).blur();
        }
    };

    const editableCellBlurHandler = (index: number) => async (e: SyntheticEvent) => {
        // on lost focus, dispatch updated input value
        const parsed = (e.currentTarget as HTMLInputElement).valueAsNumber;
        // value is a number and is different from previous input table value
        if(!Number.isNaN(parsed) && parsed !== input[index]) {
            dispatch(InputActions.setInputAtIndex(parsed, index));
            // clear temp value
            setEditInputCell({ index: undefined, value: '' });
        }
        else {
            // restore to original input value
            (e.currentTarget as HTMLInputElement).value = input[index].toString();
        }
    };

    const addRowAfterHandler = (index: number) => () => {
        // insert NaN, user will fill in actual value
        dispatch(InputActions.insertInputAtIndex(Number.NaN, index + 1));
    };

    const removeRow = (index: number) => () => {
        dispatch(InputActions.removeInputAtIndex(index));
    };

    const generateTableBody = () => {
        //return output.map(([x, y], i) =>
        return input.map((x, i) =>
            <tr key={`value_${i}`}>
                <td>{i}</td>
                <td>
                    <input
                        type="number"
                        step="0.1"
                        value={i !== editInputCell.index ? x.toString() : editInputCell.value}  // bind value to actual state or temp value when editing
                        onChange={editableCellInputHandler(i)}
                        onKeyDown={editableCellKeydownHandler(i)}
                        onBlur={editableCellBlurHandler(i)}
                    />
                </td>
                <td>{output[i] && output[i][1] !== undefined ? output[i][1].toString() : ''}</td>
                <td className={style['action']}>
                    <span title='delete row' onClick={removeRow(i)}>&times;</span>
                    <span title='add row' onClick={addRowAfterHandler(i)}>+</span>
                </td>
            </tr>
        );
    };

    return (
            <section className={style['input-container-values']}>
                <table>
                    <thead>
                        <tr>
                            <th>index</th>
                            <th>input</th>
                            <th>output</th>
                            <th>actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    {generateTableBody()}
                    </tbody>
                </table>
            </section>
    );
}

export default ValuesTable;