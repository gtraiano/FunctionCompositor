import { State } from ".";
import Chain from "../classes/chain/Chain";

export const canvasDimensions = {
    width: 1500,
    height: 750,
    actualDimensions: () => ({
        width: canvasDimensions.width * window.devicePixelRatio,
        height: canvasDimensions.height * window.devicePixelRatio
    })
};

const chain = new Chain<number>();
  
export const initialState: State<number> = {
    chain: {
        chain,
        lastChangedOn: 0
    },
    input: {
        input: new Array(Math.ceil(canvasDimensions.actualDimensions().width)).fill(0).map((_v, i) => i),
        output: new Array(
            Math.ceil(canvasDimensions.actualDimensions().width)).fill(0).map((_v, i) => [i, undefined as unknown as number]
        )
    },
    canvas: canvasDimensions
};