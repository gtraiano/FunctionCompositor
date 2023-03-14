import style from './inputcontainer.module.css';
import { useStateValue } from "../../../state";
import InputActions from '../../../state/actions/input';
import { SyntheticEvent, useState } from 'react';
import ValuesTable from '../Table';

interface InputGenerateParams {
    start: number,
    end: number,
    step: number
}

const InputContainer = () => {
    const [{ input: { input, output }}, dispatch] = useStateValue();
    const [inputGenerateParams, setInputGenerateParams] = useState<InputGenerateParams>({ start: input[0], end: input[input.length - 1], step: 1 });
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

    const onChange = (e: SyntheticEvent) => {
        const name = (e.currentTarget as HTMLInputElement).name;
        const value = (e.currentTarget as HTMLInputElement).valueAsNumber;
        setInputGenerateParams(p => ({ ...p, [name]: value }));
    };

    const generateInput = () => {
        const { start, end, step } = inputGenerateParams;
        if(step === 0) return;
        
        if(input.length && window.confirm('Replace current input?')) {
            const newInput = new Array(Math.ceil((Math.abs(end - start)) / step) + 1).fill(0).map((_n, i) => start + step * i);
            dispatch(InputActions.setInput(newInput))
        }
        /*if(input.length) {
            window.confirm('Replace current input?') && dispatch(InputActions.setInput(newInput));
        }*/
    };

    return (
        <article className={`${style['input-container']} ${isCollapsed ? style['collapsed'] : ''}`}>
            <span className={style['collapse-btn']} onClick={() => setIsCollapsed(v => !v)}>{ isCollapsed ? '🗖' : '🗕'}</span>
            { !isCollapsed && <ValuesTable />}
            { !isCollapsed &&
                <section style={{width: '50%', overflow: 'auto'}}>
                <p>
                    {[...new Set(input)].length} distinct input values <br/>
                    {[...new Set(output.map(y => y[1]))].length} distinct output values
                </p>
                <p className={style['range']}>
                    &#91; 
                        <input type='number' name='start' value={inputGenerateParams.start.toString()} onChange={onChange}/>
                        ,&nbsp;
                        <input type='number' name='end' value={inputGenerateParams.end.toString()} onChange={onChange}/>
                    &#93;
                    step <input type='number' name='step' value={inputGenerateParams.step.toString()} onChange={onChange}/>
                    &nbsp;<button onClick={generateInput}>generate</button>
                </p>
            </section>}
        </article>
    );
}

export default InputContainer;