import './App.css';
import { useEffect } from 'react';
import { useStateValue } from './state';
import InputActions from './state/actions/input';
import Canvas from './components/Canvas';
import ChainContainer from './components/ChainContainer';
import InputContainer from './components/InputContainer';

function App() {
    const [{ chain: { chain, lastChangedOn }, input: { input }, canvas }, dispatch] = useStateValue();

    const calculateSeries = async () => {
      const y = await chain.calculateSeries(input);
      dispatch(InputActions.setOutput(input.map((x, i) => [x, y[i]])));
    };

    useEffect(() => {
        calculateSeries();
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
      </div>
  );
}

export default App
