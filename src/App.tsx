import './App.css';
import { useEffect, useTransition } from 'react';
import { useStateValue } from './state';
import InputActions from './state/actions/input';
import Canvas from './components/Canvas';
import ChainContainer from './components/ChainContainer';
import InputContainer from './components/InputContainer';
import Overlay from './components/Overlay';
import BusyScreen from './components/BusyScreen';

function App() {
    const [{ chain: { chain, lastChangedOn }, input: { input }, canvas }, dispatch] = useStateValue();
    const [isPending, startTransition] = useTransition();

    const calculateSeries = async () => {
        const y = await chain.calculateSeries(input);
        dispatch(InputActions.setOutput(input.map((x, i) => [x, y[i]])));
    };

    useEffect(() => {
        // debounce chain calculation
        const timer = setTimeout(async () => {
            startTransition(() => {
                calculateSeries()
            })
        }, 350);

        return () => {
            clearInterval(timer);
        }
    }, [lastChangedOn, input]);
  
    return (
        <div className="App">
            <section style={{ width: 'fit-content', height: 'fit-content' }}>
                <Canvas width={canvas?.width} height={canvas?.height} />
            </section>
            <section>
                <article><ChainContainer /></article>
                <article><InputContainer /></article>
            </section>
            <Overlay
                show={isPending && chain.nodes.length > 0}
            >
                <BusyScreen/>
            </Overlay>
        </div>
    );
}

export default App
